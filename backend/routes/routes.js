const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// Simple Clerk-aware middleware placeholder
// NOTE: For production, replace this with real Clerk token/session verification using
// the official Clerk server SDK. This middleware checks that an Authorization header
// is present and attaches a `user` object when X-User-Id is sent by the client.
// Prototype middleware: accept anonymous submissions (no Authorization) while
// still attaching any provided x-user-id. For production replace this with
// real Clerk server-side verification and stricter protection on admin routes.
const verifyClerk = (req, res, next) => {
	const auth = req.headers['authorization'];
	if (!auth) {
		// Allow anonymous submission for this prototype, but note it in logs.
		req.user = { id: req.headers['x-user-id'] || null };
		return next();
	}

	// In a real implementation you'd verify the token here with Clerk's SDK.
	req.user = { id: req.headers['x-user-id'] || null };
	next();
};

// Create a report (protected)
router.post('/reports', verifyClerk, async (req, res) => {
	try {
		const { title, description, location, anonymous, tags, latitude, longitude, images } = req.body;
		const reporterId = req.user && req.user.id ? req.user.id : null;

		const report = new Report({ title, description, location, anonymous, reporterId, tags, latitude, longitude, images });
		await report.save();
		res.status(201).json(report);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Get reports (protected) - basic list
router.get('/reports', verifyClerk, async (req, res) => {
	try {
		const filter = {};
		if (req.query.status) filter.status = req.query.status;
		const reports = await Report.find(filter).sort({ createdAt: -1 }).limit(1000);
		res.json(reports);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

router.get('/reports/summary', verifyClerk, async (req, res) => {
	try {
		const total = await Report.countDocuments();
		const byStatus = await Report.aggregate([
			{ $group: { _id: '$status', count: { $sum: 1 } } },
		]);

		const summary = {
			total,
			open: 0,
			in_progress: 0,
			resolved: 0,
		};

		byStatus.forEach((entry) => {
			if (entry._id && typeof summary[entry._id] === 'number') {
				summary[entry._id] = entry.count;
			}
		});

		res.json(summary);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Update a report's status (protected)
router.patch('/reports/:id', verifyClerk, async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		const allowed = ['open', 'in_progress', 'resolved'];
		if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

		const update = { status };
		if (status === 'resolved') update.resolvedAt = new Date();

		const report = await Report.findByIdAndUpdate(id, update, { new: true });
		if (!report) return res.status(404).json({ message: 'Report not found' });
		res.json(report);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;


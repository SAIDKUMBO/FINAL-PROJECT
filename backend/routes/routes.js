const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadsDir);
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_');
		cb(null, `${Date.now()}-${base}${ext}`);
	}
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit per file

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
// Accept multipart/form-data with optional images[] files
router.post('/reports', verifyClerk, upload.array('images', 6), async (req, res) => {
	try {
		// When using multer, form fields are in req.body and files in req.files
		const { title, description, location, anonymous, tags, latitude, longitude } = req.body;
		const reporterId = req.user && req.user.id ? req.user.id : null;

		const images = (req.files || []).map(f => `/uploads/${f.filename}`);

		const parsedTags = typeof tags === 'string' && tags.length ? tags.split(',').map(t => t.trim()) : (Array.isArray(tags) ? tags : []);

		const report = new Report({ title, description, location, anonymous, reporterId, tags: parsedTags, latitude, longitude, images });
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


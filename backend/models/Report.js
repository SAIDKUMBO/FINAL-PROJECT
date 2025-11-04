const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  anonymous: { type: Boolean, default: true },
  reporterId: { type: String, default: null },
  tags: { type: [String], default: [] },
  images: { type: [String], default: [] },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
  resolvedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', ReportSchema);

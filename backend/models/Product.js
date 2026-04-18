const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  type: { type: String, required: true },
  thickness: { type: String, required: true },
  process: { type: String, required: true },
  applications: [{ type: String }],
  rateMin: { type: Number, required: true },
  rateMax: { type: Number, required: true },
  unit: { type: String, default: 'sqft' },
  description: { type: String },
  minThickness: { type: Number },
  safetyRating: { type: String, enum: ['standard', 'high', 'very_high'] },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  delivery: { type: String },
  priceModifier: { type: Number, default: 0 },
  specialties: [{ type: String }],
  verified: { type: Boolean, default: false },
  since: { type: Number },
  contact: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', vendorSchema);

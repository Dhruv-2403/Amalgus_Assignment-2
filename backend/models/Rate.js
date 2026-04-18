const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  date: { type: String, required: true },
  currency: { type: String, default: 'INR' },
  unit: { type: String, default: 'sqft' },
  rates: [{
    productId: { type: String }, // Can be ObjectId if needed, but keeping as string for seed compatibility
    type: { type: String },
    rate: { type: Number },
    change: { type: Number },
    changePercent: { type: Number }
  }],
  trend: { type: Map, of: [Number] },
  trendLabels: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rate', rateSchema);

const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product: {
    id: String,
    type: String,
    thickness: String,
    process: String
  },
  dimensions: {
    widthMm: Number,
    heightMm: Number,
    quantity: Number,
    sqft: Number,
    sqm: Number
  },
  estimate: {
    ratePerSqft: Number,
    glassCost: Number,
    installationCost: Number,
    hardwareCost: Number,
    gst: Number,
    totalEstimate: Number
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Estimate', estimateSchema);

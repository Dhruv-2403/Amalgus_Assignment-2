const mongoose = require('mongoose');

const alliedSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  compatibleWith: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Allied', alliedSchema);

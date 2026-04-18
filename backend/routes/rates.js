const express = require('express');
const router = express.Router();
const Rate = require('../models/Rate');

// GET /api/rates — today's rates + trend
router.get('/', async (req, res) => {
  try {
    const rateData = await Rate.findOne().sort({ createdAt: -1 });
    if (!rateData) return res.status(404).json({ success: false, message: 'No rate data found' });
    res.json({ success: true, data: rateData });
  } catch (err) {
    console.error('Fetch rates error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/rates/:productId
router.get('/:productId', async (req, res) => {
  try {
    const latestRate = await Rate.findOne().sort({ createdAt: -1 });
    if (!latestRate) return res.status(404).json({ success: false, message: 'No rate data found' });
    
    const rate = latestRate.rates.find(r => r.productId === req.params.productId);
    if (!rate) return res.status(404).json({ success: false, message: 'Rate not found for this product' });
    
    res.json({ success: true, data: rate });
  } catch (err) {
    console.error('Fetch specific rate error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

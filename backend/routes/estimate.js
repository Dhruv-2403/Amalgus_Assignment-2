const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const Allied = require('../models/Allied');
const Estimate = require('../models/Estimate');

// GET /api/estimate (Debug health check)
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Estimate service is active. Use POST to generate quotes.' });
});

// POST /api/estimate
router.post('/', async (req, res) => {
  try {
    console.log('📝 Received estimate request:', req.body);
    const { productId, widthMm, heightMm, quantity = 1, role = 'homeowner', userId } = req.body;

    if (!productId || !widthMm || !heightMm) {
      console.warn('⚠️ Missing required fields:', { productId, widthMm, heightMm });
      return res.status(400).json({ success: false, message: 'productId, widthMm, and heightMm are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
       console.warn('⚠️ Invalid Product ID format:', productId);
       return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      console.warn('⚠️ Product not found in DB:', productId);
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const sqm = (widthMm / 1000) * (heightMm / 1000);
    const sqft = sqm * 10.764;

    const midRate = (product.rateMin + product.rateMax) / 2;
    const glassAmt = Math.round(midRate * sqft * quantity);
    const installPct = role === 'dealer' ? 0 : 0.15;
    const install = Math.round(glassAmt * installPct);
    const hardware = Math.round(glassAmt * 0.08);
    const gst = Math.round((glassAmt + install + hardware) * 0.18);
    const total = glassAmt + install + hardware + gst;

    // Vendor quotes
    const vendors = await Vendor.find({ specialties: product.type });
    const vendorQuotes = vendors
      .slice(0, 3)
      .map(v => ({
        vendorId: v._id,
        vendorName: v.name,
        location: v.location,
        rating: v.rating,
        reviews: v.reviews,
        delivery: v.delivery,
        verified: v.verified,
        ratePerSqft: Math.round(midRate * (1 + v.priceModifier)),
        totalGlass: Math.round(midRate * (1 + v.priceModifier) * sqft * quantity),
        contact: v.contact
      }));

    // Suggested allied products
    const suggestedAllied = await Allied.find({ compatibleWith: product.type }).limit(4);

    const estimateData = {
      userId: userId || null,
      product: { id: product._id, type: product.type, thickness: product.thickness, process: product.process },
      dimensions: { widthMm, heightMm, quantity, sqft: parseFloat(sqft.toFixed(2)), sqm: parseFloat(sqm.toFixed(3)) },
      estimate: {
        ratePerSqft: midRate,
        glassCost: glassAmt,
        installationCost: install,
        hardwareCost: hardware,
        gst,
        totalEstimate: total
      }
    };

    // Save estimate to DB
    const newEstimate = new Estimate(estimateData);
    await newEstimate.save();

    res.json({
      success: true,
      data: {
        ...estimateData,
        vendorQuotes,
        suggestedAllied,
        id: newEstimate._id,
        note: 'Indicative estimate. Final price subject to site measurement and vendor confirmation.'
      }
    });
  } catch (err) {
    console.error('Create estimate error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

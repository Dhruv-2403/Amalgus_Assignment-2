const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const Allied = require('../models/Allied');

// GET /api/products — with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, application, search, minRate, maxRate } = req.query;
    let query = {};

    if (type) query.type = { $regex: type, $options: 'i' };
    if (application) query.applications = { $regex: application, $options: 'i' };
    if (search) {
      query.$or = [
        { type: { $regex: search, $options: 'i' } },
        { process: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    if (minRate) query.rateMax = { $gte: Number(minRate) };
    if (maxRate) query.rateMin = { $lte: Number(maxRate) };

    const products = await Product.find(query);
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Attach matching vendors
    const allVendors = await Vendor.find({ specialties: product.type });
    const matchedVendors = allVendors.map(v => ({
      ...v.toObject(),
      quotedRate: Math.round(((product.rateMin + product.rateMax) / 2) * (1 + v.priceModifier))
    }));

    // Attach allied products
    const matchedAllied = await Allied.find({ compatibleWith: product.type });

    res.json({ success: true, data: { product, vendors: matchedVendors, allied: matchedAllied } });
  } catch (err) {
    console.error('Fetch product detail error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please provide a token.' });
  }

  const secret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

// Helper functions for matching
const getIndustryTip = (query) => {
  const q = query.toLowerCase();
  if (q.includes('bathroom') || q.includes('shower')) return 'Always use toughened glass for bathroom applications to prevent injury.';
  if (q.includes('balcony') || q.includes('railing')) return 'For balconies, laminated glass is recommended so it stays in place if broken.';
  if (q.includes('window') || q.includes('sound') || q.includes('noise')) return 'DGU (Double Glazed Units) or Acoustic glass can significantly reduce outside noise.';
  if (q.includes('heat') || q.includes('sun')) return 'Consider Low-E or Reflective glass for south-facing windows to keep interiors cool.';
  return 'Always consult with a professional installer to ensure proper thickness and safety standards are met.';
};

const getEstimatedBudget = (product) => {
  if (!product) return 'Varies based on size';
  return `₹${product.rateMin}–₹${product.rateMax}/sqft`;
};

// POST /api/ai/match
router.post('/match', authenticate, async (req, res) => {
  const { query, role = 'homeowner' } = req.body;
  
  if (!query) {
    return res.status(400).json({ success: false, message: 'query is required' });
  }

  try {
    const q = query.toLowerCase();
    const products = await Product.find({});
    
    // Scoring logic
    const scoredProducts = products.map(product => {
      let score = 0;
      const p = product.toObject();
      
      p.tags.forEach(tag => {
        if (q.includes(tag.toLowerCase())) score += 5;
      });
      
      p.applications.forEach(app => {
        if (q.includes(app.toLowerCase())) score += 3;
      });
      
      if (q.includes(p.type.toLowerCase())) score += 4;
      if (q.includes(p.process.toLowerCase())) score += 2;
      
      return { ...p, score };
    });
    
    // Sort descending
    scoredProducts.sort((a, b) => b.score - a.score);
    
    // Determine top match
    const isMatchFound = scoredProducts.length > 0 && scoredProducts[0].score > 0;
    const topMatch = isMatchFound ? scoredProducts[0] : (await Product.findOne({})) ; // fallback to first product
    
    // Get alternatives
    let alts = [];
    if (isMatchFound) {
      alts = scoredProducts.slice(1, 3);
    } else {
      alts = (await Product.find({}).limit(3)).slice(1);
    }
    
    // Format response matching the previous structure
    const primaryRecommendation = {
      productId: topMatch._id,
      type: topMatch.type,
      thickness: topMatch.thickness,
      process: topMatch.process,
      reason: isMatchFound 
        ? `Based on your request, ${topMatch.type} glass is an excellent choice due to its properties matching your needs.`
        : `This is a versatile standard choice. We couldn't find an exact match for your specific terms.`,
      safetyNote: (topMatch.safetyRating === 'high' || topMatch.safetyRating === 'very_high')
        ? 'This glass meets high safety standards and is generally required for this type of installation.' 
        : '',
      product: topMatch
    };
    
    const alternatives = alts.map(alt => ({
      productId: alt._id || alt.id,
      type: alt.type,
      reason: `You might also consider ${alt.type} as a great alternative.`,
      product: alt
    }));

    res.json({
      success: true,
      data: {
        query,
        role,
        primaryRecommendation,
        alternatives,
        industryTip: getIndustryTip(q),
        estimatedBudget: getEstimatedBudget(topMatch)
      }
    });

  } catch (err) {
    console.error('Custom matching failed:', err.message);
    res.status(500).json({ success: false, message: 'Custom matching failed', error: err.message });
  }
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB Connection
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ Error: MONGODB_URI is not defined in .env file.');
} else {
  mongoose.connect(uri)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
}
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/rates', require('./routes/rates'));
app.use('/api/estimate', require('./routes/estimate'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'AmalGus API running', version: '1.0.0', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 AmalGus API running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Products: http://localhost:${PORT}/api/products`);
  console.log(`   Rates: http://localhost:${PORT}/api/rates\n`);
});

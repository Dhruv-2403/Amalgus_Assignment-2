const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: 'Username, password, and role are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();

    const secret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
    const token = jwt.sign({ id: newUser._id, username: newUser.username, role: newUser.role }, secret, { expiresIn: '1d' });

    res.json({
      success: true,
      message: 'Signup successful',
      token,
      user: { username: newUser.username, role: newUser.role }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, secret, { expiresIn: '1d' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

module.exports = router;

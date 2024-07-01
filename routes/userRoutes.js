const express = require('express');
const bcrypt = require('bcrypt');
const UserDetails = require('../models/user'); // Adjust the path to your user model
const router = express.Router();

// Check if email exists
router.get('/check-email', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await UserDetails.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User registration
router.post('/register', async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserDetails({ email, name, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserDetails.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

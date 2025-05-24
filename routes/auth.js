const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
require('dotenv').config();

// --- Static Admin Credentials ---
const USER = {
  username: 'admin',
  password: 'admin'
};

// --- JWT Secret ---
const JWT_SECRET = process.env.ADMIN_JWT_SECRET;

// --- Middleware to Verify Admin Token ---
function authAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// --- /login Route ---
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      username
    });
  }

  return res.status(401).json({ message: 'Invalid username or password' });
});

// --- /users Route (Protected) ---
router.get('/users', authAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// --- DELETE /users/:id Route (Protected) ---
router.delete('/users/:id', authAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

module.exports = router;

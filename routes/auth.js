const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/User');
const Operator = require('../models/Operator');
const sendOtp = require('../services/sendOtp');

dotenv.config();

// =====================
// Constants & Config
// =====================
const otpStore = new Map();
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;
const OPERATOR_JWT_SECRET = process.env.OPERATOR_JWT_SECRET || 'operator-secret';

const ADMIN = {
  username: 'admin',
  passwordHash: '$2b$10$1NLuPCcWAvouJAULcINhyObh0azGL7GBfNdsZrPIYwMrtfkPS7X42' // password: admin
};

// =====================
// Middleware: Admin Auth
// =====================
function authAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// =====================
// Admin Login (Password)
// =====================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN.username) {
    return res.status(403).json({ message: 'Use the correct operator login route' });
  }

  const isMatch = await bcrypt.compare(password, ADMIN.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const token = jwt.sign({ username, role: 'ADMIN' }, ADMIN_JWT_SECRET, { expiresIn: '2h' });

  return res.status(200).json({
    message: 'Admin login successful',
    token,
    role: 'ADMIN',
    username
  });
});

// ==========================
// Operator Login (Password)
// ==========================
router.post('/operator/login', async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password are required' });
  }

  const operator = await Operator.findOne({ primaryPhoneNumber: phone });
  if (!operator) return res.status(404).json({ message: 'Operator not found' });

  if (!operator.isCredentialSet) {
    return res.status(403).json({ message: 'Password login not allowed for this operator' });
  }

  const isMatch = await bcrypt.compare(password, operator.passwordHash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

  const token = jwt.sign(
    { id: operator._id, primaryPhoneNumber: operator.primaryPhoneNumber, role: 'OPERATOR' },
    OPERATOR_JWT_SECRET,
    { expiresIn: '2h' }
  );

  return res.status(200).json({
    message: 'Operator login successful',
    token,
    role: 'OPERATOR',
    operator: {
      id: operator._id,
      name: operator.name,
      primaryPhoneNumber: operator.primaryPhoneNumber
    }
  });
});

// ==========================
// Operator Send OTP
// ==========================
router.post('/operator/send-otp', async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ message: 'Phone number is required' });

  const operator = await Operator.findOne({ primaryPhoneNumber: phone });
  if (!operator) return res.status(404).json({ message: 'Phone number not registered' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, otp);

  const sent = await sendOtp(phone, otp);
  if (!sent) return res.status(500).json({ message: 'Failed to send OTP' });

  res.status(200).json({ message: 'OTP sent successfully' });
});

// ==========================
// Operator Verify OTP
// ==========================
router.post('/operator/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  const storedOtp = otpStore.get(phone);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(401).json({ message: 'Invalid OTP' });
  }

  otpStore.delete(phone);

  const operator = await Operator.findOne({ primaryPhoneNumber: phone });
  if (!operator) return res.status(404).json({ message: 'Operator not found' });

  const token = jwt.sign(
    { id: operator._id, primaryPhoneNumber: operator.primaryPhoneNumber, role: 'OPERATOR' },
    OPERATOR_JWT_SECRET,
    { expiresIn: '2h' }
  );

  return res.status(200).json({
    message: 'Operator OTP login successful',
    token,
    role: 'OPERATOR',
    operator: {
      id: operator._id,
      name: operator.name,
      primaryPhoneNumber: operator.primaryPhoneNumber
    }
  });
});

// =====================
// Admin Protected Routes
// =====================
router.get('/users', authAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

router.delete('/users/:id', authAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

module.exports = router;

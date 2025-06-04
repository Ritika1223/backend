const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
require('dotenv').config();
const bcrypt = require('bcrypt');
const Operator = require('../models/Operator');  // Adjust path as needed



// --- Static Admin Username (No password here) ---
const USER = {
  username: 'admin',
  // This hash represents the password 'admin'
  passwordHash: '$2b$10$1NLuPCcWAvouJAULcINhyObh0azGL7GBfNdsZrPIYwMrtfkPS7X42'
};

// --- JWT Secret ---
const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
const OPERATOR_JWT_SECRET = process.env.OPERATOR_JWT_SECRET || 'operator-secret';

// --- Admin hashed password from env ---
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;


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
router.post('/login',async (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username) {
    const isMatch = await bcrypt.compare(password, USER.passwordHash);

    if (isMatch) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });

      return res.status(200).json({
        message: 'Login successful',
        token,
        username,
          role: 'ADMIN'  // ✅ Add this line

        
      });
    }
  }
   // --- If Not Admin, Check Operator ---
  const operator = await Operator.findOne({ primaryPhoneNumber: username }); // ✅ replaced `username` lookup
    if (operator && operator.isCredentialSet) {
      const isMatch = await bcrypt.compare(password, operator.passwordHash);
      if (isMatch) {
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
      }
    }

    // --- If Nothing Matches ---
    return res.status(401).json({ message: 'Invalid username or password' });


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

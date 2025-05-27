const express = require('express');
const router = express.Router();
const Operator = require('../models/Operator'); // MongoDB model
const bcrypt = require("bcryptjs");



// GET only approved operators from MongoDB
router.get('/',  async (req, res) => {
  try {
    const operators = await Operator.find({ approved: true });
    res.json(operators);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching operators' });
  }
});
// GET only approved operators from MongoDB
router.get('/requests', async (req, res) => {
  try {
    const operators = await Operator.find({ approved: false });
    res.json(operators);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching operators' });
  }
});

// GET single operator by ID from MongoDB
router.get('/:id',  async (req, res) => {
  const operatorId = req.params.id;

  try {
    const operator = await Operator.findById(operatorId);
    if (!operator) {
      return res.status(404).json({ message: 'Operator not found' });
    }   
    res.json(operator);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching operator' });
  }
});
router.post('/', async (req, res) => {
  try {
    const newOperator = new Operator(req.body);
    const savedOperator = await newOperator.save();
    res.status(201).json({ message: 'operator saved' });
  } catch (err) {
    console.error('Error creating operator:', err);
    res.status(400).json({ message: 'Failed to create operator', error: err.message });
  }
});


// Accept operator request (approve operator)
router.post('/accept/:id', async (req, res) => {
  const operatorId = req.params.id;

  try {
    const updatedOperator = await Operator.findByIdAndUpdate(
      operatorId,
      { approved: true },
      { new: true }
    );

    if (!updatedOperator) {
      return res.status(404).json({ message: 'Operator not found' });
    }

    res.json({ message: 'Operator approved', operator: updatedOperator });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error approving operator' });
  }
});

// Reject operator request (delete operator)
router.delete('/reject/:id', async (req, res) => {
  const operatorId = req.params.id;

  try {
    const deletedOperator = await Operator.findByIdAndDelete(operatorId);

    if (!deletedOperator) {
      return res.status(404).json({ message: 'Operator not found' });
    }

    res.json({ message: 'Operator rejected and deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error rejecting operator' });
  }
});

// ✅ Set operator credentials (username/password)
router.post('/set-credentials/:id', async (req, res) => {
  const { username, password } = req.body;
  const operatorId = req.params.id;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const operator = await Operator.findById(operatorId);

    // Check if operator exists and is approved
    if (!operator) {
      return res.status(404).json({ message: 'Operator not found' });
    }

    if (!operator.approved) {
      return res.status(403).json({ message: 'Operator is not approved. Cannot set credentials.' });
    }

    // Hash the password and update
    const hashedPassword = await bcrypt.hash(password, 10);
    operator.username = username;
    operator.passwordHash = hashedPassword;
    operator.isCredentialSet = true;

    const savedOperator = await operator.save();

    res.status(200).json({ message: 'Credentials set successfully', operator: savedOperator });
  } catch (err) {
    console.error('❌ Error setting credentials:', err);
    res.status(500).json({ message: 'Error setting credentials', error: err.message });
  }
});
module.exports = router;

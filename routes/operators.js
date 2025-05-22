const express = require('express');
const router = express.Router();
const Operator = require('../models/Operator'); // MongoDB model

const MOCK_TOKEN = 'mocked-jwt-token-123456';

// Middleware for mock auth
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === `Bearer ${MOCK_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}; 

// GET only approved operators from MongoDB
router.get('/', authMiddleware, async (req, res) => {
  try {
    const operators = await Operator.find({ approved: true });
    res.json(operators);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching operators' });
  }
});
// GET only approved operators from MongoDB
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const operators = await Operator.find({ approved: false });
    res.json(operators);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching operators' });
  }
});

// GET single operator by ID from MongoDB
router.get('/:id', authMiddleware, async (req, res) => {
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
router.post('/accept/:id', authMiddleware, async (req, res) => {
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
router.delete('/reject/:id', authMiddleware, async (req, res) => {
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


module.exports = router;

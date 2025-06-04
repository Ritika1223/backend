const express = require('express');
const router = express.Router();
const Credit = require('../models/Credit');

// Get all credits
router.get('/', async (req, res) => {
  try {
     const { operatorId } = req.query;

    const filter = {};
    if (operatorId) {
      filter.operatorId = operatorId;
    }

    const credits = await Credit.find(filter).sort({ createdAt: -1 });
    res.json(credits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a credit by id
router.get('/:id', async (req, res) => {
  try {
    const credit = await Credit.findOne({ id: req.params.id });
    if (!credit) return res.status(404).json({ message: 'Credit entry not found' });
    res.json(credit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new credit
router.post('/', async (req, res) => {
  try {
    // Generate new ID based on last record
    const lastCredit = await Credit.findOne().sort({ createdAt: -1 });
    let newIdNumber = 1;
    if (lastCredit) {
      const lastIdNumber = parseInt(lastCredit.id.replace('CR', ''), 10);
      newIdNumber = lastIdNumber + 1;
    }
    const newCredit = new Credit({
      id: `CR${newIdNumber.toString().padStart(3, '0')}`,
      ...req.body
    });
    const savedCredit = await newCredit.save();
    res.status(201).json(savedCredit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update credit by id
router.put('/:id', async (req, res) => {
  try {
    const updatedCredit = await Credit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true}
    );
    if (!updatedCredit) {
      return res.status(404).json({ message: 'Credit not found' });
    }
    res.json(updatedCredit);
  } catch (error) {
    console.error('Error updating credit:', error);
    res.status(500).json({ message: error.message });
  }
});



// Delete credit by id
router.delete('/:id', async (req, res) => {
  try {
    const credit = await Credit.findOneAndDelete({ id: req.params.id });
    if (!credit) return res.status(404).json({ message: 'Credit entry not found' });
    res.json({ message: 'Credit entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

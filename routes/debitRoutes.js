const express = require('express');
const router = express.Router();
const Debit = require('../models/Debit');

// Get all debits
router.get('/', async (req, res) => {
  try {
     const { operatorId } = req.query;

    const filter = {};
    if (operatorId) {
      filter.operatorId = operatorId;
    }

    const debits = await Debit.find(filter).sort({ createdAt: -1 });
    res.json(debits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a debit by ID
router.get('/:id', async (req, res) => {
  try {
    
    const debit = await Debit.findOneAndDelete({ id: req.params.id });
    if (!debit) return res.status(404).json({ message: 'Debit entry not found' });
    res.json(debit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new debit
router.post('/', async (req, res) => {
  try {
    // Generate new ID based on last record
    const lastDebit = await Debit.findOne().sort({ createdAt: -1 });
    let newIdNumber = 1;
    if (lastDebit) {
      const lastIdNumber = parseInt(lastDebit.id.replace('DR', ''), 10);
      newIdNumber = lastIdNumber + 1;
    }

    const newDebit = new Debit({
      id: `DR${newIdNumber.toString().padStart(3, '0')}`,
      ...req.body
    });

    const savedDebit = await newDebit.save();
    res.status(201).json(savedDebit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update debit by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedDebit = await Debit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true}
    );
    if (!updatedDebit) {
      return res.status(404).json({ message: 'Debit not found' });
    }
    res.json(updatedDebit);
  } catch (error) {
    console.error('Error updating debit:', error);
    res.status(500).json({ message: error.message });
  }
});


// Delete debit by ID
router.delete('/:id', async (req, res) => {
      console.log('Deleting debit with ID:', req.params.id); // log this

  try {
    const debit = await Debit.findOneAndDelete({ id: req.params.id });
    if (!debit) return res.status(404).json({ message: 'Debit entry not found' });
    res.json({ message: 'Debit entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

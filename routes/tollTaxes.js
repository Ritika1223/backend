const express = require('express');
const router = express.Router();
const TollTaxes = require('../models/TollTaxes');

// POST /api/tollTaxes - Create new toll tax entry
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/tollTaxes body:', req.body);
    const newTollTax = new TollTaxes(req.body);
    await newTollTax.save();
    console.log('TollTax saved:', newTollTax);
    res.status(201).json(newTollTax);
  } catch (error) {
    console.error('Error saving TollTax:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/tollTaxes - Get all toll tax entries
router.get('/', async (req, res) => {
  try {
     const { operatorId } = req.query;

    const filter = {};
    if (operatorId) {
      filter.operatorId = operatorId;
    }

    const tollTaxes = await TollTaxes.find(filter);
    res.json(tollTaxes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/tollTaxes/:id - Delete toll tax by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedTollTax = await TollTaxes.findByIdAndDelete(req.params.id);
    if (!deletedTollTax) {
      return res.status(404).json({ message: 'TollTax not found' });
    }
    res.json({ message: 'TollTax deleted successfully' });
  } catch (error) {
    console.error('Error deleting TollTax:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/tollTaxes/:id - Update toll tax by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedTollTax = await TollTaxes.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTollTax) {
      return res.status(404).json({ message: 'TollTax not found' });
    }
    res.json(updatedTollTax);
  } catch (error) {
    console.error('Error updating TollTax:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

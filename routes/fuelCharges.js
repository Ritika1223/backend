const express = require('express');
const router = express.Router();
const FuelCharge = require('../models/FuelCharge');

// POST /api/fuelCharges - Create new fuel charge entry
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/fuelCharges body:', req.body);
    const newFuelCharge = new FuelCharge(req.body);
    await newFuelCharge.save();
    console.log('FuelCharge saved:', newFuelCharge);
    res.status(201).json(newFuelCharge);
  } catch (error) {
    console.error('Error saving FuelCharge:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/fuelCharges - Get all fuel charge entries
router.get('/', async (req, res) => {
  try {
     const { operatorId } = req.query;

    const filter = {};
    if (operatorId) {
      filter.operatorId = operatorId;
    }

    const fuelCharges = await FuelCharge.find(filter);
    res.json(fuelCharges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/fuelCharges/:id - Delete fuel charge by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedFuelCharge = await FuelCharge.findByIdAndDelete(req.params.id);
    if (!deletedFuelCharge) {
      return res.status(404).json({ message: 'FuelCharge not found' });
    }
    res.json({ message: 'FuelCharge deleted successfully' });
  } catch (error) {
    console.error('Error deleting FuelCharge:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/fuelCharges/:id - Update fuel charge by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedFuelCharge = await FuelCharge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFuelCharge) {
      return res.status(404).json({ message: 'FuelCharge not found' });
    }
    res.json(updatedFuelCharge);
  } catch (error) {
    console.error('Error updating FuelCharge:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

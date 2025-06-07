const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// POST /api/vehicles - Add a new vehicle
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/vehicles body:', req.body);
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    console.log('Vehicle saved:', newVehicle);
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error('Error saving vehicle:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/vehicles - Get all vehicles
router.get('/', async (req, res) => {
   try {
    const { operatorId } = req.query;

    const filter = {};
    if (operatorId) {
      filter.operatorId = operatorId;
    }
    const vehicles = await Vehicle.find(filter);
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/vehicles/:id - Delete a vehicle by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/vehicles/:id - Update a vehicle by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ message: error.message });
  }
});


module.exports = router; 

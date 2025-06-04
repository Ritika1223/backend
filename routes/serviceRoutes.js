const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// POST /api/services - Create new service entry
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/services body:', req.body);
    const newService = new Service(req.body);
    await newService.save();
    console.log('Service saved:', newService);
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error saving Service:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/services - Get all service entries
router.get('/', async (req, res) => {
  try {
     const { operatorId } = req.query;

    const filter = {};
    if (operatorId) {
      filter.operatorId = operatorId;
    }

    const services = await Service.find(filter);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/services/:id - Delete service entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Service entry not found' });
    }
    res.json({ message: 'Service entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting Service:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/services/:id - Update service entry by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: 'Service entry not found' });
    }
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating Service:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

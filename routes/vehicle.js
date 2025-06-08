const express = require('express');
const router = express.Router();
const Operator = require('../models/Operator');

// GET /api/vehicles?operatorId=xxxxx
router.get('/', async (req, res) => {
  try {
    const { operatorId } = req.query;

    if (!operatorId) {
      return res.status(400).json({ message: 'Operator ID is required' });
    }

    const operator = await Operator.findById(operatorId);

    if (!operator) {
      return res.status(404).json({ message: 'Operator not found' });
    }

    res.status(200).json(operator.buses); // return only bus list
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add-bus-number', async (req, res) => {
  const { operatorId, busId, busNumber } = req.body;

  try {
    const operator = await Operator.findById(operatorId);
    if (!operator) return res.status(404).json({ message: 'Operator not found' });

    const bus = operator.buses.id(busId);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    if (!bus.busNumbers) bus.busNumbers = [];
    bus.busNumbers.push(busNumber);

    await operator.save();
    res.status(200).json({ message: 'Bus number added', buses: operator.buses });
  } catch (err) {
    console.error('Error adding bus number:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;

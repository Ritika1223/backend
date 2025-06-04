const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); // ✅ This must match the file name exactly

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const { operatorId } = req.query;

    const filter = {};
    if (operatorId) {
      filter.operatorId = operatorId;
    }
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a booking by id
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({ id: req.params.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    // Generate new ID based on last record
    const lastBooking = await Booking.findOne().sort({ createdAt: -1 });
    let newIdNumber = 1;
    if (lastBooking) {
      const lastIdNumber = parseInt(lastBooking.id.replace('BK', ''), 10);
      newIdNumber = lastIdNumber + 1;
    }
    const newBooking = new Booking({
      id: `BK${newIdNumber.toString().padStart(3, '0')}`,
      ...req.body,
      status: 'Pending'
    });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update booking by id
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete booking by id
router.delete('/:id', async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (error) {
        console.error('Error deleting employee:', error);

    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

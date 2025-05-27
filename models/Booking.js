const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  route: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Or Date if you want ISO format
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  busNumber: {
    type: String,
    required: true,
  },
  seat: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed'],
    default: 'pending',
  },
  price: {
    type: String,
    required: true,
  },
  passengers: {
    type: Number,
    default: 1,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);

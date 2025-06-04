const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String },
  passengers: { type: Number, default: 1 },
  vehicleNumber: { type: String },
  specialRequests: { type: String },
  amount: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);

const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  model: String,
  capacity: Number,
  driver: String,
  route: String,
  registrationDate: Date,
  insuranceExpiry: Date,
  fuelType: String,
  engineNumber: String,
  chassisNumber: String,
  status: { type: String, default: 'Active' },
  lastMaintenance: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);

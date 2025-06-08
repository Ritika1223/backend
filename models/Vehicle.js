// models/Vehicle.js
const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Operator',
    required: true
  },
  busTypeModelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusTypeModel', // ✅ Reference to master list
    required: true
  },
  busNumber: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);

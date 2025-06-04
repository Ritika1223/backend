const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  maintenance: String,
  vehicleNo: { type: String, required: true },
  from: String,
  to: String,
  date: Date,
  maintenanceName: String,
  amount: Number,
  remark: String
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);

const mongoose = require('mongoose');

const FuelChargeSchema = new mongoose.Schema({
  maintenance: { type: String },
  vehicleNo: { type: String, required: true },
  from: { type: String },
  to: { type: String },
  orderNo: { type: String },
  date: { type: Date },
  litresMeter: { type: String },
  amount: { type: Number },
  remark: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('FuelCharge', FuelChargeSchema);

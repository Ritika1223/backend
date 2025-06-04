const mongoose = require('mongoose');

const TollTaxesSchema = new mongoose.Schema({
  maintenance: { type: String },
  vehicleNo: { type: String, required: true },
  from: { type: String },
  to: { type: String },
  orderNo: { type: String },
  date: { type: Date },
  taxType: { type: String },
  amount: { type: Number },
  remark: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('TollTaxes', TollTaxesSchema);

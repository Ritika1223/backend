const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., INV001
  invoiceNumber: { type: String, required: true },
  clientName: { type: String, required: true },
  date: { type: String, required: true }, // ISO string or date format
  amount: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ['Paid', 'Unpaid', 'Pending'], default: 'Unpaid' }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);

const mongoose = require('mongoose');

const debitSchema = new mongoose.Schema({
      id: { type: String, unique: true }, // Custom ID like CR001

  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true }, // Use Date if storing date objects
  category: { type: String },
  reference: { type: String },
  notes: { type: String },
  addedBy: { type: String, default: 'Unknown' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Debit', debitSchema);

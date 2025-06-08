// models/BusTypeModel.js
const mongoose = require('mongoose');

const BusTypeModelSchema = new mongoose.Schema({
  busType: { type: String, required: true },
  busModel: { type: String, required: true }
});

module.exports = mongoose.model('BusTypeModel', BusTypeModelSchema);

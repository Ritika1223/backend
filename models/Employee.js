const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  email: String,
  phone: String,
  joinDate: String,
  address: String,
  salary: String,
  emergencyContact: String
});

module.exports = mongoose.model('Employee', employeeSchema);

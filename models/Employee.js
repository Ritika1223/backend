const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
 empId: {
    type: String,
    required: true,
    unique: true, // Make sure this is unique if you want each ID to be distinct
  },
  name: String,
  employeeFatherName: String,
  gender: String,
  position: String,
  email: String,
  phone: String,
  joinDate: String,
  salary: String,
  temporaryAddress: String,
  permanentAddress: String
});




module.exports = mongoose.model('Employee', employeeSchema);

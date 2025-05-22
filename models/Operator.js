const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  email: String,
  alternate: String
}, { _id: true });

const PhoneNumberSchema = new mongoose.Schema({
  primary: String,
  alternate: String
}, { _id: true });

const BusSchema = new mongoose.Schema({
  busType: String,
  busModel: [String]
}, { _id: true });

const OperatorSchema = new mongoose.Schema({
  approved: { type: Boolean, default: false },
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  emails: [EmailSchema],
  phoneNumbers: [PhoneNumberSchema],
  state: String,
  city: String,
  address: String,
  officeLocation: String,
  buses: [BusSchema],
  hasGSTIN: String,
  gstinNumber: String,
  gstinFile: { type: String, default: null },
  // gstCertificates: [{ type: String, default: null }],
  // bankDetails: [{ type: String, default: null }],
  accountNumber: { type: String, default: null },
  ifscCode: { type: String, default: null },
  cancelCheque: { type: String, default: null },
  addressProof: { type: String, default: null },
  digitalSignature: { type: String, default: null },
  aadharCards: [{ type: String, default: null }],
  panCards: [{ type: String, default: null }],
  photo1: { type: String, default: null },
  photo2: { type: String, default: null },
  officePhotos: [{ type: String, default: null }]
}, { timestamps: true });

module.exports = mongoose.model('Operator', OperatorSchema);


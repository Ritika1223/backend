const express = require('express');
const router = express.Router();
const Operator = require('../models/Operator');

// Replace existing operators with this one demo operator
const demoOperators = [
  {
    name: "Demo Operator",
    companyName: "Demo Travels",
    emails: [
      { email: "demo@example.com", alternate: "alt@example.com" }
    ],
    phoneNumbers: [
      { primary: "9999999999", alternate: "8888888888" }
    ],
    state: "Haryana",
    city: "Gurugram",
    address: "House No-105, Ward-5, Ashok Vihar",
    buses: [
      { busType: "AC Deluxe", busModel: "AC Deluxe Bus 35 Seater (2+2)" }
    ],
    hasGSTIN: "yes",
    gstinNumber: "29ABCDE1234F2Z5",
    gstinFile: "https://firebasestorage.googleapis.com/v0/b/fir-44d31.appspot.com/o/images%2FBarc%CC%A7aHome.png986d908e-41cb-4fec-8c82-274c7e4c3841?alt=media&token=224af2e2-4afd-492e-8b5c-23bbf477b5d0",
    gstCertificates: [],
    bankDetails: [],
    panCards: [
      "https://firebasestorage.googleapis.com/v0/b/fir-44d31.appspot.com/o/images%2FBarc%CC%A7aHome.pnga71518d3-fd9f-4ab4-9c58-d6c274ef01ed?alt=media&token=c569a4ef-b747-4951-8c8a-ca99f64e80bb"
    ],
    aadharCards: [
      "https://firebasestorage.googleapis.com/v0/b/fir-44d31.appspot.com/o/images%2FBarc%CC%A7aHome.pnge3569a9f-b972-4c6b-88ec-fe8460c4e2c0?alt=media&token=7ef329e3-ef58-4477-bfbb-b6fa2b6604c5"
    ],
    photo1: "https://firebasestorage.googleapis.com/v0/b/fir-44d31.appspot.com/o/images%2FBarc%CC%A7aHome.png788b8662-07b5-4754-ae9a-0925bf109960?alt=media&token=b923fbe7-fa86-4cd6-ab22-59ad199067b0",
    photo2: "https://firebasestorage.googleapis.com/v0/b/fir-44d31.appspot.com/o/images%2FBarc%CC%A7aHome.pnga775902a-7c0c-4916-b4ab-ee1070c55abb?alt=media&token=c70afad0-a29e-44bf-8263-1d3491440ed0",
    officeLocation: "sadfafc",
    officePhotos: [
      "https://firebasestorage.googleapis.com/v0/b/fir-44d31.appspot.com/o/images%2FBarc%CC%A7aHome.png4f5e7f67-bc77-4009-ac7b-5baec33075c4?alt=media&token=cf6c06dd-1659-40d9-b79e-da27c2a0e55d"
    ],
    addressProof: "https://firebasestorage.googleapis.com/v0/b/fir-44d31.appspot.com/o/images%2FBarc%CC%A7aHome.png7e6aa4e6-f2b6-4a4e-a026-51f186d0e944?alt=media&token=8edab4a8-987e-410a-a3fc-efe723b56ac3",
    accountNumber: "1234567890",
    ifscCode: "SBIN0001234",
    cancelCheque: "https://firebasestorage.googleapis.com/v0/b/fir-44d31.appspot.com/o/images%2FBarc%CC%A7aHome.png1a5bf949-c64d-488f-80ce-c3d2ce31c0e4?alt=media&token=3970f049-6c16-423f-817e-292e23017b5a",
    digitalSignature: "https://firebasestorage.googleapis.com/v0/b/fir-44d31.appspot.com/o/images%2FBarc%CC%A7aHome.png6eb76a9e-d9df-4aee-8da4-a2b3116e4eaa?alt=media&token=aec8b7ce-7f1e-4f04-9460-db9ad1070568"
  }
];

router.post('/seed-operators', async (req, res) => {
  try {
    await Operator.deleteMany(); // Optional: clears existing data
    const created = await Operator.insertMany(demoOperators);
    res.status(201).json({ message: 'Demo operators seeded!', count: created.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to seed data', error: err.message });
  }
});

module.exports = router;

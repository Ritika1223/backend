const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 8080;
const db = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth');
const operatorRoutes = require('./routes/operators');
const authUser = require('./routes/userAuth')
const employeeRoutes = require('./routes/employee');
const vehicleRoutes = require('./routes/vehicle');
const bookingPageRoutes = require('./routes/bookingPageRoutes');
const creditRoutes = require('./routes/creditRoutes');
const debitRoutes = require('./routes/debitRoutes');
const invoiceRoutes = require('./routes/invoices');
const fuelCharges = require('./routes/fuelCharges');

const tollTaxes = require('./routes/tollTaxes');
const serviceRoutes = require('./routes/serviceRoutes');







app.use(cookieParser()) 
app.use(cors({
  credentials:true,
  origin: 'http://localhost:5173' 
}));
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/operators', operatorRoutes);
app.use('/auth', authUser)
app.use('/api/employees', employeeRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/booking', bookingPageRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/debits', debitRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/tollTaxes', require('./routes/tollTaxes'));
app.use('/api/fuelCharges', fuelCharges);
app.use('/api/services', serviceRoutes);









app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})


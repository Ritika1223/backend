const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 8080;
const db = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth');
const operatorRoutes = require('./routes/operators');
const seedRoutes = require('./routes/seed');

app.use(cookieParser()) 
app.use(cors({
  credentials:true,
  origin: 'https://frontend-46ab.vercel.app/'
}));
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/operators', operatorRoutes);
app.use('/api', seedRoutes);

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})


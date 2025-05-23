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

app.use(cookieParser()) 
app.use(cors({
  credentials:true,
  origin: 'http://localhost:5173' 
}));
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/operators', operatorRoutes);
app.use('/auth', authUser)

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})


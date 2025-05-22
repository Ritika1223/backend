const mongoose = require('mongoose');
const mongoURL = 'mongodb+srv://admin:admin@cluster0.xryitjr.mongodb.net/ant?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURL)
    .then(() => console.log("Connected to MongoDB Atlas (ant DB)"))
    .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

db.on('disconnected', () => {
    console.log("MongoDB server disconnected");
});
  
module.exports = db;     
const mongoose = require('mongoose');

// Initialize MongoDB
mongoose.connect('mongodb://localhost:27017/backpackers-united', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB', err);
  });

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,  // Remember to hash this before storing
  email: String,
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date: Date,
  timeSlot: String,
});

// Create models based on the schemas
const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// Export the models
module.exports = { User, Booking };

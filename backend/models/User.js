const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // We will hash this later
  role: { 
    type: String, 
    enum: ['senior', 'caretaker', 'doctor'], 
    default: 'senior' 
  },
  // Profile Fields
  dob: String,
  bloodGroup: String,
  address: String,
  emergencyPrimary: {
    name: String,
    contact: String,
    relation: String
  },
  // Simple Vitals Storage (Embedded for simplicity)
  vitals: {
    steps: { type: Number, default: 0 },
    heartRate: { type: Number, default: 72 },
    bp: { type: String, default: "120/80" },
    sleep: { type: String, default: "7.0" }
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('User', userSchema);
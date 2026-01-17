const mongoose = require('mongoose');

const medicineSchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' // Links this medicine to a specific user
  },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Tablet', 'Syrup', 'Injection', 'Other'],
    default: 'Tablet'
  },
  dose: String,        // e.g., "500mg"
  schedule: String,    // e.g., "Morning, Night"
  instructions: String,// e.g., "After Food"
  category: { 
    type: String, 
    enum: ['Daily Routine', 'As Needed'],
    default: 'Daily Routine'
  },
  stock: { type: Number, default: 10 },
  expiry: String,
  taken: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Medicine', medicineSchema);
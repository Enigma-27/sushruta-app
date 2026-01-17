const mongoose = require('mongoose');

const reminderSchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  text: { type: String, required: true }, // e.g., "Physiotherapy Session"
  time: { type: String, required: true }, // e.g., "09:00 AM"
  day: { type: Number, required: true },  // e.g., 15 (Day of the month)
  completed: { type: Boolean, default: false },
  notified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
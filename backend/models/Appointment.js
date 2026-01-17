const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  doctorName: { type: String, required: true },
  specialization: { type: String, default: 'General Physician' },
  date: { type: String, required: true }, // Format: "YYYY-MM-DD"
  time: { type: String, required: true }, // Format: "HH:MM"
  reason: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Rejected', 'Completed'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
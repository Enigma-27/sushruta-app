const mongoose = require('mongoose');

const wellnessLogSchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['mood', 'gratitude', 'diet', 'water'], 
    required: true 
  },
  value: { type: String }, // e.g., "Happy", "Sad", "2 glasses"
  text: { type: String },  // For Gratitude notes or detailed diet info
  date: { type: String, required: true }, // "YYYY-MM-DD" for filtering by day
  meta: { type: Object }   // Flexible field (e.g., calories, protein count)
}, { timestamps: true });

module.exports = mongoose.model('WellnessLog', wellnessLogSchema);
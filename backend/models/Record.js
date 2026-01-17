const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['report', 'insurance'], 
    required: true 
  },
  name: { type: String, required: true },     // e.g., "Blood Test.pdf"
  doctor: { type: String },                   // e.g., "Dr. Sharma"
  date: { type: String },                     // Date of report
  type: { type: String },                     // MIME type: "application/pdf"
  content: { type: String, required: true }   // Base64 Encoded File
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
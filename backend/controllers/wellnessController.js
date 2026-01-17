const asyncHandler = require('express-async-handler');
const WellnessLog = require('../models/WellnessLog');

// @desc    Get wellness logs (mood, diet, etc.)
// @route   GET /api/wellness
// @access  Private
const getLogs = asyncHandler(async (req, res) => {
  // Sort by newest first
  const logs = await WellnessLog.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(logs);
});

// @desc    Add a wellness log
// @route   POST /api/wellness
// @access  Private
const addLog = asyncHandler(async (req, res) => {
  const { type, value, text, date, meta } = req.body;

  if (!type || !date) {
    res.status(400);
    throw new Error('Type and Date are required');
  }

  const log = await WellnessLog.create({
    user: req.user._id,
    type,
    value,
    text,
    date,
    meta
  });

  res.status(201).json(log);
});

module.exports = { getLogs, addLog };
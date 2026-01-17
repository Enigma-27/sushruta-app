const asyncHandler = require('express-async-handler');
const Record = require('../models/Record');

// @desc    Get all records (Reports/Insurance)
// @route   GET /api/records
// @access  Private
const getRecords = asyncHandler(async (req, res) => {
  const records = await Record.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(records);
});

// @desc    Upload a new record
// @route   POST /api/records
// @access  Private
const addRecord = asyncHandler(async (req, res) => {
  const { category, name, doctor, date, type, content } = req.body;
  
  // Basic validation
  if (!content || !name || !category) {
    res.status(400);
    throw new Error('Please provide file content, name, and category');
  }

  const record = await Record.create({
    user: req.user._id,
    category,
    name,
    doctor,
    date,
    type,
    content // This is the Base64 string
  });

  res.status(201).json(record);
});

// @desc    Delete a record
// @route   DELETE /api/records/:id
// @access  Private
const deleteRecord = asyncHandler(async (req, res) => {
  const record = await Record.findById(req.params.id);

  if (!record) {
    res.status(404);
    throw new Error('Record not found');
  }

  if (record.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await record.deleteOne();
  res.json({ message: 'Record removed', id: req.params.id });
});

module.exports = { getRecords, addRecord, deleteRecord };
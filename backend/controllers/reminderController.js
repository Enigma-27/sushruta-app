const asyncHandler = require('express-async-handler');
const Reminder = require('../models/Reminder');

// @desc    Get all reminders
// @route   GET /api/reminders
// @access  Private
const getReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ user: req.user._id });
  res.json(reminders);
});

// @desc    Add a new reminder
// @route   POST /api/reminders
// @access  Private
const addReminder = asyncHandler(async (req, res) => {
  const { text, time, day } = req.body;

  if (!text || !time || !day) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const reminder = await Reminder.create({
    user: req.user._id,
    text,
    time,
    day
  });

  res.status(201).json(reminder);
});

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    res.status(404);
    throw new Error('Reminder not found');
  }

  // Ensure user owns the reminder
  if (reminder.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await reminder.deleteOne();
  res.json({ id: req.params.id });
});

module.exports = { getReminders, addReminder, deleteReminder };
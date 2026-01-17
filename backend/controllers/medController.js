const asyncHandler = require('express-async-handler');
const Medicine = require('../models/Medicine');

// @desc    Get all medicines for logged-in user
// @route   GET /api/meds
// @access  Private
const getMeds = asyncHandler(async (req, res) => {
  const meds = await Medicine.find({ user: req.user._id });
  res.json(meds);
});

// @desc    Add a new medicine
// @route   POST /api/meds
// @access  Private
const addMed = asyncHandler(async (req, res) => {
  const { name, type, dose, schedule, instructions, category, stock, expiry } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please add a medicine name');
  }

  const med = await Medicine.create({
    user: req.user._id,
    name,
    type,
    dose,
    schedule,
    instructions,
    category,
    stock,
    expiry
  });

  res.status(201).json(med);
});

// @desc    Update medicine stock or details
// @route   PUT /api/meds/:id
// @access  Private
const updateMed = asyncHandler(async (req, res) => {
  const med = await Medicine.findById(req.params.id);

  if (!med) {
    res.status(404);
    throw new Error('Medicine not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the medicine goal user
  if (med.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedMed = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedMed);
});

// @desc    Delete medicine
// @route   DELETE /api/meds/:id
// @access  Private
const deleteMed = asyncHandler(async (req, res) => {
  const med = await Medicine.findById(req.params.id);

  if (!med) {
    res.status(404);
    throw new Error('Medicine not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the medicine owner
  if (med.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await med.deleteOne(); // Use deleteOne() for Mongoose v6+

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getMeds,
  addMed,
  updateMed,
  deleteMed,
};
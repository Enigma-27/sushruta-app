const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Update User Profile (Address, Emergency Contact)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.dob = req.body.dob || user.dob;
    user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
    user.address = req.body.address || user.address;
    
    // Update Emergency Contact if provided
    if (req.body.emergencyPrimary) {
      user.emergencyPrimary = req.body.emergencyPrimary;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      role: updatedUser.role,
      address: updatedUser.address,
      emergencyPrimary: updatedUser.emergencyPrimary
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update Vitals (Steps, Heart Rate, BP)
// @route   PUT /api/users/vitals
// @access  Private
const updateVitals = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Initialize vitals if they don't exist
    if (!user.vitals) {
        user.vitals = {};
    }

    // Explicitly update fields
    if (req.body.steps) user.vitals.steps = req.body.steps;
    if (req.body.heartRate) user.vitals.heartRate = req.body.heartRate;
    if (req.body.bp) user.vitals.bp = req.body.bp;
    if (req.body.sleep) user.vitals.sleep = req.body.sleep;
    
    await user.save();
    
    res.json(user.vitals);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { updateUserProfile, updateVitals };
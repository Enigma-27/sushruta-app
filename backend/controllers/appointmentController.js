const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
  // Finds appointments where the logged-in user is the patient
  const appointments = await Appointment.find({ patient: req.user._id });
  res.json(appointments);
});

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private
const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorName, specialization, date, time, reason } = req.body;

  if (!doctorName || !date || !time) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctorName,
    specialization,
    date,
    time,
    reason,
    status: 'Pending'
  });

  res.status(201).json(appointment);
});

// @desc    Update appointment status (Example: Cancel/Reschedule)
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  if (appointment.patient.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedAppointment);
});

module.exports = {
  getAppointments,
  bookAppointment,
  updateAppointment,
};
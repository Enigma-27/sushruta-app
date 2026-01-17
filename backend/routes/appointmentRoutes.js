const express = require('express');
const router = express.Router();
const {
  getAppointments,
  bookAppointment,
  updateAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAppointments).post(protect, bookAppointment);
router.route('/:id').put(protect, updateAppointment);

module.exports = router;
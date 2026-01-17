const express = require('express');
const router = express.Router();
const { getReminders, addReminder, deleteReminder } = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getReminders).post(protect, addReminder);
router.route('/:id').delete(protect, deleteReminder);

module.exports = router;
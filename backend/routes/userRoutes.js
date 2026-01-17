const express = require('express');
const router = express.Router();
const { updateUserProfile, updateVitals } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateUserProfile);
router.put('/vitals', protect, updateVitals);

module.exports = router;
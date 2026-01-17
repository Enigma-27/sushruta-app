const express = require('express');
const router = express.Router();
const { getLogs, addLog } = require('../controllers/wellnessController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getLogs).post(protect, addLog);

module.exports = router;
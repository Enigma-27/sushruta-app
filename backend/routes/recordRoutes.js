const express = require('express');
const router = express.Router();
const { getRecords, addRecord, deleteRecord } = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getRecords).post(protect, addRecord);
router.route('/:id').delete(protect, deleteRecord);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  getMeds,
  addMed,
  updateMed,
  deleteMed,
} = require('../controllers/medController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMeds).post(protect, addMed);
router.route('/:id').put(protect, updateMed).delete(protect, deleteMed);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  createExam,
  getAllExams,
  getStudentExams,
  deleteExam,
  getExamStats
} = require('../controllers/examController');
const { protect, adminOnly, studentOnly } = require('../middleware/authMiddleware');

// Student exam schedule endpoint (Strict filtering by user's branch & academic year)
router.get('/student', protect, studentOnly, getStudentExams);

// Admin dashboard endpoints
router.get('/stats', protect, adminOnly, getExamStats);
router.route('/')
  .get(protect, adminOnly, getAllExams)
  .post(protect, adminOnly, createExam);

router.delete('/:id', protect, adminOnly, deleteExam);

module.exports = router;

const Exam = require('../models/Exam');
const User = require('../models/User');

// Helper function to convert time string (e.g., "09:30 AM", "14:00") into minutes from midnight for strict comparison
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return NaN;
  const cleaned = timeStr.trim().toUpperCase();
  const isPM = cleaned.includes('PM');
  const isAM = cleaned.includes('AM');
  
  const rawTime = cleaned.replace(/AM|PM/g, '').trim();
  const parts = rawTime.split(':');
  if (parts.length < 2) return NaN;
  
  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  
  if (isNaN(hours) || isNaN(minutes)) return NaN;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
};

// @desc    Create a new scheduled exam
// @route   POST /api/exams
// @access  Private (Admin Only)
const createExam = async (req, res) => {
  try {
    const {
      subjectName,
      subjectCode,
      academicYear,
      branch,
      examDate,
      startTime,
      endTime,
      roomNumber
    } = req.body;

    // 1. Mandatory Field Validation
    if (!subjectName || !subjectName.trim()) {
      return res.status(400).json({ message: 'Subject name cannot be empty' });
    }
    if (!subjectCode || !subjectCode.trim()) {
      return res.status(400).json({ message: 'Subject code cannot be empty' });
    }
    if (!academicYear || !academicYear.trim()) {
      return res.status(400).json({ message: 'Academic year is required' });
    }
    if (!branch || !branch.trim()) {
      return res.status(400).json({ message: 'Branch / Department is required' });
    }
    if (!examDate) {
      return res.status(400).json({ message: 'Exam date is required' });
    }
    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'Both Start Time and End Time are required' });
    }
    if (!roomNumber || !roomNumber.trim()) {
      return res.status(400).json({ message: 'Room / Hall number is required' });
    }

    // 2. Date Validation
    const parsedDate = new Date(examDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid exam date format provided' });
    }

    // 3. Time Validation (End time > Start time rule)
    const startMins = parseTimeToMinutes(startTime);
    const endMins = parseTimeToMinutes(endTime);

    if (isNaN(startMins) || isNaN(endMins)) {
      return res.status(400).json({ message: 'Invalid start or end time format. Example format: "09:30 AM" or "14:00"' });
    }

    if (endMins <= startMins) {
      return res.status(400).json({
        message: `Validation Error: Exam End Time (${endTime}) must be strictly later than Start Time (${startTime}).`
      });
    }

    // 4. Create and persist Exam in MongoDB
    const exam = await Exam.create({
      subjectName: subjectName.trim(),
      subjectCode: subjectCode.trim().toUpperCase(),
      academicYear: academicYear.trim(),
      branch: branch.trim(),
      examDate: parsedDate,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      roomNumber: roomNumber.trim(),
      createdBy: req.user._id
    });

    res.status(201).json({
      message: 'Exam schedule published successfully',
      exam
    });
  } catch (error) {
    console.error('Create Exam Error:', error);
    res.status(500).json({ message: 'Failed to create exam schedule: ' + error.message });
  }
};

// @desc    Get all scheduled exams (Admin view with search/filter)
// @route   GET /api/exams
// @access  Private (Admin Only)
const getAllExams = async (req, res) => {
  try {
    const { branch, academicYear, search } = req.query;
    let query = {};

    if (branch) query.branch = branch;
    if (academicYear) query.academicYear = academicYear;
    if (search) {
      query.$or = [
        { subjectName: { $regex: search, $options: 'i' } },
        { subjectCode: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const exams = await Exam.find(query).sort({ examDate: 1, startTime: 1 });
    res.json(exams);
  } catch (error) {
    console.error('Get All Exams Error:', error);
    res.status(500).json({ message: 'Error retrieving exam schedules: ' + error.message });
  }
};

// @desc    Get exams for logged-in student strictly matching their academic year & branch
// @route   GET /api/exams/student
// @access  Private (Student Only)
const getStudentExams = async (req, res) => {
  try {
    const { academicYear, branch } = req.user;

    if (!academicYear || !branch) {
      return res.status(400).json({
        message: 'Student profile missing Academic Year or Branch details. Please update your profile.'
      });
    }

    // Strict filter matching logged-in student's branch and year
    const exams = await Exam.find({
      academicYear: academicYear,
      branch: branch
    }).sort({ examDate: 1, startTime: 1 });

    res.json({
      student: {
        name: req.user.name,
        email: req.user.email,
        rollNumber: req.user.rollNumber,
        academicYear: req.user.academicYear,
        branch: req.user.branch
      },
      count: exams.length,
      exams
    });
  } catch (error) {
    console.error('Get Student Exams Error:', error);
    res.status(500).json({ message: 'Error retrieving student examination schedule: ' + error.message });
  }
};

// @desc    Delete/Cancel a scheduled exam
// @route   DELETE /api/exams/:id
// @access  Private (Admin Only)
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam record not found' });
    }

    await Exam.findByIdAndDelete(req.params.id);

    res.json({ message: 'Exam schedule deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete Exam Error:', error);
    res.status(500).json({ message: 'Error deleting exam record: ' + error.message });
  }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/exams/stats
// @access  Private (Admin Only)
const getExamStats = async (req, res) => {
  try {
    const totalExams = await Exam.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    
    // Distinct branches
    const activeBranches = await Exam.distinct('branch');
    
    // Upcoming exams count from today onwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingExams = await Exam.countDocuments({ examDate: { $gte: today } });

    res.json({
      totalExams,
      totalStudents,
      activeBranchesCount: activeBranches.length,
      upcomingExams
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({ message: 'Error calculating dashboard statistics: ' + error.message });
  }
};

module.exports = {
  createExam,
  getAllExams,
  getStudentExams,
  deleteExam,
  getExamStats
};

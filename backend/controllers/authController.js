const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Exam = require('../models/Exam');

// Helper to generate JWT token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'super_secret_exam_portal_key_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user (Admin or Student)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, academicYear, branch, adminId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please complete all mandatory registration fields' });
    }

    // Role specific validation
    if (role === 'student') {
      if (!rollNumber || !academicYear || !branch) {
        return res.status(400).json({ message: 'Students must provide Roll Number, Academic Year, and Branch' });
      }
    } else if (role === 'admin') {
      if (!adminId) {
        return res.status(400).json({ message: 'Administrators must provide an Admin Staff ID' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid user role selected' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email address already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      rollNumber: role === 'student' ? rollNumber : '',
      academicYear: role === 'student' ? academicYear : '',
      branch: role === 'student' ? branch : '',
      adminId: role === 'admin' ? adminId : ''
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          rollNumber: user.rollNumber,
          academicYear: user.academicYear,
          branch: user.branch,
          adminId: user.adminId
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration: ' + error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or user not found' });
    }

    // Verify role matches if supplied
    if (role && user.role !== role) {
      return res.status(403).json({ message: `Access denied. Account is registered as ${user.role.toUpperCase()}, not ${role.toUpperCase()}` });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        academicYear: user.academicYear,
        branch: user.branch,
        adminId: user.adminId
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login: ' + error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    rollNumber: req.user.rollNumber,
    academicYear: req.user.academicYear,
    branch: req.user.branch,
    adminId: req.user.adminId
  });
};

// @desc    Seed demo data for testing convenience
// @route   POST /api/auth/seed
// @access  Public
const seedDemoData = async (req, res) => {
  try {
    // Clear existing sample users if needed or check existing
    const adminEmail = 'admin@college.edu';
    const studentEmail = 'student@college.edu';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Dr. Robert Vance',
        email: adminEmail,
        password: 'Password123!',
        role: 'admin',
        adminId: 'ADM-2026-99'
      });
    }

    let student = await User.findOne({ email: studentEmail });
    if (!student) {
      student = await User.create({
        name: 'Alex Johnson',
        email: studentEmail,
        password: 'Password123!',
        role: 'student',
        rollNumber: 'CS2026042',
        academicYear: '3rd Year',
        branch: 'Computer Science'
      });
    }

    // Seed initial exams if count is 0
    const examCount = await Exam.countDocuments();
    if (examCount === 0) {
      const sampleExams = [
        {
          subjectName: 'Data Structures & Algorithms',
          subjectCode: 'CS301',
          academicYear: '3rd Year',
          branch: 'Computer Science',
          examDate: new Date('2026-10-15'),
          startTime: '09:30 AM',
          endTime: '12:30 PM',
          roomNumber: 'Exam Hall 101',
          createdBy: admin._id
        },
        {
          subjectName: 'Database Management Systems',
          subjectCode: 'CS302',
          academicYear: '3rd Year',
          branch: 'Computer Science',
          examDate: new Date('2026-10-18'),
          startTime: '02:00 PM',
          endTime: '05:00 PM',
          roomNumber: 'Computer Lab 3',
          createdBy: admin._id
        },
        {
          subjectName: 'Computer Networks',
          subjectCode: 'CS303',
          academicYear: '3rd Year',
          branch: 'Computer Science',
          examDate: new Date('2026-10-21'),
          startTime: '09:30 AM',
          endTime: '12:30 PM',
          roomNumber: 'Auditorium Hall B',
          createdBy: admin._id
        },
        {
          subjectName: 'Digital Signal Processing',
          subjectCode: 'EC201',
          academicYear: '2nd Year',
          branch: 'Electronics & Comm',
          examDate: new Date('2026-10-16'),
          startTime: '09:30 AM',
          endTime: '12:30 PM',
          roomNumber: 'Electronics Lab 1',
          createdBy: admin._id
        }
      ];

      await Exam.insertMany(sampleExams);
    }

    res.json({
      message: 'Demo credentials and sample examination schedules successfully seeded!',
      credentials: {
        admin: { email: 'admin@college.edu', password: 'Password123!', role: 'admin' },
        student: { email: 'student@college.edu', password: 'Password123!', role: 'student', branch: 'Computer Science', academicYear: '3rd Year' }
      }
    });
  } catch (error) {
    console.error('Seed Error:', error);
    res.status(500).json({ message: 'Failed to seed data: ' + error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  seedDemoData
};

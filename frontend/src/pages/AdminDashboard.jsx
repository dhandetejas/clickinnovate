import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ExamFormModal from '../components/ExamFormModal';
import { PlusCircle, Search, Filter, Trash2, Calendar, Clock, MapPin, BookOpen, Users, Layers, Award, AlertCircle } from 'lucide-react';

const ACADEMIC_YEARS = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const BRANCHES = [
  'All Branches',
  'Computer Science',
  'Electronics & Comm',
  'Mechanical',
  'Civil',
  'Information Tech'
];

const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    totalStudents: 0,
    activeBranchesCount: 0,
    upcomingExams: 0
  });

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedYear, setSelectedYear] = useState('All Years');

  const [notification, setNotification] = useState({ type: '', message: '' });

  const fetchExamsAndStats = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedBranch !== 'All Branches') params.branch = selectedBranch;
      if (selectedYear !== 'All Years') params.academicYear = selectedYear;
      if (search) params.search = search;

      const [examsRes, statsRes] = await Promise.all([
        API.get('/exams', { params }),
        API.get('/exams/stats')
      ]);

      setExams(examsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamsAndStats();
  }, [selectedBranch, selectedYear, search]);

  const handleCreateExam = async (examPayload) => {
    await API.post('/exams', examPayload);
    showNotification('success', 'New exam schedule published successfully!');
    fetchExamsAndStats();
  };

  const handleDeleteExam = async (id, subjectName) => {
    if (window.confirm(`Are you sure you want to cancel and delete the exam schedule for "${subjectName}"?`)) {
      try {
        await API.delete(`/exams/${id}`);
        showNotification('success', `Exam "${subjectName}" deleted successfully.`);
        fetchExamsAndStats();
      } catch (err) {
        showNotification('error', err.response?.data?.message || 'Failed to delete exam schedule');
      }
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-500/30">
            <Award className="h-3.5 w-3.5" /> Administrator Operations Portal
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
            Examination Schedule Dashboard
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Publish semester examination schedules, manage hall room allocations, and filter active timetables.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center space-x-2 shrink-0"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Schedule New Exam</span>
        </button>
      </div>

      {/* Toast Notification */}
      {notification.message && (
        <div className={`p-4 rounded-2xl border text-sm font-medium flex items-center space-x-2 animate-fadeIn ${
          notification.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Scheduled</div>
            <div className="font-heading text-2xl font-bold text-slate-900">{stats.totalExams}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Exams</div>
            <div className="font-heading text-2xl font-bold text-slate-900">{stats.upcomingExams}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Departments</div>
            <div className="font-heading text-2xl font-bold text-slate-900">{stats.activeBranchesCount}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Students</div>
            <div className="font-heading text-2xl font-bold text-slate-900">{stats.totalStudents}</div>
          </div>
        </div>

      </div>

      {/* Filter & Search Bar Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subject name, code, or hall..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <Filter className="h-4 w-4" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {BRANCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {ACADEMIC_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Master Exam Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-heading font-bold text-base text-slate-800">Published Exam Timetable</h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-full">
            Showing {exams.length} Records
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Loading exam schedules...</div>
        ) : exams.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto" />
            <h3 className="font-heading font-bold text-slate-700 text-lg">No Exams Match Criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No exam schedules found for the selected branch/year filters. Click "Schedule New Exam" above to add one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="py-3.5 px-6">Subject Code</th>
                  <th className="py-3.5 px-6">Subject Name</th>
                  <th className="py-3.5 px-6">Academic Year & Branch</th>
                  <th className="py-3.5 px-6">Exam Date</th>
                  <th className="py-3.5 px-6">Time Slot</th>
                  <th className="py-3.5 px-6">Assigned Hall</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {exams.map((exam) => (
                  <tr key={exam._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600">{exam.subjectCode}</td>
                    <td className="py-4 px-6 font-semibold text-slate-900">{exam.subjectName}</td>
                    <td className="py-4 px-6 text-slate-600 text-xs">
                      <span className="font-semibold text-slate-800 block">{exam.branch}</span>
                      <span className="text-slate-400">{exam.academicYear}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-medium whitespace-nowrap">
                      {formatDate(exam.examDate)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-mono bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100 font-medium">
                        <Clock className="h-3 w-3 text-indigo-500" /> {exam.startTime} - {exam.endTime}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {exam.roomNumber}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteExam(exam._id, exam.subjectName)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors inline-flex items-center space-x-1"
                        title="Cancel/Delete exam schedule"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-xs font-semibold">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Add Exam Modal Component */}
      <ExamFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateExam}
      />

    </div>
  );
};

export default AdminDashboard;

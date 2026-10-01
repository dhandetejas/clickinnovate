import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import HallPassCard from '../components/HallPassCard';
import { Calendar, ShieldCheck, Clock, MapPin, BookOpen, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('timetable'); // 'timetable' or 'hallpass'

  const [studentData, setStudentData] = useState(user);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudentExams = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/exams/student');
      setStudentData(res.data.student || user);
      setExams(res.data.exams || []);
    } catch (err) {
      console.error('Failed to fetch student exams:', err);
      setError(err.response?.data?.message || 'Error loading examination schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentExams();
  }, []);

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
      
      {/* Student Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-800 no-print">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-blue-500/30">
            <UserCheck className="h-3.5 w-3.5" /> Enrolled Candidate
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {studentData?.name || user?.name}!
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Academic Year: <span className="font-semibold text-white">{studentData?.academicYear || user?.academicYear}</span> • 
            Department: <span className="font-semibold text-white">{studentData?.branch || user?.branch}</span> • 
            Roll No: <span className="font-mono text-indigo-300 font-bold">{studentData?.rollNumber || user?.rollNumber}</span>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('timetable')}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'timetable'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Class Timetable</span>
          </button>

          <button
            onClick={() => setActiveTab('hallpass')}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'hallpass'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Exam Hall Pass Card</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Tab Content */}
      {activeTab === 'timetable' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-heading font-bold text-xl text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Scheduled Examinations ({exams.length})
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-200/70 px-3 py-1 rounded-full">
              Filtered for {user?.branch} ({user?.academicYear})
            </span>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 font-medium border border-slate-200">
              Loading examination schedules...
            </div>
          ) : exams.length === 0 ? (
            /* Friendly Empty State Prompt */
            <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border-2 border-dashed border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="font-heading font-bold text-slate-800 text-xl">No Exams Scheduled Yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                There are currently no examination schedules published for <span className="font-semibold text-slate-700">{user?.branch} ({user?.academicYear})</span>. Please check back later or contact your department administrator.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <div
                  key={exam._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-200 flex flex-col justify-between space-y-4 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 group-hover:bg-indigo-600 transition-colors"></div>

                  <div className="space-y-2 pl-2">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 uppercase">
                        {exam.subjectCode}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {exam.academicYear}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-slate-900 leading-snug">
                      {exam.subjectName}
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100 pl-2">
                    <div className="flex items-center space-x-2 text-slate-700 font-medium">
                      <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
                      <span>{formatDate(exam.examDate)}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-700">
                      <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span className="font-mono">{exam.startTime} - {exam.endTime}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 w-fit">
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Hall / Room: {exam.roomNumber}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Hall Pass Tab */
        <HallPassCard student={studentData || user} exams={exams} />
      )}

    </div>
  );
};

export default StudentDashboard;

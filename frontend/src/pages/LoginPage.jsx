import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, ShieldAlert, UserCheck, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

const LoginPage = ({ onNavigateRegister }) => {
  const { login, seedDemo } = useContext(AuthContext);

  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [seedStatus, setSeedStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError('Please enter both email and password.');
    }

    try {
      setSubmitting(true);
      await login(email, password, role);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'admin') {
      setRole('admin');
      setEmail('admin@college.edu');
      setPassword('Password123!');
    } else {
      setRole('student');
      setEmail('student@college.edu');
      setPassword('Password123!');
    }
  };

  const handleSeedData = async () => {
    try {
      setSeedStatus('Seeding demo accounts...');
      const res = await seedDemo();
      setSeedStatus(res.message || 'Demo data ready! You can now log in.');
      setTimeout(() => setSeedStatus(''), 4000);
    } catch (err) {
      setSeedStatus('Seeding error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-900/95 relative overflow-hidden">
      
      {/* Decorative gradient glow background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative z-10">
        
        {/* Header Banner */}
        <div className="bg-slate-900 p-6 sm:p-8 text-center border-b border-slate-800 text-white relative">
          <div className="inline-flex p-3 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl shadow-lg mb-3">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight">College Exam Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Role-Based Portal Access for Admin & Students</p>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/80 rounded-xl mt-6 border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                role === 'student'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Student Login</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                role === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {seedStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
              {seedStatus}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'admin@college.edu' : 'student@college.edu'}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3.5 px-4 font-semibold text-white text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 ${
              role === 'admin'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
            }`}
          >
            <span>{submitting ? 'Authenticating...' : `Log In as ${role.toUpperCase()}`}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Quick Demo Credential Fillers */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2">
              Quick Test Credentials
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { handleSeedData(); handleFillDemo('student'); }}
                className="py-1.5 px-2.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
              >
                Auto-Fill Student
              </button>
              <button
                type="button"
                onClick={() => { handleSeedData(); handleFillDemo('admin'); }}
                className="py-1.5 px-2.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
              >
                Auto-Fill Admin
              </button>
            </div>
          </div>

        </form>

        {/* Footer Navigation link */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-600">
          Don't have an account yet?{' '}
          <button
            onClick={onNavigateRegister}
            className="font-bold text-blue-600 hover:underline"
          >
            Create New Account
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, LogOut, ShieldAlert, UserCheck, Sparkles } from 'lucide-react';

const Navbar = ({ onSeedClick }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-40 border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl shadow-md flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-heading text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                ExamPass Pro
              </span>
              <span className="hidden sm:inline-block text-xs block text-slate-400 font-medium">
                College Timetable & Hall Pass Portal
              </span>
            </div>
          </div>

          {/* User Status & Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Seed Demo Button */}
            <button
              onClick={onSeedClick}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-indigo-300 bg-indigo-950/70 border border-indigo-700/50 hover:bg-indigo-900 transition-colors"
              title="Populate test admin & student credentials with sample exams"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-indigo-400 animate-pulse" />
              Seed Demo Data
            </button>

            {user ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
                
                {/* User Role Badge & Info */}
                <div className="text-right hidden md:block">
                  <div className="text-sm font-semibold text-slate-200">{user.name}</div>
                  <div className="text-xs text-slate-400 flex items-center justify-end space-x-1">
                    {user.role === 'admin' ? (
                      <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center">
                        <ShieldAlert className="h-3 w-3 inline mr-1" /> Admin ({user.adminId || 'Staff'})
                      </span>
                    ) : (
                      <span className="text-blue-400 font-bold uppercase tracking-wider flex items-center">
                        <UserCheck className="h-3 w-3 inline mr-1" /> {user.branch} • {user.academicYear}
                      </span>
                    )}
                  </div>
                </div>

                {/* Role Pill Badge */}
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                  user.role === 'admin' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {user.role}
                </span>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Log out of session"
                >
                  <LogOut className="h-5 w-5" />
                </button>

              </div>
            ) : (
              <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                Portal Authentication Required
              </span>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

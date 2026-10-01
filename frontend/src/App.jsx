import React, { useState, useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';

const MainContent = () => {
  const { user, loading, seedDemo } = useContext(AuthContext);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [globalNotice, setGlobalNotice] = useState('');

  const handleSeedClick = async () => {
    try {
      const res = await seedDemo();
      setGlobalNotice(res.message || 'Demo credentials and sample exams seeded successfully!');
      setTimeout(() => setGlobalNotice(''), 4000);
      window.location.reload();
    } catch (err) {
      setGlobalNotice('Seeding error: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-medium">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-400">Loading College Exam Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onSeedClick={handleSeedClick} />

      {globalNotice && (
        <div className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 text-center no-print">
          {globalNotice}
        </div>
      )}

      <main className="flex-grow">
        {!user ? (
          authView === 'login' ? (
            <LoginPage onNavigateRegister={() => setAuthView('register')} />
          ) : (
            <RegisterPage onNavigateLogin={() => setAuthView('login')} />
          )
        ) : user.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <StudentDashboard />
        )}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} College Exam Timetable & Hall Pass Portal. All Rights Reserved.</span>
          <span className="font-mono text-slate-400">Powered by Node.js, Express, MongoDB & React</span>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;

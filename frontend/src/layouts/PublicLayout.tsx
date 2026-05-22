import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLogo from '../components/common/AppLogo';
import { db } from '../lib/mockServer';

export const PublicLayout: React.FC = () => {
  const handleToggleDemoMode = () => {
    db.demoMode = !db.demoMode;
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between font-sans relative">
      {/* Floating Demo Mode switch badge */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleToggleDemoMode}
          className={`py-1 px-2.5 rounded-full text-[10px] font-bold border shadow-sm transition-all ${
            db.demoMode
              ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
          }`}
        >
          {db.demoMode ? '🟠 Demo Mode' : '🟢 API Mode'}
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Brand header */}
          <div className="flex justify-center mb-6 select-none animate-slide-up">
            <AppLogo iconClassName="p-2" textClassName="text-2xl" />
          </div>
          
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-text-secondary select-none">
        <span>© {new Date().getFullYear()} Colombo General Hospital OPD Queue Management System</span>
      </footer>
    </div>
  );
};
export default PublicLayout;

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Activity } from 'lucide-react';
import { db } from '../lib/mockServer';

export const DoctorLayout: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleToggleDemoMode = () => {
    const isMock = db.demoMode;
    db.demoMode = !isMock;
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden font-sans">
      {/* Doctor-Specific Minimal Topbar */}
      <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 select-none shrink-0 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-primary rounded text-white flex items-center justify-center">
              <Activity size={18} className="stroke-[2.5]" />
            </div>
            <span className="font-sans font-black tracking-tight text-lg text-text-primary">
              Care<span className="text-primary">Q</span>
            </span>
          </div>
          <span className="h-4 w-px bg-border"></span>
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Colombo General Hospital
          </span>
          <span className="h-4 w-px bg-border"></span>
          <span className="bg-primary-light text-primary font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
            Doctor Station Console
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Demo Mode toggle */}
          <button
            onClick={handleToggleDemoMode}
            className={`py-1 px-2.5 rounded-md text-[10px] font-semibold border transition-all ${
              db.demoMode
                ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            {db.demoMode ? '🟠 Demo Mode' : '🟢 API Mode'}
          </button>

          <span className="h-6 w-px bg-border"></span>

          <div className="flex items-center gap-3">
            <div className="flex flex-col select-text items-end">
              <span className="text-xs font-bold text-text-primary leading-tight">{profile?.name}</span>
              <span className="text-[10px] text-text-secondary leading-none capitalize">
                {profile?.departmentId === 'dept-opd' ? 'General OPD' : profile?.departmentId === 'dept-cardio' ? 'Cardiology' : 'Pediatrics'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 hover:text-red-700 text-text-secondary rounded-lg transition-all"
              title="Log Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-screen-2xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
export default DoctorLayout;

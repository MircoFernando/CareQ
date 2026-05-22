import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  BarChart3,
  Sliders,
  Users2,
  FileSearch,
  ClipboardList,
  LogOut,
  Stethoscope,
  Activity
} from 'lucide-react';
import { db } from '../../lib/mockServer';

export const Sidebar: React.FC = () => {
  const { role, logout, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Toggle Mock demo mode
  const handleToggleDemoMode = () => {
    const isMock = db.demoMode;
    db.demoMode = !isMock;
    window.location.reload();
  };

  const getLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
          { to: '/admin/stations', label: 'Doctor Stations', icon: Stethoscope },
          { to: '/admin/configuration', label: 'SLA Settings', icon: Sliders },
          { to: '/admin/staff', label: 'Staff Management', icon: Users2 },
          { to: '/admin/audit', label: 'Token Audit Log', icon: FileSearch },
          { to: '/admin/reports', label: 'Daily Reports', icon: ClipboardList },
        ];
      case 'nurse':
        return [
          { to: '/nurse/triage', label: 'Triage Console', icon: ClipboardList },
        ];
      case 'doctor':
        return [
          { to: '/doctor/station', label: 'Doctor Station', icon: Stethoscope },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-56 bg-white border-r border-border min-h-screen flex flex-col justify-between select-none shrink-0">
      <div className="flex flex-col">
        {/* Navigation Head Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border gap-2">
          <div className="p-1 bg-primary rounded text-white flex items-center justify-center">
            <Activity size={18} className="stroke-[2.5]" />
          </div>
          <span className="font-sans font-black tracking-tight text-lg text-text-primary">
            Care<span className="text-primary">Q</span>
          </span>
        </div>

        {/* Links lists */}
        <nav className="p-4 flex flex-col gap-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-primary-light text-primary font-bold border-l-4 border-primary rounded-l-none'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg'
                  }`
                }
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom utilities - logout and demo mode controller */}
      <div className="p-4 border-t border-border flex flex-col gap-3">
        {/* Interactive mock server badge controller */}
        <button
          onClick={handleToggleDemoMode}
          className={`w-full py-1.5 px-3 rounded-md text-xs font-semibold text-center border transition-all ${
            db.demoMode
              ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
          }`}
        >
          {db.demoMode ? '🟠 Demo Mode (Local)' : '🟢 Real API Mode'}
        </button>

        <div className="flex items-center gap-3 px-3 py-1 bg-bg/50 rounded-lg">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-text-primary truncate">{profile?.name}</span>
            <span className="text-[10px] text-text-secondary capitalize">{profile?.role}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;

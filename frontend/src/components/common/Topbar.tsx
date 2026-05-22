import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from './Avatar';
import { Bell, ShieldAlert, Award } from 'lucide-react';
import { useQueue } from '../../hooks/useQueue';

export const Topbar: React.FC = () => {
  const { profile } = useAuth();
  const { stats } = useQueue(profile?.departmentId || null);
  const [showNotifications, setShowNotifications] = useState(false);

  const mockHospitalName = 'Colombo General Hospital';

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 select-none shrink-0 relative">
      {/* Left section: Hospital info and Department */}
      <div className="flex items-center gap-3">
        <span className="font-semibold text-text-primary text-sm">{mockHospitalName}</span>
        <span className="h-4 w-px bg-border"></span>
        {profile?.departmentId ? (
          <span className="bg-primary-light text-primary font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
            {profile.departmentId === 'dept-opd' ? 'General OPD Intake' : profile.departmentId === 'dept-cardio' ? 'Cardiology' : 'Pediatrics'}
          </span>
        ) : (
          <span className="bg-slate-100 text-slate-700 font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
            Hospital Admin Console
          </span>
        )}
      </div>

      {/* Right Section: Alerts + User Card */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-bg rounded-full text-text-secondary hover:text-text-primary transition-all relative"
          >
            <Bell size={20} />
            {stats?.slaBreachCountToday > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emergency rounded-full animate-pulse border border-white"></span>
            )}
          </button>

          {/* SLA Alerts Dropdown Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-border rounded-xl shadow-xl z-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-text-primary">Today's SLA Breach Alerts</span>
                <span className="bg-red-100 text-red-700 font-semibold text-xs px-2 py-0.5 rounded-full">
                  {stats?.slaBreachCountToday || 0} breaches
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto flex flex-col gap-2 mt-2">
                {stats?.slaBreachCountToday > 0 ? (
                  <div className="flex gap-3 items-start p-2.5 bg-orange-50 border-l-4 border-orange-500 rounded-r-md">
                    <ShieldAlert className="text-orange-500 shrink-0 mt-0.5" size={16} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-text-primary">Active Breaches Triggered</span>
                      <span className="text-[10px] text-text-secondary mt-0.5">
                        Multiple waiting tokens have exceeded their SLA time limits. Review triage.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-text-secondary flex flex-col items-center justify-center gap-2">
                    <Award size={24} className="text-emerald-500" />
                    <span>Fantastic! No unresolved breaches.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <span className="h-6 w-px bg-border"></span>

        {/* User Card */}
        <div className="flex items-center gap-3">
          <Avatar name={profile?.name || 'Staff User'} size="md" />
          <div className="flex flex-col select-text hidden sm:flex">
            <span className="text-sm font-bold text-text-primary leading-tight">{profile?.name}</span>
            <span className="text-xs text-text-secondary leading-none uppercase tracking-wider mt-0.5">
              {profile?.role === 'admin' ? 'Administrator' : profile?.role === 'nurse' ? 'Triage Nurse' : 'OPD Doctor'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Topbar;

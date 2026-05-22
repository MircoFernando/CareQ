import React from 'react';
import { StaffProfile } from '../../types/auth.types';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';
import { Check, X, Shield, Users, Stethoscope, Mail } from 'lucide-react';

interface StaffRowProps {
  staff: StaffProfile;
  departmentName?: string;
  onToggleStatus: (id: string, isActive: boolean) => Promise<void>;
  isLoading?: boolean;
}

export const StaffRow: React.FC<StaffRowProps> = ({
  staff,
  departmentName,
  onToggleStatus,
  isLoading = false,
}) => {
  const getRoleIcon = () => {
    switch (staff.role) {
      case 'admin':
        return <Shield size={14} className="text-secondary" />;
      case 'nurse':
        return <Users size={14} className="text-primary" />;
      case 'doctor':
        return <Stethoscope size={14} className="text-indigo-500" />;
    }
  };

  return (
    <tr className="hover:bg-bg-secondary/40 transition-colors select-none">
      {/* Profile Name */}
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <Avatar name={staff.name} size="sm" className="font-bold border border-primary/10 shadow-sm" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-text-primary truncate select-all">{staff.name}</span>
            <span className="text-[10px] text-text-secondary mt-0.5 flex items-center gap-1">
              {getRoleIcon()}
              <span className="capitalize">{staff.role}</span>
            </span>
          </div>
        </div>
      </td>

      {/* Email Address */}
      <td className="py-4 px-4 font-medium text-text-secondary text-xs">
        <div className="flex items-center gap-1.5 select-all">
          <Mail size={12} className="text-text-secondary/60 shrink-0" />
          <span className="truncate">{staff.email}</span>
        </div>
      </td>

      {/* Assigned Clinic */}
      <td className="py-4 px-4 font-bold text-text-primary text-xs">
        {staff.role === 'admin' ? (
          <span className="text-[10px] text-text-secondary/50 font-normal italic">Global System Access</span>
        ) : (
          departmentName || (
            <span className="text-[10px] text-red-500 font-normal italic">Unassigned Clinic</span>
          )
        )}
      </td>

      {/* Account Status Badge */}
      <td className="py-4 px-4">
        <Badge
          variant={staff.isActive ? 'active' : 'deactivated'}
          className="font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded-full select-none"
        >
          {staff.isActive ? 'Active' : 'Deactivated'}
        </Badge>
      </td>

      {/* Action Toggle Status */}
      <td className="py-4 pl-4 text-right">
        <button
          onClick={() => onToggleStatus(staff.id, !staff.isActive)}
          disabled={isLoading}
          className={`inline-flex items-center justify-center p-1.5 border rounded-xl shadow-sm transition-all duration-200 ${
            staff.isActive
              ? 'border-red-200 hover:bg-red-50 text-red-500'
              : 'border-emerald-200 hover:bg-emerald-50 text-emerald-500'
          }`}
          title={staff.isActive ? 'Deactivate Employee' : 'Activate Employee'}
        >
          {staff.isActive ? <X size={15} /> : <Check size={15} />}
        </button>
      </td>
    </tr>
  );
};

export default StaffRow;

import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emergency' | 'urgent' | 'normal' | 'sla' | 'active' | 'paused' | 'deactivated';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'normal', className = '' }) => {
  const variantStyles = {
    emergency: 'bg-red-100 text-red-700 border-red-300 font-semibold',
    urgent: 'bg-orange-100 text-orange-700 border-orange-300 font-semibold',
    normal: 'bg-teal-100 text-teal-700 border-teal-300 font-semibold',
    sla: 'bg-amber-100 text-amber-800 border-amber-300 animate-sla-breach font-bold',
    active: 'bg-green-100 text-green-700 border-green-300 font-medium',
    paused: 'bg-gray-100 text-gray-600 border-gray-300 font-medium',
    deactivated: 'bg-red-50 text-red-600 border-red-200 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border tracking-wide select-none',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
export default Badge;

import React from 'react';
import { cn } from '../../lib/utils';

interface StatusPillProps {
  status: 'active' | 'paused' | 'deactivated';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const styles = {
    active: 'bg-green-500',
    paused: 'bg-amber-500',
    deactivated: 'bg-red-500',
  };

  const label = {
    active: 'Active',
    paused: 'Paused',
    deactivated: 'Inactive',
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold select-none border border-black/5 bg-slate-50 text-text-primary">
      <span className={cn('w-2 h-2 rounded-full shrink-0', styles[status])} />
      <span>{label[status]}</span>
    </span>
  );
};
export default StatusPill;

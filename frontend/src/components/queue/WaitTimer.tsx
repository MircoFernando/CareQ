import React, { useState, useEffect } from 'react';
import { formatWaitTime } from '../../lib/utils';
import { Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface WaitTimerProps {
  startedAt: string; // ISO string
  slaMinutes?: number;
  className?: string;
}

export const WaitTimer: React.FC<WaitTimerProps> = ({ startedAt, slaMinutes = 20, className = '' }) => {
  const getElapsed = () => Math.floor((Date.now() - new Date(startedAt).getTime()) / 60000);
  const [elapsed, setElapsed] = useState(getElapsed());

  useEffect(() => {
    setElapsed(getElapsed());
    const interval = setInterval(() => {
      setElapsed(getElapsed());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [startedAt]);

  const isBreached = elapsed > slaMinutes;
  const isApproaching = elapsed > slaMinutes * 0.75 && elapsed <= slaMinutes;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-sm font-semibold select-none',
        isBreached
          ? 'text-emergency bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full animate-sla-breach font-black'
          : isApproaching
          ? 'text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full'
          : 'text-text-secondary',
        className
      )}
    >
      <Clock size={14} className={isBreached ? 'stroke-[2.5]' : ''} />
      <span>{formatWaitTime(elapsed)}</span>
    </span>
  );
};
export default WaitTimer;
  

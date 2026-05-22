import React, { useState, useEffect } from 'react';

interface ConsultationTimerProps {
  startedAt: string | null;
  isActive: boolean;
  className?: string;
}

export const ConsultationTimer: React.FC<ConsultationTimerProps> = ({
  startedAt,
  isActive,
  className = '',
}) => {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    if (!isActive || !startedAt) {
      setElapsed(0);
      return;
    }

    const startTime = new Date(startedAt).getTime();
    
    // Initial update
    const updateTimer = () => {
      const now = Date.now();
      const difference = Math.max(0, Math.floor((now - startTime) / 1000));
      setElapsed(difference);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startedAt, isActive]);

  const formatElapsed = (secondsCount: number) => {
    const hours = Math.floor(secondsCount / 3600);
    const minutes = Math.floor((secondsCount % 3600) / 60);
    const seconds = secondsCount % 60;

    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Warning thresholds for consultation duration SLA (e.g. orange after 15m, red after 30m)
  const getTimerColors = () => {
    if (!isActive) return 'bg-bg-tertiary border-border-default text-text-secondary';
    if (elapsed >= 1800) return 'bg-red-50 border-red-200 text-red-600 animate-pulse'; // 30 mins
    if (elapsed >= 900) return 'bg-amber-50 border-amber-200 text-amber-600'; // 15 mins
    return 'bg-emerald-50 border-emerald-200 text-emerald-600';
  };

  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-1.5 border rounded-full font-mono text-xs font-bold transition-all duration-300 ${getTimerColors()} ${className}`}
    >
      <span className="flex h-2 w-2 relative shrink-0">
        {isActive && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
        )}
        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
      </span>
      <span>Consultation: {formatElapsed(elapsed)}</span>
    </div>
  );
};

export default ConsultationTimer;

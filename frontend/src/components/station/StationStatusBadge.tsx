import React from 'react';

interface StationStatusBadgeProps {
  isPaused: boolean;
  isActiveDoctor: boolean;
  currentServedTokenNumber?: string | null;
  className?: string;
}

export const StationStatusBadge: React.FC<StationStatusBadgeProps> = ({
  isPaused,
  isActiveDoctor,
  currentServedTokenNumber,
  className = '',
}) => {
  const getBadgeConfig = () => {
    if (!isActiveDoctor) {
      return {
        bg: 'bg-bg-tertiary border-border-default text-text-secondary',
        label: 'Offline / Closed',
        indicator: 'bg-text-secondary/40',
      };
    }
    if (isPaused) {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-600',
        label: 'Paused',
        indicator: 'bg-amber-500 animate-pulse',
      };
    }
    if (currentServedTokenNumber) {
      return {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
        label: `Serving: ${currentServedTokenNumber}`,
        indicator: 'bg-emerald-500',
      };
    }
    return {
      bg: 'bg-primary-light border-primary/20 text-primary-dark',
      label: 'Ready / Active',
      indicator: 'bg-primary animate-pulse',
    };
  };

  const config = getBadgeConfig();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-[10px] font-extrabold uppercase tracking-wider ${config.bg} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.indicator} shrink-0`} />
      <span>{config.label}</span>
    </div>
  );
};

export default StationStatusBadge;

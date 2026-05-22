import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '', label }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-primary border-r-primary/20 border-b-primary/20 border-l-primary/20 ${sizeClasses[size]}`}
        style={{ borderTopColor: '#1A8C7A' }}
      ></div>
      {label && <span className="text-xs font-semibold text-text-secondary">{label}</span>}
    </div>
  );
};
export default LoadingSpinner;

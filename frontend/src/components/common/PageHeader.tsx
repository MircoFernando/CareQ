import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode; // Slot for action buttons
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 select-none animate-slide-up">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
};
export default PageHeader;

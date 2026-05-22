import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', header, footer, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-border shadow-sm overflow-hidden p-6',
        onClick ? 'cursor-pointer hover:shadow-md transition-all active:scale-[0.99]' : '',
        className
      )}
    >
      {header && <div className="border-b border-border pb-4 mb-4">{header}</div>}
      <div className="text-text-primary">{children}</div>
      {footer && <div className="border-t border-border pt-4 mt-4 text-xs text-text-secondary">{footer}</div>}
    </div>
  );
};
export default Card;

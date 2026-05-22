import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-semibold text-sm rounded-lg px-4 py-2.5 transition-all duration-150 active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none gap-2';

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm border border-primary',
    secondary: 'border border-border bg-white text-text-primary hover:bg-bg',
    danger: 'bg-emergency text-white hover:bg-red-700 shadow-sm border border-emergency',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg',
  };

  return (
    <button
      className={cn(baseStyle, variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
export default Button;

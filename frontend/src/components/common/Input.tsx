import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'px-4 py-2.5 rounded-lg border border-border bg-white text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-secondary/40 disabled:bg-bg disabled:text-text-secondary/50',
            error ? 'border-emergency focus:border-emergency focus:ring-emergency/20' : '',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs font-semibold text-emergency">{error}</span>}
        {!error && helperText && <span className="text-xs text-text-secondary">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

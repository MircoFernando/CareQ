import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'px-4 py-2.5 rounded-lg border border-border bg-white text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer disabled:bg-bg disabled:text-text-secondary/50',
            error ? 'border-emergency focus:border-emergency focus:ring-emergency/20' : '',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs font-semibold text-emergency">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;

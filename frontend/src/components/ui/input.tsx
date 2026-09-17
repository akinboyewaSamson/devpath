import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-semibold text-[#0D0D54]">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-[#1B1B38] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE5902]/30 focus:border-[#EE5902] transition-all disabled:cursor-not-allowed disabled:opacity-50 shadow-sm',
            error && 'border-red-500 focus:ring-red-500/30 focus:border-red-500',
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

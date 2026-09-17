import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#EE5902]/40 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#EE5902] hover:bg-[#D44E02] text-white shadow-sm hover:shadow transition-colors',
      secondary:
        'bg-white hover:bg-gray-50 text-[#1B1B38] border border-gray-200 shadow-sm',
      outline:
        'border border-gray-300 hover:border-[#EE5902] text-gray-700 hover:text-[#EE5902] bg-white transition-colors',
      ghost:
        'hover:bg-gray-100 text-gray-700 hover:text-[#0D0D54] bg-transparent transition-colors',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-sm',
      accent:
        'bg-[#0D0D54] hover:bg-[#1B1B38] text-white shadow-sm',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-8',
      md: 'text-sm px-4 py-2 h-10',
      lg: 'text-base px-6 py-2.5 h-12',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

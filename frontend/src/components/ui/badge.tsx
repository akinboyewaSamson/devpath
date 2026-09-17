import * as React from 'react';
import { cn } from '@/lib/utils';
import { TopicLevel } from '@/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'accent' | 'warning' | 'outline' | 'mono';
  level?: TopicLevel;
}

export function Badge({
  className,
  variant = 'default',
  level,
  children,
  ...props
}: BadgeProps) {
  let computedVariant = variant;
  let levelColor = '';

  if (level) {
    switch (level) {
      case 'BEGINNER':
        levelColor = 'bg-[#EFF6F6] text-[#376262] border-[#BEDADA]';
        break;
      case 'INTERMEDIATE':
        levelColor = 'bg-[#FFEFE6] text-[#EE5902] border-[#FEBF9A]';
        break;
      case 'ADVANCED':
        levelColor = 'bg-[#F8ECF8] text-[#70296E] border-[#E4B4E2]';
        break;
      case 'EXPERT':
        levelColor = 'bg-[#EEEEF7] text-[#151584] border-[#A7A7F1]';
        break;
    }
  }

  const variants = {
    default:
      'bg-gray-100 text-gray-700 border-gray-200',
    primary:
      'bg-[#FFEFE6] text-[#EE5902] border-[#FEBF9A]',
    accent:
      'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning:
      'bg-amber-50 text-amber-700 border-amber-200',
    outline:
      'border-gray-300 text-gray-600 bg-white',
    mono:
      'font-mono bg-gray-100 border-gray-200 text-gray-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors',
        level ? levelColor : variants[computedVariant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

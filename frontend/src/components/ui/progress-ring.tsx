'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showText?: boolean;
  strokeColor?: string;
}

export function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 10,
  className,
  showText = true,
  strokeColor = '#EE5902',
}: ProgressRingProps) {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg height={size} width={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          stroke="#F1F5F9"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress stroke */}
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {showText && (
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-heading text-2xl font-bold tracking-tight text-[#0D0D54]">
            {Math.round(percentage)}%
          </span>
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Completed</span>
        </div>
      )}
    </div>
  );
}

import * as React from 'react';
import { cn } from '@/lib/utils';

export function Card({
  className,
  children,
  hoverEffect = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hoverEffect?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white p-6 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
        hoverEffect &&
          'hover:border-[#FEBF9A] hover:shadow-[0_8px_24px_rgba(238,89,2,0.08)] hover:-translate-y-0.5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'font-bold leading-tight tracking-tight text-lg text-[#0D0D54] font-heading',
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-gray-500 leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center pt-4 border-t border-gray-100', className)} {...props}>
      {children}
    </div>
  );
}

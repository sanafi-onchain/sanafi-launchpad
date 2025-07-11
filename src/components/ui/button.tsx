import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'bg-gradient-to-r text-xs md:text-base from-primary to-[#0f172a] px-2 md:px-8 py-1 md:py-3 rounded-full hover:opacity-90 transition cursor-pointer font-semibold text-primary-foreground',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

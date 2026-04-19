import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', children, isLoading, ...props }, ref) => {
  const variants = {
    primary: 'bg-[var(--brand-primary)] text-[var(--text-inverse)] hover:bg-[var(--brand-primary-hover)] shadow-sm border border-transparent',
    secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border-color)] hover:bg-[var(--bg-hover)] shadow-sm border',
    outline: 'bg-transparent border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border',
    ghost: 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] border-transparent',
    danger: 'bg-[var(--accent-danger)] text-[var(--text-inverse)] hover:bg-[var(--accent-danger-hover)] shadow-sm border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;

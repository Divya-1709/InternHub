import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="ml-0.5 text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text-primary)] ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] transition-all disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-[var(--accent-danger)] focus-visible:ring-[var(--accent-danger)]',
          className
        )}
        {...props}
      />
      {error && <p className="ml-0.5 text-xs font-medium text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

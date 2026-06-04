import { ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'racing';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-blue/10 text-primary-blue',
    success: 'bg-accent-green/10 text-accent-green-dark',
    warning: 'bg-accent-amber/10 text-accent-amber',
    danger: 'bg-racing-red/10 text-racing-red',
    racing: 'bg-gradient-racing text-white',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}


import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'racing' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    className,
    children,
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-gradient-primary text-white shadow-md hover:shadow-xl hover:-translate-y-0.5',
      secondary: 'bg-white text-primary-blue border-2 border-primary-blue hover:bg-primary-blue hover:text-white',
      racing: 'bg-gradient-racing text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02]',
      outline: 'bg-transparent text-primary-blue border-2 border-primary-blue hover:bg-primary-blue hover:text-white',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const buttonClasses = clsx(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;


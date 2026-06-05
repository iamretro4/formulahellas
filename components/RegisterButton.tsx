'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

interface RegisterButtonProps {
  email: string;
  className?: string;
  variant?: 'hero' | 'default';
}

export default function RegisterButton({ email, className, variant = 'default' }: RegisterButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleRegister = () => {
    try {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch (err) {
      console.error('Failed to copy email to clipboard: ', err);
    }
  };

  const subject = encodeURIComponent('Formula Hellas 2026 Team Registration');
  const body = encodeURIComponent(
    `Dear Formula Hellas Organizers,\n\nWe would like to register our team for Formula Hellas 2026. Below are our details:\n\n1. Team Name: \n2. University: \n3. Class (EV or CV): \n4. Team Captain Full Name: \n5. Team Captain Phone Number: \n\nThank you!`
  );

  const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

  if (variant === 'hero') {
    return (
      <div className="flex flex-col items-center">
        <a
          href={mailtoUrl}
          onClick={handleRegister}
          className={className}
        >
          {copied ? 'Email Copied & Opening!' : 'Register'}
          {copied ? <Check className="w-5 h-5 text-green-300 animate-bounce" /> : <Mail className="w-5 h-5" />}
        </a>
        {copied && (
          <span className="mt-2 text-xs text-blue-200 bg-blue-900/60 backdrop-blur-sm px-3 py-1 rounded-full animate-fade-in font-mono shadow-md border border-white/10">
            Email copied to clipboard!
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <a
        href={mailtoUrl}
        onClick={handleRegister}
        className={className}
      >
        {copied ? <Check className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
        {copied ? 'Opening Mail & Copied Email!' : 'Register by email'}
      </a>
      {copied && (
        <p className="mt-3 text-sm text-green-600 font-semibold animate-fade-in">
          ✓ Registration email ({email}) copied to clipboard!
        </p>
      )}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/events/2026', label: 'Competition' },
  { href: '/about', label: 'About' },
  { href: '/registration', label: 'Registration' },
  { href: '/rules', label: 'Rules & Documents' },
  { href: '/join-us', label: 'Join us' },
  { href: '/contact', label: 'Contact us' },
  { href: '/team-portal', label: 'Team Portal' },
];

export default function NavigationClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className={clsx(
        'sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300',
        isScrolled ? 'shadow-lg border-gray-300' : 'shadow-sm border-gray-200'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={clsx(
            'flex justify-between items-center transition-all duration-300',
            isScrolled ? 'h-14' : 'h-16'
          )}
        >
          <Link href="/" className="flex items-center">
            <Logo height={36} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-blue rounded-md transition-colors ${
                  isActive(item.href) ? 'text-primary-blue bg-primary-blue/10' : 'hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-primary-blue hover:bg-gray-100 transition-all focus-ring"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-blue rounded-md transition-colors ${
                    isActive(item.href) ? 'text-primary-blue bg-primary-blue/10' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

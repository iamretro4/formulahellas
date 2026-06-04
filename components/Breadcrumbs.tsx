import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import clsx from 'clsx';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx('flex items-center space-x-2 text-sm', className)}
    >
      <Link
        href="/"
        className="text-gray-500 hover:text-primary-blue transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href || '#'}
                className="text-gray-500 hover:text-primary-blue transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}


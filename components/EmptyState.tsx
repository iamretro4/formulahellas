interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        {icon && (
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-4xl">
              {icon}
            </div>
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
        {action && (
          <a
            href={action.href}
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
          >
            {action.label}
          </a>
        )}
      </div>
    </div>
  );
}


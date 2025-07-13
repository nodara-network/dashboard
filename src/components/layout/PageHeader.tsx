interface PageHeaderProps {
  title: string;
  description: string;
  subtitle?: string;
}

export default function PageHeader({ title, description, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {description}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
} 
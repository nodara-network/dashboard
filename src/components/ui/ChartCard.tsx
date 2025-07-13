interface ChartCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  placeholderText?: string;
  placeholderSubtext?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function ChartCard({ 
  title, 
  description, 
  icon, 
  placeholderText = "Chart Coming Soon",
  placeholderSubtext = "Interactive charts and analytics",
  className = "",
  children
}: ChartCardProps) {
  return (
    <div className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
      </div>
      <div className="p-6">
        {children ? (
          children
        ) : (
          <div className="h-64 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              {icon && (
                <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
              )}
              <p className="text-gray-900 dark:text-white font-medium">{placeholderText}</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{placeholderSubtext}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
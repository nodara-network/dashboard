interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  isLoading?: boolean;
  className?: string;
}

export default function MetricCard({ 
  label, 
  value, 
  trend, 
  isLoading = true, 
  className = "" 
}: MetricCardProps) {
  return (
    <div className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {isLoading ? (
        <>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
          {trend && (
            <p className={`text-sm ${trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend}
            </p>
          )}
        </>
      )}
    </div>
  );
} 
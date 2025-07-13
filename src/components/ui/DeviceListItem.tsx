interface DeviceListItemProps {
  deviceId?: string;
  location?: string;
  status?: string;
  responseTime?: string;
  isLoading?: boolean;
  className?: string;
}

export default function DeviceListItem({ 
  deviceId, 
  location, 
  status, 
  responseTime, 
  isLoading = true, 
  className = "" 
}: DeviceListItemProps) {
  return (
    <div className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div>
          {isLoading ? (
            <>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </>
          ) : (
            <>
              <p className="text-gray-900 dark:text-white font-medium">{deviceId}</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{location}</p>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {isLoading ? (
          <>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
          </>
        ) : (
          <>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === 'online' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {status}
            </span>
            <span className="text-gray-600 dark:text-gray-300 text-sm">{responseTime}</span>
          </>
        )}
      </div>
    </div>
  );
} 
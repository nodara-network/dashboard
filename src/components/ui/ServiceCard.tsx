interface ServiceCardProps {
  title?: string;
  description?: string;
  price?: string;
  rating?: string;
  isLoading?: boolean;
  className?: string;
}

export default function ServiceCard({ 
  title, 
  description, 
  price, 
  rating, 
  isLoading = true, 
  className = "" 
}: ServiceCardProps) {
  return (
    <div className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all duration-300 ${className}`}>
      {isLoading ? (
        <>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{price}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{rating}</span>
          </div>
        </>
      )}
    </div>
  );
} 
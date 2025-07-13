import Link from 'next/link';

export default function AnalyticsOverview() {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Network Analytics</h2>
          <Link 
            href="/analytics"
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Comprehensive insights and performance metrics</p>
      </div>
      <div className="p-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { label: "Total Compute Hours", value: "1,247", trend: "+12.5%" },
            { label: "Active Devices", value: "1,923", trend: "+8.2%" },
            { label: "Revenue Generated", value: "₿2,847", trend: "+15.3%" },
            { label: "Avg Response", value: "12ms", trend: "-5.1%" },
          ].map((metric, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
            </div>
          ))}
        </div>
        
        {/* Chart Preview */}
        <div className="h-32 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-900 dark:text-white text-xs font-medium">Analytics Dashboard</p>
            <p className="text-gray-600 dark:text-gray-300 text-xs">Performance metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
import Link from 'next/link';

export default function NodeDashboardOverview() {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Node Dashboard</h2>
          <Link 
            href="/node-dashboard"
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Manage your smartphone compute node and track earnings</p>
      </div>
      <div className="p-6">
        {/* Status Overview */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: "Node Status", status: "Online", color: "green" },
            { label: "Today's Earnings", status: "₿0.24", color: "green" },
            { label: "Total Earnings", status: "₿12.47", color: "cyan" },
          ].map((item, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Service Settings" },
            { title: "Pricing" },
            { title: "Availability" },
            { title: "Withdrawals" },
          ].map((action, index) => (
            <button
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:border-cyan-300 dark:hover:border-cyan-600 transition-colors text-left"
            >
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 
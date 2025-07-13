import Navbar from "@/components/ui/Navbar";
import ServicesOverview from "@/components/dashboard/ServicesOverview";
import DevicesOverview from "@/components/dashboard/DevicesOverview";
import AnalyticsOverview from "@/components/dashboard/AnalyticsOverview";
import NodeDashboardOverview from "@/components/dashboard/NodeDashboardOverview";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Dashboard Overview
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Welcome to the Nodara Network. Monitor your services, devices, analytics, and node performance.
            </p>
          </div>

          {/* Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Services Overview */}
            <ServicesOverview />
            
            {/* Devices Overview */}
            <DevicesOverview />
            
            {/* Analytics Overview */}
            <AnalyticsOverview />
            
            {/* Node Dashboard Overview */}
            <NodeDashboardOverview />
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Services", value: "156", trend: "+12%" },
              { label: "Active Devices", value: "1,923", trend: "+8%" },
              { label: "Network Revenue", value: "₿2,847", trend: "+15%" },
              { label: "Avg Response", value: "12ms", trend: "-5%" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Welcome Message */}
          <div className="mt-8 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-lg p-6 border border-cyan-200 dark:border-cyan-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Getting Started with Nodara Network
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Explore the different sections to discover compute services, monitor device networks, analyze performance metrics, and manage your own compute node.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 text-xs px-3 py-1 rounded-full">Serverless Functions</span>
              <span className="bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 text-xs px-3 py-1 rounded-full">Smartphone Compute</span>
              <span className="bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 text-xs px-3 py-1 rounded-full">SOL Payments</span>
              <span className="bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 text-xs px-3 py-1 rounded-full">Global Network</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
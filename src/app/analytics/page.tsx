import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import TimePeriodSelector from "@/components/ui/TimePeriodSelector";
import MetricCard from "@/components/ui/MetricCard";
import ChartCard from "@/components/ui/ChartCard";
import { ChartIcon, MoneyIcon } from "@/components/ui/icons";


export const metadata: Metadata = {
  title: "Analytics - Nodara Network",
  description: "Comprehensive analytics and insights for the Nodara Network. Track performance metrics, usage patterns, and network statistics in real-time.",
  keywords: "analytics, network metrics, performance tracking, usage statistics, network insights",
};

export default function AnalyticsPage() {
  const metrics = [
    { label: "Total Compute Hours", value: "1,247", trend: "+12.5%" },
    { label: "Active Devices", value: "1,923", trend: "+8.2%" },
    { label: "Revenue Generated", value: "₿2,847", trend: "+15.3%" },
    { label: "Avg Response Time", value: "12ms", trend: "-5.1%" },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Network Analytics"
        description="Comprehensive insights and performance metrics for the Nodara Network"
      />

      <TimePeriodSelector />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            label={metric.label}
            value={metric.value}
            trend={metric.trend}
            isLoading={true}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard
          title="Compute Usage"
          description="Real-time compute power utilization"
          icon={<ChartIcon />}
          placeholderText="Usage Chart Coming Soon"
          placeholderSubtext="Interactive charts and analytics"
        />

        <ChartCard
          title="Revenue Trends"
          description="Network revenue and growth metrics"
          icon={<MoneyIcon />}
          placeholderText="Revenue Chart Coming Soon"
          placeholderSubtext="Financial analytics and trends"
        />
      </div>

      {/* Detailed Analytics */}
      <ChartCard
        title="Detailed Analytics"
        description="Comprehensive network performance data"
        placeholderText="Detailed Analytics Coming Soon"
        placeholderSubtext="Advanced performance metrics and insights"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Geographic Distribution", desc: "Device locations and regional performance" },
            { title: "Service Types", desc: "Most popular compute services and usage patterns" },
            { title: "Performance Metrics", desc: "Response times, uptime, and reliability stats" },
          ].map((section, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </ChartCard>
    </PageLayout>
  );
} 
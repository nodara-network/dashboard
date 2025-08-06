"use client";

import type { Metadata } from "next";
import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import TimePeriodSelector from "@/components/ui/TimePeriodSelector";
import MetricCard from "@/components/ui/MetricCard";
import ChartCard from "@/components/ui/ChartCard";
import { ChartIcon, MoneyIcon } from "@/components/ui/icons";
import { analyticsService } from "@/services/analytics";
import type { 
  NetworkMetrics, 
  NodeDistribution, 
  ServiceDistribution, 
  EarningsAnalytics,
  ErrorAnalytics,
  NetworkHealthScore,
  RealTimeAlert,
  AnalyticsTimeRange 
} from "@/types/analytics";

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<AnalyticsTimeRange>('24h');
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics | null>(null);
  const [nodeDistribution, setNodeDistribution] = useState<NodeDistribution[]>([]);
  const [serviceDistribution, setServiceDistribution] = useState<ServiceDistribution[]>([]);
  const [earningsAnalytics, setEarningsAnalytics] = useState<EarningsAnalytics | null>(null);
  const [errorAnalytics, setErrorAnalytics] = useState<ErrorAnalytics | null>(null);
  const [healthScore, setHealthScore] = useState<NetworkHealthScore | null>(null);
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [
          networkData,
          nodeDistData,
          serviceDistData,
          earningsData,
          errorData,
          healthData,
          alertsData
        ] = await Promise.all([
          analyticsService.getNetworkMetrics(),
          analyticsService.getNodeDistribution(),
          analyticsService.getServiceDistribution(),
          analyticsService.getEarningsAnalytics(selectedTimeRange),
          analyticsService.getErrorAnalytics(selectedTimeRange),
          analyticsService.getNetworkHealthScore(),
          analyticsService.getRealTimeAlerts()
        ]);

        setNetworkMetrics(networkData);
        setNodeDistribution(nodeDistData);
        setServiceDistribution(serviceDistData);
        setEarningsAnalytics(earningsData);
        setErrorAnalytics(errorData);
        setHealthScore(healthData);
        setAlerts(alertsData);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchAnalyticsData, 60000);
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const calculateTrend = (current: number, previous: number): string => {
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  return (
    <PageLayout>
      <PageHeader
        title="Network Analytics"
        description="Comprehensive insights and performance metrics for the Nodara Network"
      />

      {/* Time Period Selector */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['1h', '24h', '7d', '30d'] as AnalyticsTimeRange[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedTimeRange(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeRange === period
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              healthScore && healthScore.overall > 90 ? 'bg-green-500' : 
              healthScore && healthScore.overall > 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Network Health: {loading ? '...' : `${healthScore?.overall.toFixed(1)}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Total Nodes"
          value={loading ? "..." : formatNumber(networkMetrics?.totalNodes || 0)}
          trend={loading ? undefined : calculateTrend(networkMetrics?.totalNodes || 0, 2650)}
          isLoading={loading}
        />
        <MetricCard
          label="Active Nodes"
          value={loading ? "..." : formatNumber(networkMetrics?.activeNodes || 0)}
          trend={loading ? undefined : calculateTrend(networkMetrics?.activeNodes || 0, 2100)}
          isLoading={loading}
        />
        <MetricCard
          label="Total Volume"
          value={loading ? "..." : `$${formatNumber(networkMetrics?.totalVolume || 0)}`}
          trend={loading ? undefined : "+15.3%"}
          isLoading={loading}
        />
          <MetricCard
          label="Avg Response Time"
          value={loading ? "..." : `${networkMetrics?.averageResponseTime || 0}ms`}
          trend={loading ? undefined : "-5.1%"}
          isLoading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Earnings Analytics */}
        <ChartCard
          title="Earnings Analytics"
          description="Network earnings and revenue breakdown"
          icon={<MoneyIcon />}
        >
          {loading ? (
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${earningsAnalytics?.totalEarnings.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Earnings ({selectedTimeRange})
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +{earningsAnalytics?.trend.toFixed(1)}% vs previous period
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Revenue Breakdown</h4>
                {earningsAnalytics?.breakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{item.service}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ${item.earnings.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>

        {/* Error Analytics */}
        <ChartCard
          title="Error Analytics"
          description="Network errors and resolution metrics"
          icon={<ChartIcon />}
        >
          {loading ? (
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {errorAnalytics?.totalErrors}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {errorAnalytics?.errorRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Error Rate</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Error Types</h4>
                {errorAnalytics?.errorTypes.slice(0, 3).map((error, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{error.type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${error.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                        {error.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Resolution Time: <span className="font-medium">{Math.round((errorAnalytics?.resolutionTime || 0) / 60)}min</span>
                </div>
              </div>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard
          title="Geographic Distribution"
          description="Global distribution of network nodes"
        >
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {nodeDistribution.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{location.country}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {location.activeNodes}/{location.nodeCount} active
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {location.nodeCount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {((location.nodeCount / (networkMetrics?.totalNodes || 1)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Service Distribution"
          description="Distribution of compute services"
        >
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {serviceDistribution.map((service, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></div>
                      <span className="font-medium text-gray-900 dark:text-white">{service.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.count}
                      </div>
                      <div className="text-xs text-gray-500">
                        {service.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Earnings: ${formatNumber(service.totalEarnings)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      {/* Network Health & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <ChartCard
          title="Network Health Score"
          description="Overall network performance and reliability"
        >
          {loading ? (
            <div className="space-y-4">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${
                  (healthScore?.overall || 0) > 90 ? 'text-green-600 dark:text-green-400' :
                  (healthScore?.overall || 0) > 70 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {healthScore?.overall.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall Health Score</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Uptime</span>
                  <span className="text-sm font-medium">{healthScore?.uptime.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Performance</span>
                  <span className="text-sm font-medium">{healthScore?.performance.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Security</span>
                  <span className="text-sm font-medium">{healthScore?.security.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Reliability</span>
                  <span className="text-sm font-medium">{healthScore?.reliability.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Real-time Alerts"
          description="Active alerts and notifications"
        >
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-400 dark:bg-gray-400 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-400 dark:bg-gray-400 rounded w-3/4 animate-pulse"></div>
                  </div>
            </div>
          ))}
        </div>
          ) : (
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No active alerts
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className={`flex items-start space-x-3 p-3 rounded-lg border ${
                    alert.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                    alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === 'error' ? 'bg-red-500' :
                      alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {alert.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          alert.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
      </ChartCard>
      </div>
    </PageLayout>
  );
} 
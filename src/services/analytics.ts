// Analytics data fetching service for Nodara Network Dashboard
import { apiClient, apiUtils } from './api';
import {
  NetworkMetrics,
  NodeMetrics,
  ServiceMetrics,
  PerformanceMetrics,
  TimeSeriesData,
  ChartData,
  NodeDistribution,
  ServiceDistribution,
  EarningsAnalytics,
  ErrorAnalytics,
  UserActivityAnalytics,
  NetworkHealthScore,
  PredictiveAnalytics,
  RealTimeAlert,
  CustomDashboardData,
  AnalyticsTimeRange,
  ChartType,
  AnalyticsDataType,
  AnalyticsExportFormat
} from '../types/analytics';

// Mock data for development and testing
const MOCK_DATA = {
  networkMetrics: {
    totalNodes: 2847,
    activeNodes: 2234,
    totalServices: 8432,
    activeServices: 7891,
    totalTransactions: 156789,
    totalVolume: 2849573.42,
    averageResponseTime: 245,
    uptime: 99.7
  } as NetworkMetrics,

  nodeMetrics: [
    {
      nodeId: "node_001",
      status: "online" as const,
      uptime: 99.8,
      responseTime: 180,
      totalRequests: 15420,
      successfulRequests: 15298,
      failedRequests: 122,
      earnings: 847.32,
      lastActivity: new Date(Date.now() - 5 * 60 * 1000),
      location: {
        country: "United States",
        city: "San Francisco",
        coordinates: [-122.4194, 37.7749] as [number, number]
      },
      services: ["compute", "storage", "ai"]
    },
    {
      nodeId: "node_002",
      status: "online" as const,
      uptime: 98.5,
      responseTime: 230,
      totalRequests: 12890,
      successfulRequests: 12654,
      failedRequests: 236,
      earnings: 673.89,
      lastActivity: new Date(Date.now() - 2 * 60 * 1000),
      location: {
        country: "Germany",
        city: "Berlin",
        coordinates: [13.4050, 52.5200] as [number, number]
      },
      services: ["compute", "network"]
    },
    {
      nodeId: "node_003",
      status: "busy" as const,
      uptime: 97.2,
      responseTime: 320,
      totalRequests: 9876,
      successfulRequests: 9654,
      failedRequests: 222,
      earnings: 521.76,
      lastActivity: new Date(Date.now() - 30 * 1000),
      location: {
        country: "Japan",
        city: "Tokyo",
        coordinates: [139.6503, 35.6762] as [number, number]
      },
      services: ["storage", "ai"]
    }
  ] as NodeMetrics[],

  serviceMetrics: [
    {
      serviceId: "service_compute_001",
      name: "High-Performance Computing",
      type: "compute" as const,
      totalRequests: 45632,
      successfulRequests: 44891,
      failedRequests: 741,
      averageResponseTime: 189,
      totalEarnings: 12847.93,
      rating: 4.8,
      reviews: 1247,
      availability: 99.2
    },
    {
      serviceId: "service_storage_001",
      name: "Distributed Storage",
      type: "storage" as const,
      totalRequests: 38921,
      successfulRequests: 38456,
      failedRequests: 465,
      averageResponseTime: 145,
      totalEarnings: 9876.45,
      rating: 4.6,
      reviews: 892,
      availability: 98.8
    },
    {
      serviceId: "service_ai_001",
      name: "AI Model Inference",
      type: "ai" as const,
      totalRequests: 23456,
      successfulRequests: 23102,
      failedRequests: 354,
      averageResponseTime: 567,
      totalEarnings: 15693.21,
      rating: 4.9,
      reviews: 567,
      availability: 97.5
    }
  ] as ServiceMetrics[],

  performanceMetrics: {
    cpu: {
      usage: 67.8,
      temperature: 58.2,
      cores: 16
    },
    memory: {
      used: 24576,
      total: 32768,
      usage: 75.0
    },
    network: {
      bandwidth: 1000,
      latency: 12.5,
      packetsLost: 0.02
    },
    storage: {
      used: 512000,
      total: 1024000,
      usage: 50.0
    }
  } as PerformanceMetrics,

  timeSeriesData: [
    { timestamp: new Date(Date.now() - 60 * 60 * 1000), value: 234, label: "Requests" },
    { timestamp: new Date(Date.now() - 50 * 60 * 1000), value: 267, label: "Requests" },
    { timestamp: new Date(Date.now() - 40 * 60 * 1000), value: 189, label: "Requests" },
    { timestamp: new Date(Date.now() - 30 * 60 * 1000), value: 298, label: "Requests" },
    { timestamp: new Date(Date.now() - 20 * 60 * 1000), value: 324, label: "Requests" },
    { timestamp: new Date(Date.now() - 10 * 60 * 1000), value: 356, label: "Requests" }
  ] as TimeSeriesData[],

  nodeDistribution: [
    { country: "United States", nodeCount: 847, activeNodes: 823, coordinates: [-95.7129, 37.0902] as [number, number] },
    { country: "Germany", nodeCount: 432, activeNodes: 419, coordinates: [10.4515, 51.1657] as [number, number] },
    { country: "Japan", nodeCount: 298, activeNodes: 289, coordinates: [138.2529, 36.2048] as [number, number] },
    { country: "United Kingdom", nodeCount: 234, activeNodes: 227, coordinates: [-3.4360, 55.3781] as [number, number] },
    { country: "Singapore", nodeCount: 189, activeNodes: 184, coordinates: [103.8198, 1.3521] as [number, number] }
  ] as NodeDistribution[],

  serviceDistribution: [
    { type: "Compute", count: 2847, percentage: 42.5, totalEarnings: 145672.89 },
    { type: "Storage", count: 1923, percentage: 28.7, totalEarnings: 98432.15 },
    { type: "AI", count: 1234, percentage: 18.4, totalEarnings: 187594.33 },
    { type: "Network", count: 698, percentage: 10.4, totalEarnings: 67894.22 }
  ] as ServiceDistribution[],

  earningsAnalytics: {
    totalEarnings: 2843.67,
    averagePerHour: 23.45,
    averagePerDay: 562.87,
    trend: 12.4,
    breakdown: [
      { service: "AI Inference", earnings: 1247.89, percentage: 43.9 },
      { service: "Compute", earnings: 867.23, percentage: 30.5 },
      { service: "Storage", earnings: 498.34, percentage: 17.5 },
      { service: "Network", earnings: 230.21, percentage: 8.1 }
    ]
  } as EarningsAnalytics,

  errorAnalytics: {
    totalErrors: 1247,
    errorRate: 2.3,
    errorTypes: [
      { type: "Network Timeout", count: 456, percentage: 36.6 },
      { type: "Service Unavailable", count: 289, percentage: 23.2 },
      { type: "Authentication Failed", count: 234, percentage: 18.8 },
      { type: "Rate Limit Exceeded", count: 189, percentage: 15.2 },
      { type: "Internal Server Error", count: 79, percentage: 6.3 }
    ],
    affectedNodes: 67,
    resolutionTime: 847
  } as ErrorAnalytics,

  userActivityAnalytics: {
    activeUsers: 5847,
    newUsers: 234,
    userGrowth: 4.2,
    averageSessionDuration: 2847,
    topServices: [
      { service: "AI Model Training", requests: 15647, users: 1847 },
      { service: "Data Processing", requests: 12456, users: 1456 },
      { service: "File Storage", requests: 9876, users: 1234 }
    ]
  } as UserActivityAnalytics,

  networkHealthScore: {
    overall: 94.7,
    uptime: 99.2,
    performance: 91.8,
    security: 96.4,
    reliability: 92.3,
    factors: [
      { factor: "Node Availability", score: 99.2, impact: "positive" as const },
      { factor: "Response Time", score: 91.8, impact: "positive" as const },
      { factor: "Error Rate", score: 97.7, impact: "positive" as const },
      { factor: "Security Incidents", score: 96.4, impact: "positive" as const }
    ]
  } as NetworkHealthScore,

  predictiveAnalytics: {
    predictedLoad: 847.3,
    predictedEarnings: 3247.89,
    recommendedActions: [
      { action: "Scale compute capacity by 15%", priority: "medium" as const, impact: "Improved response times", estimatedCost: 1250 },
      { action: "Deploy additional storage nodes in EU", priority: "high" as const, impact: "Reduced latency for EU users", estimatedCost: 2500 }
    ],
    trends: [
      { metric: "Request Volume", trend: "up" as const, confidence: 87.3 },
      { metric: "Average Response Time", trend: "stable" as const, confidence: 92.1 }
    ]
  } as PredictiveAnalytics,

  realTimeAlerts: [
    {
      id: "alert_001",
      type: "warning" as const,
      severity: "medium" as const,
      message: "Node utilization above 85% in US-West region",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      affectedNodes: ["node_047", "node_089", "node_123"],
      resolved: false
    },
    {
      id: "alert_002",
      type: "error" as const,
      severity: "high" as const,
      message: "Storage service experiencing increased error rate",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      affectedNodes: ["node_156", "node_234"],
      resolved: true
    }
  ] as RealTimeAlert[]
};

const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_API_URL;

class AnalyticsService {
  // Get network overview metrics
  async getNetworkMetrics(): Promise<NetworkMetrics> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return MOCK_DATA.networkMetrics;
    }
    const response = await apiClient.get<NetworkMetrics>('/analytics/network/overview');
    return apiUtils.handleResponse(response);
  }

  // Get node performance metrics
  async getNodeMetrics(nodeId?: string): Promise<NodeMetrics[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 150));
      if (nodeId) {
        const node = MOCK_DATA.nodeMetrics.find(n => n.nodeId === nodeId);
        return node ? [node] : [];
      }
      return MOCK_DATA.nodeMetrics;
    }
    const endpoint = nodeId ? `/analytics/nodes/${nodeId}` : '/analytics/nodes';
    const response = await apiClient.get<NodeMetrics[]>(endpoint);
    return apiUtils.handleResponse(response);
  }

  // Get service performance metrics
  async getServiceMetrics(serviceId?: string): Promise<ServiceMetrics[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 180));
      if (serviceId) {
        const service = MOCK_DATA.serviceMetrics.find(s => s.serviceId === serviceId);
        return service ? [service] : [];
      }
      return MOCK_DATA.serviceMetrics;
    }
    const endpoint = serviceId ? `/analytics/services/${serviceId}` : '/analytics/services';
    const response = await apiClient.get<ServiceMetrics[]>(endpoint);
    return apiUtils.handleResponse(response);
  }

  // Get real-time performance metrics
  async getPerformanceMetrics(nodeId: string): Promise<PerformanceMetrics> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return MOCK_DATA.performanceMetrics;
    }
    const response = await apiClient.get<PerformanceMetrics>(`/analytics/nodes/${nodeId}/performance`);
    return apiUtils.handleResponse(response);
  }

  // Get time series data for charts
  async getTimeSeriesData(
    metric: string,
    timeRange: AnalyticsTimeRange,
    filters?: Record<string, any>
  ): Promise<TimeSeriesData[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 120));
      return MOCK_DATA.timeSeriesData;
    }
    const queryParams = apiUtils.createQueryString({ metric, timeRange, ...filters });
    const response = await apiClient.get<TimeSeriesData[]>(`/analytics/timeseries?${queryParams}`);
    return apiUtils.handleResponse(response);
  }

  // Get chart data for specific metrics
  async getChartData(
    chartType: ChartType,
    metrics: string[],
    timeRange: AnalyticsTimeRange,
    filters?: Record<string, any>
  ): Promise<ChartData> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 160));
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: metrics[0] || 'Default Metric',
          data: [234, 267, 189, 298, 324, 356],
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgba(59, 130, 246, 1)',
          fill: chartType === 'area'
        }]
      };
    }
    const response = await apiClient.post<ChartData>('/analytics/charts', {
      type: chartType,
      metrics,
      timeRange,
      filters
    });
    return apiUtils.handleResponse(response);
  }

  // Get geographic distribution of nodes
  async getNodeDistribution(): Promise<NodeDistribution[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 140));
      return MOCK_DATA.nodeDistribution;
    }
    const response = await apiClient.get<NodeDistribution[]>('/analytics/nodes/distribution');
    return apiUtils.handleResponse(response);
  }

  // Get service type distribution
  async getServiceDistribution(): Promise<ServiceDistribution[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 130));
      return MOCK_DATA.serviceDistribution;
    }
    const response = await apiClient.get<ServiceDistribution[]>('/analytics/services/distribution');
    return apiUtils.handleResponse(response);
  }

  // Get earnings analytics
  async getEarningsAnalytics(
    timeRange: AnalyticsTimeRange,
    nodeId?: string
  ): Promise<EarningsAnalytics> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 170));
      return MOCK_DATA.earningsAnalytics;
    }
    const queryParams = apiUtils.createQueryString({ timeRange, nodeId });
    const response = await apiClient.get<EarningsAnalytics>(`/analytics/earnings?${queryParams}`);
    return apiUtils.handleResponse(response);
  }

  // Get error analytics
  async getErrorAnalytics(
    timeRange: AnalyticsTimeRange
  ): Promise<ErrorAnalytics> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 150));
      return MOCK_DATA.errorAnalytics;
    }
    const queryParams = apiUtils.createQueryString({ timeRange });
    const response = await apiClient.get<ErrorAnalytics>(`/analytics/errors?${queryParams}`);
    return apiUtils.handleResponse(response);
  }

  // Get user activity analytics
  async getUserActivityAnalytics(
    timeRange: AnalyticsTimeRange
  ): Promise<UserActivityAnalytics> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 160));
      return MOCK_DATA.userActivityAnalytics;
    }
    const queryParams = apiUtils.createQueryString({ timeRange });
    const response = await apiClient.get<UserActivityAnalytics>(`/analytics/users?${queryParams}`);
    return apiUtils.handleResponse(response);
  }

  // Get network health score
  async getNetworkHealthScore(): Promise<NetworkHealthScore> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 110));
      return MOCK_DATA.networkHealthScore;
    }
    const response = await apiClient.get<NetworkHealthScore>('/analytics/health');
    return apiUtils.handleResponse(response);
  }

  // Get predictive analytics
  async getPredictiveAnalytics(): Promise<PredictiveAnalytics> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 190));
      return MOCK_DATA.predictiveAnalytics;
    }
    const response = await apiClient.get<PredictiveAnalytics>('/analytics/predictions');
    return apiUtils.handleResponse(response);
  }

  // Export analytics data
  async exportAnalyticsData(
    dataType: AnalyticsDataType,
    format: AnalyticsExportFormat,
    timeRange: AnalyticsTimeRange,
    filters?: Record<string, any>
  ): Promise<{ downloadUrl: string; expiresAt: Date }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 250));
      return {
        downloadUrl: `https://mock-export.nodara.network/export-${Date.now()}.${format}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };
    }
    const response = await apiClient.post<{ downloadUrl: string; expiresAt: Date }>(
      '/analytics/export',
      { dataType, format, timeRange, filters }
    );
    return apiUtils.handleResponse(response);
  }

  // Get real-time alerts
  async getRealTimeAlerts(): Promise<RealTimeAlert[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return MOCK_DATA.realTimeAlerts;
    }
    const response = await apiClient.get<RealTimeAlert[]>('/analytics/alerts');
    return apiUtils.handleResponse(response);
  }

  // Acknowledge alert
  async acknowledgeAlert(alertId: string): Promise<{ success: boolean }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 80));
      return { success: true };
    }
    const response = await apiClient.post<{ success: boolean }>(
      `/analytics/alerts/${alertId}/acknowledge`
    );
    return apiUtils.handleResponse(response);
  }

  // Get custom dashboard data
  async getCustomDashboardData(
    dashboardId: string
  ): Promise<CustomDashboardData> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 120));
      return {
        widgets: [
          {
            id: `widget_${dashboardId}_1`,
            type: 'metric',
            title: 'Total Earnings',
            data: { value: 2843.67, trend: 12.4 },
            config: { format: 'currency' }
          },
          {
            id: `widget_${dashboardId}_2`,
            type: 'chart',
            title: 'Node Performance',
            data: MOCK_DATA.timeSeriesData,
            config: { chartType: 'line' }
          }
        ]
      };
    }
    const response = await apiClient.get<CustomDashboardData>(`/analytics/dashboards/${dashboardId}`);
    return apiUtils.handleResponse(response);
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService(); 
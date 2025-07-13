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

class AnalyticsService {
  // Get network overview metrics
  async getNetworkMetrics(): Promise<NetworkMetrics> {
    const response = await apiClient.get<NetworkMetrics>('/analytics/network/overview');
    return apiUtils.handleResponse(response);
  }

  // Get node performance metrics
  async getNodeMetrics(nodeId?: string): Promise<NodeMetrics[]> {
    const endpoint = nodeId ? `/analytics/nodes/${nodeId}` : '/analytics/nodes';
    const response = await apiClient.get<NodeMetrics[]>(endpoint);
    return apiUtils.handleResponse(response);
  }

  // Get service performance metrics
  async getServiceMetrics(serviceId?: string): Promise<ServiceMetrics[]> {
    const endpoint = serviceId ? `/analytics/services/${serviceId}` : '/analytics/services';
    const response = await apiClient.get<ServiceMetrics[]>(endpoint);
    return apiUtils.handleResponse(response);
  }

  // Get real-time performance metrics
  async getPerformanceMetrics(nodeId: string): Promise<PerformanceMetrics> {
    const response = await apiClient.get<PerformanceMetrics>(`/analytics/nodes/${nodeId}/performance`);
    return apiUtils.handleResponse(response);
  }

  // Get time series data for charts
  async getTimeSeriesData(
    metric: string,
    timeRange: AnalyticsTimeRange,
    filters?: Record<string, any>
  ): Promise<TimeSeriesData[]> {
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
    const response = await apiClient.get<NodeDistribution[]>('/analytics/nodes/distribution');
    return apiUtils.handleResponse(response);
  }

  // Get service type distribution
  async getServiceDistribution(): Promise<ServiceDistribution[]> {
    const response = await apiClient.get<ServiceDistribution[]>('/analytics/services/distribution');
    return apiUtils.handleResponse(response);
  }

  // Get earnings analytics
  async getEarningsAnalytics(
    timeRange: AnalyticsTimeRange,
    nodeId?: string
  ): Promise<EarningsAnalytics> {
    const queryParams = apiUtils.createQueryString({ timeRange, nodeId });
    const response = await apiClient.get<EarningsAnalytics>(`/analytics/earnings?${queryParams}`);
    return apiUtils.handleResponse(response);
  }

  // Get error analytics
  async getErrorAnalytics(
    timeRange: AnalyticsTimeRange
  ): Promise<ErrorAnalytics> {
    const queryParams = apiUtils.createQueryString({ timeRange });
    const response = await apiClient.get<ErrorAnalytics>(`/analytics/errors?${queryParams}`);
    return apiUtils.handleResponse(response);
  }

  // Get user activity analytics
  async getUserActivityAnalytics(
    timeRange: AnalyticsTimeRange
  ): Promise<UserActivityAnalytics> {
    const queryParams = apiUtils.createQueryString({ timeRange });
    const response = await apiClient.get<UserActivityAnalytics>(`/analytics/users?${queryParams}`);
    return apiUtils.handleResponse(response);
  }

  // Get network health score
  async getNetworkHealthScore(): Promise<NetworkHealthScore> {
    const response = await apiClient.get<NetworkHealthScore>('/analytics/health');
    return apiUtils.handleResponse(response);
  }

  // Get predictive analytics
  async getPredictiveAnalytics(): Promise<PredictiveAnalytics> {
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
    const response = await apiClient.post<{ downloadUrl: string; expiresAt: Date }>(
      '/analytics/export',
      { dataType, format, timeRange, filters }
    );
    return apiUtils.handleResponse(response);
  }

  // Get real-time alerts
  async getRealTimeAlerts(): Promise<RealTimeAlert[]> {
    const response = await apiClient.get<RealTimeAlert[]>('/analytics/alerts');
    return apiUtils.handleResponse(response);
  }

  // Acknowledge alert
  async acknowledgeAlert(alertId: string): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(
      `/analytics/alerts/${alertId}/acknowledge`
    );
    return apiUtils.handleResponse(response);
  }

  // Get custom dashboard data
  async getCustomDashboardData(
    dashboardId: string
  ): Promise<CustomDashboardData> {
    const response = await apiClient.get<CustomDashboardData>(`/analytics/dashboards/${dashboardId}`);
    return apiUtils.handleResponse(response);
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService(); 
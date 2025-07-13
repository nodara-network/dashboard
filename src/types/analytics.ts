// Analytics Types for Nodara Network Dashboard

export interface NetworkMetrics {
  totalNodes: number;
  activeNodes: number;
  totalServices: number;
  activeServices: number;
  totalTransactions: number;
  totalVolume: number;
  averageResponseTime: number;
  uptime: number;
}

export interface NodeMetrics {
  nodeId: string;
  status: 'online' | 'offline' | 'busy' | 'maintenance';
  uptime: number;
  responseTime: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  earnings: number;
  lastActivity: Date;
  location: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
  services: string[];
}

export interface ServiceMetrics {
  serviceId: string;
  name: string;
  type: 'compute' | 'storage' | 'network' | 'ai';
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  totalEarnings: number;
  rating: number;
  reviews: number;
  availability: number;
}

export interface PerformanceMetrics {
  cpu: {
    usage: number;
    temperature: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    usage: number;
  };
  network: {
    bandwidth: number;
    latency: number;
    packetsLost: number;
  };
  storage: {
    used: number;
    total: number;
    usage: number;
  };
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  label: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface NodeDistribution {
  country: string;
  nodeCount: number;
  activeNodes: number;
  coordinates: [number, number];
}

export interface ServiceDistribution {
  type: string;
  count: number;
  percentage: number;
  totalEarnings: number;
}

export interface EarningsBreakdown {
  service: string;
  earnings: number;
  percentage: number;
}

export interface EarningsAnalytics {
  totalEarnings: number;
  averagePerHour: number;
  averagePerDay: number;
  trend: number;
  breakdown: EarningsBreakdown[];
}

export interface ErrorType {
  type: string;
  count: number;
  percentage: number;
}

export interface ErrorAnalytics {
  totalErrors: number;
  errorRate: number;
  errorTypes: ErrorType[];
  affectedNodes: number;
  resolutionTime: number;
}

export interface TopService {
  service: string;
  requests: number;
  users: number;
}

export interface UserActivityAnalytics {
  activeUsers: number;
  newUsers: number;
  userGrowth: number;
  averageSessionDuration: number;
  topServices: TopService[];
}

export interface HealthFactor {
  factor: string;
  score: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface NetworkHealthScore {
  overall: number;
  uptime: number;
  performance: number;
  security: number;
  reliability: number;
  factors: HealthFactor[];
}

export interface RecommendedAction {
  action: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
  estimatedCost: number;
}

export interface Trend {
  metric: string;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

export interface PredictiveAnalytics {
  predictedLoad: number;
  predictedEarnings: number;
  recommendedActions: RecommendedAction[];
  trends: Trend[];
}

export interface ExportData {
  downloadUrl: string;
  expiresAt: Date;
}

export interface RealTimeAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: Date;
  affectedNodes?: string[];
  resolved: boolean;
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  data: any;
  config: any;
}

export interface CustomDashboardData {
  widgets: DashboardWidget[];
}

// Time range types
export type AnalyticsTimeRange = '1h' | '24h' | '7d' | '30d' | '90d';

// Chart types
export type ChartType = 'line' | 'bar' | 'pie' | 'area';

// Data export types
export type AnalyticsDataType = 'network' | 'nodes' | 'services' | 'earnings' | 'errors';
export type AnalyticsExportFormat = 'csv' | 'json' | 'pdf'; 
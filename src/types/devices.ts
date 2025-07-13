// Device Types for Nodara Network Dashboard

export interface DeviceLocation {
  country: string;
  city: string;
  coordinates: [number, number];
  timezone?: string;
}

export interface DeviceSpecifications {
  cpu: {
    cores: number;
    model: string;
    speed: number;
  };
  memory: {
    total: number;
    available?: number;
    type: string;
  };
  storage: {
    total: number;
    available?: number;
    type: string;
  };
  network: {
    bandwidth: number;
    latency?: number;
    connectionType: string;
  };
}

export interface DeviceEarnings {
  total: number;
  thisMonth: number;
  thisWeek: number;
  today: number;
}

export interface DevicePerformance {
  uptime: number;
  responseTime: number;
  successRate: number;
  totalRequests: number;
}

export interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'server' | 'edge';
  status: 'online' | 'offline' | 'busy' | 'maintenance';
  location: DeviceLocation;
  specifications: DeviceSpecifications;
  services: string[];
  earnings: DeviceEarnings;
  performance: DevicePerformance;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceRegistration {
  name: string;
  type: 'mobile' | 'desktop' | 'server' | 'edge';
  location: DeviceLocation;
  specifications: DeviceSpecifications;
  services: string[];
}

export interface DeviceUpdate {
  name?: string;
  status?: Device['status'];
  location?: DeviceLocation;
  services?: string[];
}

export interface DeviceFilter {
  status?: Device['status'];
  type?: Device['type'];
  country?: string;
  city?: string;
  services?: string[];
  minEarnings?: number;
  maxEarnings?: number;
  minUptime?: number;
  maxUptime?: number;
}

export interface TopPerformingDevice {
  id: string;
  name: string;
  earnings: number;
  uptime: number;
}

export interface DeviceStats {
  totalDevices: number;
  onlineDevices: number;
  totalEarnings: number;
  averageUptime: number;
  averageResponseTime: number;
  topPerformingDevices: TopPerformingDevice[];
}

export interface DeviceServiceInfo {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  requests: number;
  earnings: number;
  rating: number;
}

export interface DeviceLog {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  service?: string;
}

export interface DeviceAlert {
  id: string;
  type: 'performance' | 'security' | 'maintenance' | 'error';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface DeviceMaintenance {
  id: string;
  type: 'routine' | 'emergency' | 'upgrade';
  description: string;
  scheduledAt: Date;
  estimatedDuration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface DeviceBackupStatus {
  lastBackup: Date;
  backupSize: number;
  backupStatus: 'success' | 'failed' | 'in-progress';
  nextScheduledBackup: Date;
  retentionDays: number;
}

export interface DeviceVulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  cve?: string;
  patchAvailable: boolean;
}

export interface DeviceSecurityStatus {
  securityScore: number;
  vulnerabilities: DeviceVulnerability[];
  lastSecurityScan: Date;
  nextSecurityScan: Date;
  firewallStatus: 'enabled' | 'disabled' | 'error';
  antivirusStatus: 'enabled' | 'disabled' | 'error';
}

export interface FirewallRule {
  id: string;
  name: string;
  action: 'allow' | 'deny';
  protocol: string;
  port: number;
  source: string;
  destination: string;
}

export interface DeviceNetworkInfo {
  ipAddress: string;
  macAddress: string;
  connectionType: string;
  bandwidth: number;
  latency: number;
  packetLoss: number;
  firewallRules: FirewallRule[];
}

export interface DevicePerformanceMetrics {
  uptime: number;
  responseTime: number;
  successRate: number;
  totalRequests: number;
  earnings: number;
  errors: number;
  timeSeries: {
    timestamp: Date;
    value: number;
    metric: string;
  }[];
}

export interface DeviceMaintenanceSchedule {
  type: 'routine' | 'emergency' | 'upgrade';
  description: string;
  scheduledAt: Date;
  estimatedDuration: number;
}

export interface DeviceExportData {
  downloadUrl: string;
  expiresAt: Date;
}

// Device type aliases
export type DeviceType = 'mobile' | 'desktop' | 'server' | 'edge';
export type DeviceStatus = 'online' | 'offline' | 'busy' | 'maintenance';
export type ServiceStatus = 'active' | 'inactive' | 'error';
export type LogLevel = 'info' | 'warning' | 'error';
export type AlertType = 'performance' | 'security' | 'maintenance' | 'error';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type MaintenanceType = 'routine' | 'emergency' | 'upgrade';
export type MaintenanceStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
export type BackupStatus = 'success' | 'failed' | 'in-progress';
export type SecurityStatus = 'enabled' | 'disabled' | 'error';
export type VulnerabilitySeverity = 'critical' | 'high' | 'medium' | 'low';
export type FirewallAction = 'allow' | 'deny';
export type DeviceExportFormat = 'csv' | 'json' | 'pdf';
export type DeviceExportDataType = 'performance' | 'logs' | 'alerts' | 'all';
export type DeviceTimeRange = '1h' | '24h' | '7d' | '30d'; 
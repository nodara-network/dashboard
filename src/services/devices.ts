// Device/node data management service for Nodara Network Dashboard
import { apiClient, apiUtils } from './api';
import {
  Device,
  DeviceRegistration,
  DeviceUpdate,
  DeviceFilter,
  DeviceStats,
  DeviceServiceInfo,
  DeviceLog,
  DeviceAlert,
  DeviceMaintenance,
  DeviceBackupStatus,
  DeviceSecurityStatus,
  DeviceNetworkInfo,
  DevicePerformanceMetrics,
  DeviceMaintenanceSchedule,
  DeviceExportData,
  LogLevel,
  DeviceExportFormat,
  DeviceExportDataType,
  DeviceTimeRange
} from '../types/devices';

// WebSocket connected device interface
interface WebSocketDevice {
  publicKey: string;
  connectionId: string;
  isConnected: boolean;
  lastHeartbeat: Date;
  connectionTime: Date;
  specs?: {
    os: string;
    browser?: string;
    deviceType: 'mobile' | 'desktop' | 'server' | 'edge';
  };
  location?: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
}

// Enhanced device interface for WebSocket integration
interface EnhancedDevice extends Device {
  isWebSocketConnected?: boolean;
  webSocketConnectionId?: string;
  lastWebSocketActivity?: Date;
}

// Mock WebSocket connected devices
const MOCK_WS_DEVICES: WebSocketDevice[] = [
  {
    publicKey: "7xK9mP2nQ7vR4tU1wX5yZ3aB6cD9eF2gH4iJ7kL1mN",
    connectionId: "conn_001",
    isConnected: true,
    lastHeartbeat: new Date(Date.now() - 30 * 1000),
    connectionTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    specs: {
      os: "Windows 11",
      browser: "Chrome 120",
      deviceType: "desktop"
    },
    location: {
      country: "United States",
      city: "San Francisco",
      coordinates: [-122.4194, 37.7749]
    }
  },
  {
    publicKey: "8yL0nQ3oR8wS5vV2xY6zA4bC7dE0fG3hI8jK2lM0nO",
    connectionId: "conn_002",
    isConnected: true,
    lastHeartbeat: new Date(Date.now() - 15 * 1000),
    connectionTime: new Date(Date.now() - 45 * 60 * 1000),
    specs: {
      os: "macOS 14",
      browser: "Safari 17",
      deviceType: "desktop"
    },
    location: {
      country: "Canada",
      city: "Toronto",
      coordinates: [-79.3832, 43.6532]
    }
  },
  {
    publicKey: "9zM1oP4pS9xT6wW3yZ7aB5cD8eF1gH4iJ7kL2mN1oP",
    connectionId: "conn_003",
    isConnected: true,
    lastHeartbeat: new Date(Date.now() - 45 * 1000),
    connectionTime: new Date(Date.now() - 20 * 60 * 1000),
    specs: {
      os: "Android 14",
      deviceType: "mobile"
    },
    location: {
      country: "Germany",
      city: "Berlin",
      coordinates: [13.4050, 52.5200]
    }
  }
];

// Mock device data
const MOCK_DEVICES: Device[] = [
  {
    id: "device_001",
    name: "Node SF-001",
    type: "desktop",
    status: "online",
    location: {
      country: "United States",
      city: "San Francisco",
      coordinates: [-122.4194, 37.7749],
      timezone: "America/Los_Angeles"
    },
    specifications: {
      cpu: {
        cores: 16,
        model: "Intel Core i9-13900K",
        speed: 3.0
      },
      memory: {
        total: 32768,
        available: 8192,
        type: "DDR5"
      },
      storage: {
        total: 2048000,
        available: 1024000,
        type: "NVMe SSD"
      },
      network: {
        bandwidth: 1000,
        latency: 12,
        connectionType: "Ethernet"
      }
    },
    services: ["compute", "storage", "ai"],
    earnings: {
      total: 2847.93,
      thisMonth: 534.21,
      thisWeek: 123.45,
      today: 18.67
    },
    performance: {
      uptime: 99.8,
      responseTime: 145,
      successRate: 99.2,
      totalRequests: 15420
    },
    lastActivity: new Date(Date.now() - 5 * 60 * 1000),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: "device_002",
    name: "Node BER-002",
    type: "desktop",
    status: "online",
    location: {
      country: "Germany",
      city: "Berlin",
      coordinates: [13.4050, 52.5200],
      timezone: "Europe/Berlin"
    },
    specifications: {
      cpu: {
        cores: 12,
        model: "AMD Ryzen 9 7900X",
        speed: 4.7
      },
      memory: {
        total: 16384,
        available: 4096,
        type: "DDR5"
      },
      storage: {
        total: 1024000,
        available: 512000,
        type: "SATA SSD"
      },
      network: {
        bandwidth: 500,
        latency: 8,
        connectionType: "Fiber"
      }
    },
    services: ["compute", "network"],
    earnings: {
      total: 1923.47,
      thisMonth: 387.92,
      thisWeek: 89.13,
      today: 12.34
    },
    performance: {
      uptime: 98.5,
      responseTime: 167,
      successRate: 98.8,
      totalRequests: 12890
    },
    lastActivity: new Date(Date.now() - 2 * 60 * 1000),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    id: "device_003",
    name: "Node TOK-003",
    type: "server",
    status: "busy",
    location: {
      country: "Japan",
      city: "Tokyo",
      coordinates: [139.6503, 35.6762],
      timezone: "Asia/Tokyo"
    },
    specifications: {
      cpu: {
        cores: 32,
        model: "Intel Xeon Gold 6348",
        speed: 2.6
      },
      memory: {
        total: 65536,
        available: 16384,
        type: "DDR4"
      },
      storage: {
        total: 4096000,
        available: 2048000,
        type: "NVMe SSD"
      },
      network: {
        bandwidth: 10000,
        latency: 3,
        connectionType: "10G Ethernet"
      }
    },
    services: ["storage", "ai", "compute"],
    earnings: {
      total: 4521.89,
      thisMonth: 892.34,
      thisWeek: 201.56,
      today: 28.91
    },
    performance: {
      uptime: 97.2,
      responseTime: 89,
      successRate: 99.7,
      totalRequests: 23456
    },
    lastActivity: new Date(Date.now() - 30 * 1000),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 1000)
  }
];

const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_API_URL;

class DeviceService {
  // Get WebSocket connected devices
  async getWebSocketDevices(): Promise<WebSocketDevice[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return MOCK_WS_DEVICES.map(device => ({
        ...device,
        lastHeartbeat: new Date(Date.now() - Math.random() * 60 * 1000)
      }));
    }
    const response = await apiClient.get<WebSocketDevice[]>('/devices/websocket');
    return apiUtils.handleResponse(response);
  }

  // Get enhanced devices with WebSocket status
  async getEnhancedDevices(filters?: DeviceFilter): Promise<EnhancedDevice[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const wsDevices = await this.getWebSocketDevices();
      const devices = MOCK_DEVICES.map(device => {
        const wsDevice = wsDevices.find(ws => 
          ws.publicKey === device.id || 
          ws.location?.coordinates.toString() === device.location.coordinates.toString()
        );
        
        return {
          ...device,
          isWebSocketConnected: !!wsDevice?.isConnected,
          webSocketConnectionId: wsDevice?.connectionId,
          lastWebSocketActivity: wsDevice?.lastHeartbeat
        } as EnhancedDevice;
      });
      
      if (filters) {
        return devices.filter(device => {
          if (filters.status && device.status !== filters.status) return false;
          if (filters.type && device.type !== filters.type) return false;
          if (filters.country && device.location.country !== filters.country) return false;
          if (filters.city && device.location.city !== filters.city) return false;
          if (filters.services && !filters.services.every(service => device.services.includes(service))) return false;
          if (filters.minEarnings && device.earnings.total < filters.minEarnings) return false;
          if (filters.maxEarnings && device.earnings.total > filters.maxEarnings) return false;
          if (filters.minUptime && device.performance.uptime < filters.minUptime) return false;
          if (filters.maxUptime && device.performance.uptime > filters.maxUptime) return false;
          return true;
        });
      }
      
      return devices;
    }
    
    const [devices, wsDevices] = await Promise.all([
      this.getDevices(filters),
      this.getWebSocketDevices()
    ]);
    
    return devices.map(device => {
      const wsDevice = wsDevices.find(ws => ws.publicKey === device.id);
      return {
        ...device,
        isWebSocketConnected: !!wsDevice?.isConnected,
        webSocketConnectionId: wsDevice?.connectionId,
        lastWebSocketActivity: wsDevice?.lastHeartbeat
      } as EnhancedDevice;
    });
  }

  // Get all devices with optional filtering
  async getDevices(filters?: DeviceFilter): Promise<Device[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 120));
      let devices = [...MOCK_DEVICES];
      
      if (filters) {
        devices = devices.filter(device => {
          if (filters.status && device.status !== filters.status) return false;
          if (filters.type && device.type !== filters.type) return false;
          if (filters.country && device.location.country !== filters.country) return false;
          if (filters.city && device.location.city !== filters.city) return false;
          if (filters.services && !filters.services.every(service => device.services.includes(service))) return false;
          if (filters.minEarnings && device.earnings.total < filters.minEarnings) return false;
          if (filters.maxEarnings && device.earnings.total > filters.maxEarnings) return false;
          if (filters.minUptime && device.performance.uptime < filters.minUptime) return false;
          if (filters.maxUptime && device.performance.uptime > filters.maxUptime) return false;
          return true;
        });
      }
      
      return devices;
    }
    const queryParams = filters ? apiUtils.createQueryString(filters) : '';
    const response = await apiClient.get<Device[]>(`/devices${queryParams ? `?${queryParams}` : ''}`);
    return apiUtils.handleResponse(response);
  }

  // Get a specific device by ID
  async getDevice(deviceId: string): Promise<Device> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 80));
      const device = MOCK_DEVICES.find(d => d.id === deviceId);
      if (!device) {
        throw new Error(`Device ${deviceId} not found`);
      }
      return device;
    }
    const response = await apiClient.get<Device>(`/devices/${deviceId}`);
    return apiUtils.handleResponse(response);
  }

  // Register a new device
  async registerDevice(registration: DeviceRegistration): Promise<{ deviceId: string; success: boolean }> {
    const response = await apiClient.post<{ deviceId: string; success: boolean }>('/devices/register', registration);
    return apiUtils.handleResponse(response);
  }

  // Update device information
  async updateDevice(deviceId: string, updates: DeviceUpdate): Promise<{ success: boolean }> {
    const response = await apiClient.patch<{ success: boolean }>(`/devices/${deviceId}`, updates);
    return apiUtils.handleResponse(response);
  }

  // Delete a device
  async deleteDevice(deviceId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(`/devices/${deviceId}`);
    return apiUtils.handleResponse(response);
  }

  // Get device statistics
  async getDeviceStats(): Promise<DeviceStats> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const devices = await this.getDevices();
      const wsDevices = await this.getWebSocketDevices();
      
      return {
        totalDevices: devices.length,
        onlineDevices: devices.filter(d => d.status === 'online').length + wsDevices.filter(ws => ws.isConnected).length,
        totalEarnings: devices.reduce((sum, d) => sum + d.earnings.total, 0),
        averageUptime: devices.reduce((sum, d) => sum + d.performance.uptime, 0) / devices.length,
        averageResponseTime: devices.reduce((sum, d) => sum + d.performance.responseTime, 0) / devices.length,
        topPerformingDevices: devices
          .sort((a, b) => b.earnings.total - a.earnings.total)
          .slice(0, 5)
          .map(d => ({
            id: d.id,
            name: d.name,
            earnings: d.earnings.total,
            uptime: d.performance.uptime
          }))
      };
    }
    const response = await apiClient.get<DeviceStats>('/devices/stats');
    return apiUtils.handleResponse(response);
  }

  // Get device performance metrics
  async getDevicePerformance(deviceId: string, timeRange: DeviceTimeRange): Promise<DevicePerformanceMetrics> {
    const queryParams = apiUtils.createQueryString({ timeRange });
    const response = await apiClient.get<DevicePerformanceMetrics>(`/devices/${deviceId}/performance?${queryParams}`);
    return apiUtils.handleResponse(response);
  }

  // Get device services
  async getDeviceServices(deviceId: string): Promise<DeviceServiceInfo[]> {
    const response = await apiClient.get<DeviceServiceInfo[]>(`/devices/${deviceId}/services`);
    return apiUtils.handleResponse(response);
  }

  // Enable/disable a service on a device
  async toggleDeviceService(
    deviceId: string,
    serviceId: string,
    enabled: boolean
  ): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(`/devices/${deviceId}/services/${serviceId}/toggle`, {
      enabled
    });
    return apiUtils.handleResponse(response);
  }

  // Get device logs
  async getDeviceLogs(
    deviceId: string,
    level: LogLevel = 'info',
    limit: number = 100
  ): Promise<DeviceLog[]> {
    const queryParams = apiUtils.createQueryString({ level, limit });
    const response = await apiClient.get<DeviceLog[]>(`/devices/${deviceId}/logs?${queryParams}`);
    return apiUtils.handleResponse(response);
  }

  // Get device alerts
  async getDeviceAlerts(deviceId: string): Promise<DeviceAlert[]> {
    const response = await apiClient.get<DeviceAlert[]>(`/devices/${deviceId}/alerts`);
    return apiUtils.handleResponse(response);
  }

  // Resolve device alert
  async resolveDeviceAlert(deviceId: string, alertId: string): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(`/devices/${deviceId}/alerts/${alertId}/resolve`);
    return apiUtils.handleResponse(response);
  }

  // Get device maintenance schedule
  async getDeviceMaintenance(deviceId: string): Promise<DeviceMaintenance[]> {
    const response = await apiClient.get<DeviceMaintenance[]>(`/devices/${deviceId}/maintenance`);
    return apiUtils.handleResponse(response);
  }

  // Schedule device maintenance
  async scheduleDeviceMaintenance(
    deviceId: string,
    maintenance: DeviceMaintenanceSchedule
  ): Promise<{ maintenanceId: string; success: boolean }> {
    const response = await apiClient.post<{ maintenanceId: string; success: boolean }>(
      `/devices/${deviceId}/maintenance`,
      maintenance
    );
    return apiUtils.handleResponse(response);
  }

  // Get device backup status
  async getDeviceBackupStatus(deviceId: string): Promise<DeviceBackupStatus> {
    const response = await apiClient.get<DeviceBackupStatus>(`/devices/${deviceId}/backup`);
    return apiUtils.handleResponse(response);
  }

  // Initiate device backup
  async initiateDeviceBackup(deviceId: string): Promise<{ backupId: string; success: boolean }> {
    const response = await apiClient.post<{ backupId: string; success: boolean }>(`/devices/${deviceId}/backup`);
    return apiUtils.handleResponse(response);
  }

  // Get device security status
  async getDeviceSecurityStatus(deviceId: string): Promise<DeviceSecurityStatus> {
    const response = await apiClient.get<DeviceSecurityStatus>(`/devices/${deviceId}/security`);
    return apiUtils.handleResponse(response);
  }

  // Run security scan on device
  async runSecurityScan(deviceId: string): Promise<{ scanId: string; success: boolean }> {
    const response = await apiClient.post<{ scanId: string; success: boolean }>(`/devices/${deviceId}/security/scan`);
    return apiUtils.handleResponse(response);
  }

  // Get device network information
  async getDeviceNetworkInfo(deviceId: string): Promise<DeviceNetworkInfo> {
    const response = await apiClient.get<DeviceNetworkInfo>(`/devices/${deviceId}/network`);
    return apiUtils.handleResponse(response);
  }

  // Export device data
  async exportDeviceData(
    deviceId: string,
    format: DeviceExportFormat,
    dataType: DeviceExportDataType
  ): Promise<DeviceExportData> {
    const response = await apiClient.post<DeviceExportData>(
      `/devices/${deviceId}/export`,
      { format, dataType }
    );
    return apiUtils.handleResponse(response);
  }
}

// Create singleton instance
export const deviceService = new DeviceService();

// Export additional interfaces for external use
export type { WebSocketDevice, EnhancedDevice }; 
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

class DeviceService {
  // Get all devices with optional filtering
  async getDevices(filters?: DeviceFilter): Promise<Device[]> {
    const queryParams = filters ? apiUtils.createQueryString(filters) : '';
    const response = await apiClient.get<Device[]>(`/devices${queryParams ? `?${queryParams}` : ''}`);
    return apiUtils.handleResponse(response);
  }

  // Get a specific device by ID
  async getDevice(deviceId: string): Promise<Device> {
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
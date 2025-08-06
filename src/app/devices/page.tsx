"use client";

import type { Metadata } from "next";
import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import ChartCard from "@/components/ui/ChartCard";
import { LocationIcon } from "@/components/ui/icons";
import { deviceService } from "@/services/devices";
import type { Device } from "@/types/devices";

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

interface EnhancedDevice extends Device {
  isWebSocketConnected?: boolean;
  webSocketConnectionId?: string;
  lastWebSocketActivity?: Date;
}

interface DeviceStats {
  totalDevices: number;
  onlineDevices: number;
  totalEarnings: number;
  averageUptime: number;
  averageResponseTime: number;
  topPerformingDevices: any[];
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<EnhancedDevice[]>([]);
  const [wsDevices, setWsDevices] = useState<WebSocketDevice[]>([]);
  const [stats, setStats] = useState<DeviceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enhancedDevices, webSocketDevices, deviceStats] = await Promise.all([
          deviceService.getEnhancedDevices(),
          deviceService.getWebSocketDevices(),
          deviceService.getDeviceStats()
        ]);
        
        setDevices(enhancedDevices);
        setWsDevices(webSocketDevices);
        setStats(deviceStats);
      } catch (error) {
        console.error('Failed to fetch device data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const wsConnectedCount = wsDevices.filter(ws => ws.isConnected).length;
  const devicesWithWsConnection = devices.filter(d => d.isWebSocketConnected).length;

  return (
    <PageLayout>
      <PageHeader
        title="Global Device Network"
        description="Explore the worldwide network of devices and their real-time WebSocket connectivity"
      />

      {/* Map Placeholder */}
      <ChartCard
        title="Interactive Map"
        description="Real-time visualization of all connected devices"
        icon={<LocationIcon />}
        placeholderText="Interactive Map Coming Soon"
        placeholderSubtext="Real-time device locations and status"
        className="mb-8"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Total Devices"
          value={loading ? "..." : stats?.totalDevices.toString() || "0"}
          isLoading={loading}
        />
        <MetricCard
          label="Online Now"
          value={loading ? "..." : stats?.onlineDevices.toString() || "0"}
          isLoading={loading}
        />
        <MetricCard
          label="WebSocket Connected"
          value={loading ? "..." : wsConnectedCount.toString()}
          isLoading={loading}
          trend={wsConnectedCount > 0 ? "up" : "neutral"}
        />
        <MetricCard
          label="Avg Response"
          value={loading ? "..." : `${Math.round(stats?.averageResponseTime || 0)}ms`}
          isLoading={loading}
        />
      </div>

      {/* Device Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registered Devices */}
        <ChartCard
          title="Registered Devices"
          description={`${devices.length} devices in network (${devicesWithWsConnection} with WebSocket)`}
        >
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <DeviceListItem key={index} isLoading={true} />
              ))
            ) : devices.length > 0 ? (
              devices.map((device) => (
                <DeviceListItem
                  key={device.id}
                  device={device}
                  isLoading={false}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No registered devices found
              </div>
            )}
          </div>
        </ChartCard>

        {/* WebSocket Connected Devices */}
        <ChartCard
          title="WebSocket Connections"
          description={`${wsConnectedCount} live WebSocket connections`}
        >
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <WebSocketDeviceItem key={index} isLoading={true} />
              ))
            ) : wsDevices.length > 0 ? (
              wsDevices.map((wsDevice) => (
                <WebSocketDeviceItem
                  key={wsDevice.connectionId}
                  wsDevice={wsDevice}
                  isLoading={false}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No WebSocket connections
              </div>
            )}
          </div>
        </ChartCard>
      </div>
    </PageLayout>
  );
}

// Enhanced DeviceListItem component
function DeviceListItem({ 
  device, 
  isLoading = false 
}: { 
  device?: EnhancedDevice; 
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!device) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
          device.type === 'desktop' ? 'bg-blue-500' :
          device.type === 'mobile' ? 'bg-green-500' :
          device.type === 'server' ? 'bg-purple-500' : 'bg-gray-500'
        }`}>
          {device.type === 'desktop' ? '💻' : device.type === 'mobile' ? '📱' : device.type === 'server' ? '🖥️' : '📟'}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-900 dark:text-white font-medium">{device.name}</p>
            {device.isWebSocketConnected && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 dark:text-green-400">WS</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {device.location.city}, {device.location.country}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          device.status === 'online' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : device.status === 'busy'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {device.status}
        </span>
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {device.performance.responseTime}ms
        </span>
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {device.performance.uptime.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

// WebSocket device item component
function WebSocketDeviceItem({ 
  wsDevice, 
  isLoading = false 
}: { 
  wsDevice?: WebSocketDevice; 
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!wsDevice) return null;

  const timeSinceHeartbeat = Date.now() - new Date(wsDevice.lastHeartbeat).getTime();
  const isRecentlyActive = timeSinceHeartbeat < 60000; // 1 minute

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
          wsDevice.specs?.deviceType === 'desktop' ? 'bg-blue-500' :
          wsDevice.specs?.deviceType === 'mobile' ? 'bg-green-500' :
          wsDevice.specs?.deviceType === 'server' ? 'bg-purple-500' : 'bg-gray-500'
        }`}>
          {wsDevice.specs?.deviceType === 'desktop' ? '💻' : 
           wsDevice.specs?.deviceType === 'mobile' ? '📱' : 
           wsDevice.specs?.deviceType === 'server' ? '🖥️' : '📟'}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-900 dark:text-white font-medium">
              {wsDevice.publicKey.slice(0, 8)}...{wsDevice.publicKey.slice(-4)}
            </p>
            <div className={`w-2 h-2 rounded-full ${
              wsDevice.isConnected && isRecentlyActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {wsDevice.location ? `${wsDevice.location.city}, ${wsDevice.location.country}` : 'Unknown location'}
          </p>
          {wsDevice.specs && (
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {wsDevice.specs.os} {wsDevice.specs.browser && `• ${wsDevice.specs.browser}`}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          wsDevice.isConnected && isRecentlyActive
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }`}>
          {wsDevice.isConnected ? 'Connected' : 'Disconnected'}
        </span>
        <span className="text-gray-600 dark:text-gray-300 text-xs">
          {Math.round(timeSinceHeartbeat / 1000)}s ago
        </span>
      </div>
    </div>
  );
} 
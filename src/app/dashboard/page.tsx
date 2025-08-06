"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Navbar from "@/components/ui/Navbar";
import ServicesOverview from "@/components/dashboard/ServicesOverview";
import DevicesOverview from "@/components/dashboard/DevicesOverview";
import AnalyticsOverview from "@/components/dashboard/AnalyticsOverview";
import NodeDashboardOverview from "@/components/dashboard/NodeDashboardOverview";
import TasksOverview from "@/components/dashboard/TasksOverview";

import { useWebSocket } from "@/contexts/WebSocketContext";
import { analyticsService } from "@/services/analytics";
import { deviceService } from "@/services/devices";
import type { NetworkMetrics, RealTimeAlert } from "@/types/analytics";
import type { DeviceStats } from "@/types/devices";

interface DashboardStats {
  networkMetrics: NetworkMetrics | null;
  deviceStats: DeviceStats | null;
  alerts: RealTimeAlert[];
  loading: boolean;
}

export default function Dashboard() {
  const { connected, publicKey } = useWallet();
  const { connectionState } = useWebSocket();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    networkMetrics: null,
    deviceStats: null,
    alerts: [],
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [networkData, deviceData, alertsData] = await Promise.all([
          analyticsService.getNetworkMetrics(),
          deviceService.getDeviceStats(),
          analyticsService.getRealTimeAlerts()
        ]);

        setDashboardStats({
          networkMetrics: networkData,
          deviceStats: deviceData,
          alerts: alertsData.filter(alert => !alert.resolved),
          loading: false
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setDashboardStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
                  Dashboard Overview
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                  {connected 
                    ? `Welcome back! Monitor your network activity and performance.`
                    : `Welcome to the Nodara Network. Connect your wallet to get started.`
                  }
                </p>
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center space-x-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
                <div className={`w-2 h-2 rounded-full ${
                  connectionState.isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {connectionState.isConnected ? 'Network Connected' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          {dashboardStats.alerts.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      {dashboardStats.alerts.length} Active Alert{dashboardStats.alerts.length > 1 ? 's' : ''}
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p>{dashboardStats.alerts[0].message}</p>
                      {dashboardStats.alerts.length > 1 && (
                        <p className="mt-1">+ {dashboardStats.alerts.length - 1} more alerts</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Quick Stats */}
          <div className="mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Total Services */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Services</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboardStats.loading ? "..." : formatNumber(dashboardStats.networkMetrics?.totalServices || 0)}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">+12.5%</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Active Devices */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Devices</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboardStats.loading ? "..." : formatNumber(dashboardStats.deviceStats?.onlineDevices || 0)}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">+8.2%</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Network Revenue */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Network Volume</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboardStats.loading ? "..." : `$${formatNumber(dashboardStats.networkMetrics?.totalVolume || 0)}`}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">+15.3%</p>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Avg Response Time */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboardStats.loading ? "..." : `${dashboardStats.networkMetrics?.averageResponseTime || 0}ms`}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">-5.1%</p>
                  </div>
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Services Overview */}
            <div className="order-1">
              <ServicesOverview />
            </div>
            
            {/* Tasks Overview */}
            <div className="order-2">
              <TasksOverview />
            </div>
            
            {/* Devices Overview */}
            <div className="order-3">
              <DevicesOverview />
            </div>
            
            {/* Analytics Overview */}
            <div className="order-4">
              <AnalyticsOverview />
            </div>
          </div>

          {/* Node Dashboard - Full Width */}
          <div className="mb-6 sm:mb-8">
            <NodeDashboardOverview />
          </div>

          {/* Network Status & Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Network Status */}
            <div className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-lg p-4 sm:p-6 border border-cyan-200 dark:border-cyan-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Network Status
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Real-time network health and performance
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  (dashboardStats.networkMetrics?.uptime || 0) > 99 ? 'bg-green-500' : 
                  (dashboardStats.networkMetrics?.uptime || 0) > 95 ? 'bg-yellow-500' : 'bg-red-500'
                } animate-pulse`}></div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Network Uptime</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {dashboardStats.loading ? "..." : `${dashboardStats.networkMetrics?.uptime.toFixed(2)}%`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Transactions</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {dashboardStats.loading ? "..." : formatNumber(dashboardStats.networkMetrics?.totalTransactions || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Alerts</span>
                  <span className={`text-sm font-semibold ${
                    dashboardStats.alerts.length > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {dashboardStats.alerts.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {connected ? 'Explore Features' : 'Getting Started'}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                {connected 
                  ? 'Access all Nodara Network features and capabilities'
                  : 'Connect your wallet to unlock the full Nodara Network experience'
                }
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 text-xs px-2 py-1 rounded-md text-center">
                  Serverless
                </span>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-md text-center">
                  Compute
                </span>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-md text-center">
                  SOL Pay
                </span>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-md text-center">
                  Global
                </span>
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-md text-center">
                  Tasks
                </span>
                <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 text-xs px-2 py-1 rounded-md text-center">
                  Analytics
                </span>
              </div>

              {!connected && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    💡 Connect your Solana wallet to access node management, task creation, and earnings tracking
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Responsiveness Notice */}
          <div className="mt-6 sm:mt-8 block sm:hidden bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Mobile Optimized
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>This dashboard is fully responsive. Swipe cards horizontally for better mobile experience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
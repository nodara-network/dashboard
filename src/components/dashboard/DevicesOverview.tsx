"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DeviceStats {
  totalDevices: number;
  onlineDevices: number;
  activeRegions: number;
  avgResponseTime: number;
}

const MOCK_DEVICE_STATS: DeviceStats = {
  totalDevices: 8450,
  onlineDevices: 6273,
  activeRegions: 89,
  avgResponseTime: 245
};

export default function DevicesOverview() {
  const [stats, setStats] = useState<DeviceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(MOCK_DEVICE_STATS);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Global Device Network</h2>
          <Link 
            href="/devices"
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Explore the worldwide network of smartphone compute devices</p>
      </div>
      <div className="p-6">
        {/* Map Preview */}
        <div className="h-48 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
          {/* Animated dots representing devices */}
          <div className="absolute inset-0">
            <div className="absolute top-12 left-16 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-16 left-1/3 w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="text-center z-10">
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-900 dark:text-white text-sm font-medium">Live Network Map</p>
            <p className="text-gray-600 dark:text-gray-300 text-xs">Real-time device locations</p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
              </div>
            ))
          ) : (
            [
              { 
                label: "Total Devices", 
                value: formatNumber(stats?.totalDevices || 0), 
                icon: "📱",
                color: "text-blue-600 dark:text-blue-400"
              },
              { 
                label: "Online Now", 
                value: formatNumber(stats?.onlineDevices || 0), 
                icon: "🟢",
                color: "text-green-600 dark:text-green-400"
              },
              { 
                label: "Active Regions", 
                value: stats?.activeRegions.toString() || "0", 
                icon: "🌍",
                color: "text-purple-600 dark:text-purple-400"
              },
              { 
                label: "Avg Response", 
                value: `${stats?.avgResponseTime || 0}ms`, 
                icon: "⚡",
                color: "text-orange-600 dark:text-orange-400"
              },
            ].map((stat, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <span className="text-sm">{stat.icon}</span>
                </div>
                <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 
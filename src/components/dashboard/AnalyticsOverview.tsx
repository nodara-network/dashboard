"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AnalyticsData {
  totalComputeHours: number;
  activeDevices: number;
  revenueGenerated: number;
  avgResponseTime: number;
}

const MOCK_ANALYTICS_DATA: AnalyticsData = {
  totalComputeHours: 28450,
  activeDevices: 6273,
  revenueGenerated: 2847000,
  avgResponseTime: 245
};

export default function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_ANALYTICS_DATA);
      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number): string => {
    return `$${formatNumber(num)}`;
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Network Analytics</h2>
          <Link 
            href="/analytics"
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Comprehensive insights and performance metrics</p>
      </div>
      <div className="p-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
              </div>
            ))
          ) : (
            [
              { 
                label: "Total Compute Hours", 
                value: formatNumber(data?.totalComputeHours || 0), 
                trend: "+12.5%",
                trendColor: "text-green-600 dark:text-green-400"
              },
              { 
                label: "Active Devices", 
                value: formatNumber(data?.activeDevices || 0), 
                trend: "+8.2%",
                trendColor: "text-green-600 dark:text-green-400"
              },
              { 
                label: "Revenue Generated", 
                value: formatCurrency(data?.revenueGenerated || 0), 
                trend: "+15.3%",
                trendColor: "text-green-600 dark:text-green-400"
              },
              { 
                label: "Avg Response", 
                value: `${data?.avgResponseTime || 0}ms`, 
                trend: "-5.1%",
                trendColor: "text-green-600 dark:text-green-400"
              },
            ].map((metric, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{metric.value}</p>
                <p className={`text-xs font-medium ${metric.trendColor}`}>{metric.trend}</p>
              </div>
            ))
          )}
        </div>
        
        {/* Chart Preview */}
        <div className="h-32 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Animated chart bars */}
          <div className="absolute bottom-4 left-8 right-8 flex items-end justify-between">
            <div className="w-3 bg-cyan-500 rounded-t animate-pulse" style={{ height: '20px', animationDelay: '0s' }}></div>
            <div className="w-3 bg-blue-500 rounded-t animate-pulse" style={{ height: '35px', animationDelay: '0.2s' }}></div>
            <div className="w-3 bg-purple-500 rounded-t animate-pulse" style={{ height: '28px', animationDelay: '0.4s' }}></div>
            <div className="w-3 bg-green-500 rounded-t animate-pulse" style={{ height: '42px', animationDelay: '0.6s' }}></div>
            <div className="w-3 bg-orange-500 rounded-t animate-pulse" style={{ height: '31px', animationDelay: '0.8s' }}></div>
            <div className="w-3 bg-pink-500 rounded-t animate-pulse" style={{ height: '38px', animationDelay: '1s' }}></div>
          </div>
          
          <div className="text-center z-10">
            <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-900 dark:text-white text-xs font-medium">Live Analytics</p>
            <p className="text-gray-600 dark:text-gray-300 text-xs">Performance metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
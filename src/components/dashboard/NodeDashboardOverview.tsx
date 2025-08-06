"use client";

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import Link from 'next/link';

interface NodeData {
  status: 'online' | 'offline' | 'busy';
  todayEarnings: number;
  totalEarnings: number;
  uptime: number;
  jobsCompleted: number;
}

const MOCK_NODE_DATA: NodeData = {
  status: 'online',
  todayEarnings: 0.24,
  totalEarnings: 12.47,
  uptime: 99.2,
  jobsCompleted: 156
};

export default function NodeDashboardOverview() {
  const { connected } = useWallet();
  const { connectionState } = useWebSocket();
  const [nodeData, setNodeData] = useState<NodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (connected) {
      const timer = setTimeout(() => {
        setNodeData(MOCK_NODE_DATA);
        setLoading(false);
      }, 700);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [connected]);

  // Update node status based on WebSocket connection
  const getNodeStatus = () => {
    if (!connected) return 'offline';
    if (!connectionState.isConnected) return 'offline';
    if (nodeData?.status === 'busy') return 'busy';
    return 'online';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 dark:text-green-400';
      case 'busy': return 'text-orange-600 dark:text-orange-400';
      case 'offline': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 dark:bg-green-900/30';
      case 'busy': return 'bg-orange-100 dark:bg-orange-900/30';
      case 'offline': return 'bg-red-100 dark:bg-red-900/30';
      default: return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Node Dashboard</h2>
          <Link 
            href="/node-dashboard"
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {connected 
            ? 'Manage your smartphone compute node and track earnings'
            : 'Connect your wallet to view node dashboard'
          }
        </p>
      </div>
      <div className="p-6">
        {!connected ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔌</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Connect your wallet to view node data</p>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              💡 Start earning by running compute tasks on your device
            </div>
          </div>
        ) : (
          <>
            {/* Status Overview */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </div>
                ))
              ) : (
                [
                  { 
                    label: "Node Status", 
                    value: getNodeStatus().charAt(0).toUpperCase() + getNodeStatus().slice(1), 
                    color: getStatusColor(getNodeStatus()),
                    bg: getStatusBg(getNodeStatus()),
                    icon: getNodeStatus() === 'online' ? '🟢' : getNodeStatus() === 'busy' ? '🟡' : '🔴'
                  },
                  { 
                    label: "Today's Earnings", 
                    value: `$${nodeData?.todayEarnings?.toFixed(2) || '0.00'}`, 
                    color: "text-green-600 dark:text-green-400",
                    bg: "bg-green-100 dark:bg-green-900/30",
                    icon: '💰'
                  },
                  { 
                    label: "Total Earnings", 
                    value: `$${nodeData?.totalEarnings?.toFixed(2) || '0.00'}`, 
                    color: "text-cyan-600 dark:text-cyan-400",
                    bg: "bg-cyan-100 dark:bg-cyan-900/30",
                    icon: '💎'
                  },
                ].map((item, index) => (
                  <div key={index} className={`${item.bg} rounded-lg p-3 border border-gray-200 dark:border-gray-700`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.label}</p>
                      <span className="text-sm">{item.icon}</span>
                    </div>
                    <p className={`text-lg font-semibold ${item.color}`}>{item.value}</p>
                  </div>
                ))
              )}
            </div>
            
            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Uptime</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{nodeData?.uptime || 0}%</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Jobs Completed</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{nodeData?.jobsCompleted || 0}</p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "Service Settings", icon: "⚙️" },
                { title: "Pricing", icon: "💰" },
                { title: "Availability", icon: "📅" },
                { title: "Withdrawals", icon: "💸" },
              ].map((action, index) => (
                <Link
                  key={index}
                  href="/node-dashboard"
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:border-cyan-300 dark:hover:border-cyan-600 transition-colors text-left block"
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{action.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 
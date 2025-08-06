"use client";

import type { Metadata } from "next";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { deviceService } from "@/services/devices";
import { analyticsService } from "@/services/analytics";

// Mock node data interface
interface NodeData {
  nodeId: string;
  status: 'online' | 'offline' | 'busy' | 'maintenance';
  uptime: number;
  todayEarnings: number;
  totalEarnings: number;
  performance: {
    cpu: number;
    memory: number;
    network: number;
    storage: number;
  };
  services: {
    compute: boolean;
    storage: boolean;
    ai: boolean;
  };
  recentJobs: {
    id: string;
    type: string;
    earnings: number;
    duration: number;
    completedAt: Date;
    status: 'completed' | 'failed';
  }[];
}

export default function NodeDashboardPage() {
  const { connected, publicKey } = useWallet();
  const { connectionState } = useWebSocket();
  const [nodeData, setNodeData] = useState<NodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [performanceHistory, setPerformanceHistory] = useState<number[]>([]);

  useEffect(() => {
    const fetchNodeData = async () => {
      try {
        // Simulate fetching user's node data
        const mockNodeData: NodeData = {
          nodeId: publicKey?.toString().slice(0, 8) + "..." + publicKey?.toString().slice(-4) || "demo-node",
          status: connectionState.isConnected ? 'online' : 'offline',
          uptime: 98.7,
          todayEarnings: 23.45,
          totalEarnings: 1847.92,
          performance: {
            cpu: 67.8,
            memory: 75.2,
            network: 89.1,
            storage: 45.6
          },
          services: {
            compute: true,
            storage: true,
            ai: false
          },
          recentJobs: [
            {
              id: "job_001",
              type: "AI Model Inference",
              earnings: 5.67,
              duration: 120,
              completedAt: new Date(Date.now() - 15 * 60 * 1000),
              status: 'completed'
            },
            {
              id: "job_002", 
              type: "Data Processing",
              earnings: 3.24,
              duration: 85,
              completedAt: new Date(Date.now() - 45 * 60 * 1000),
              status: 'completed'
            },
            {
              id: "job_003",
              type: "File Storage",
              earnings: 1.89,
              duration: 300,
              completedAt: new Date(Date.now() - 75 * 60 * 1000),
              status: 'completed'
            },
            {
              id: "job_004",
              type: "Compute Task",
              earnings: 0,
              duration: 45,
              completedAt: new Date(Date.now() - 95 * 60 * 1000),
              status: 'failed'
            },
            {
              id: "job_005",
              type: "AI Training",
              earnings: 12.65,
              duration: 450,
              completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
              status: 'completed'
            }
          ]
        };

        setNodeData(mockNodeData);
        
        // Generate performance history (last 24 hours)
        const history = Array.from({ length: 24 }, (_, i) => {
          return 70 + Math.random() * 20 + Math.sin(i / 4) * 10;
        });
        setPerformanceHistory(history);
        
      } catch (error) {
        console.error('Failed to fetch node data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNodeData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchNodeData, 30000);
    return () => clearInterval(interval);
  }, [connected, publicKey, connectionState.isConnected]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Connect your wallet to access your node dashboard and track earnings
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Node Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
                  {nodeData?.nodeId && `Node ID: ${nodeData.nodeId}`}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  nodeData?.status === 'online' ? 'bg-green-500 animate-pulse' :
                  nodeData?.status === 'busy' ? 'bg-yellow-500 animate-pulse' :
                  'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">
                  {loading ? 'Loading...' : nodeData?.status || 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Node Status</h3>
                <div className={`w-3 h-3 rounded-full ${
                  nodeData?.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>
              {loading ? (
                <>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Uptime</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {nodeData?.uptime.toFixed(1)}%
                  </p>
                </>
              )}
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Earnings</h3>
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              {loading ? (
                <>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">SOL Earned</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {nodeData?.todayEarnings.toFixed(2)}
                  </p>
                </>
              )}
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Earnings</h3>
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              {loading ? (
                <>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">All Time</p>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {nodeData?.totalEarnings.toFixed(2)}
                  </p>
                </>
              )}
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Jobs Completed</h3>
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {loading ? (
                <>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Today</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {nodeData?.recentJobs.filter(job => job.status === 'completed' && 
                      new Date(job.completedAt).toDateString() === new Date().toDateString()).length}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Metrics */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">System Performance</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Real-time resource utilization</p>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* CPU */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CPU</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{nodeData?.performance.cpu.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${nodeData?.performance.cpu}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Memory */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Memory</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{nodeData?.performance.memory.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${nodeData?.performance.memory}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Network */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Network</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{nodeData?.performance.network.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${nodeData?.performance.network}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Storage */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{nodeData?.performance.storage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${nodeData?.performance.storage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Services Status */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Active Services</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Enabled compute services</p>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Compute Service */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Compute</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">CPU-intensive tasks</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        nodeData?.services.compute 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {nodeData?.services.compute ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Storage Service */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Storage</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Distributed file storage</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        nodeData?.services.storage 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {nodeData?.services.storage ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* AI Service */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">AI Processing</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Machine learning tasks</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        nodeData?.services.ai 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {nodeData?.services.ai ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quick Actions</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Manage your node settings and preferences</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { 
                    title: "Service Settings", 
                    icon: "⚙️", 
                    desc: "Configure compute services",
                    action: () => console.log('Service settings')
                  },
                  { 
                    title: "Pricing", 
                    icon: "💰", 
                    desc: "Set your rates and fees",
                    action: () => console.log('Pricing')
                  },
                  { 
                    title: "Availability", 
                    icon: "📅", 
                    desc: "Manage your schedule",
                    action: () => console.log('Availability')
                  },
                  { 
                    title: "Withdrawals", 
                    icon: "💳", 
                    desc: "Cash out your earnings",
                    action: () => console.log('Withdrawals')
                  },
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:border-cyan-300 dark:hover:border-cyan-600 transition-colors text-left group"
                  >
                    <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{action.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Recent Jobs</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Latest compute jobs and transactions</p>
            </div>
            <div className="p-6">
              {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
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
                ))}
              </div>
              ) : (
                <div className="space-y-4">
                  {nodeData?.recentJobs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No recent jobs found
                    </div>
                  ) : (
                    nodeData?.recentJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            job.status === 'completed' 
                              ? 'bg-green-100 dark:bg-green-900/30' 
                              : 'bg-red-100 dark:bg-red-900/30'
                          }`}>
                            {job.status === 'completed' ? (
                              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{job.type}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {job.duration}s • {job.completedAt.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {job.status}
                          </span>
                          <span className={`font-semibold ${
                            job.status === 'completed' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-gray-400'
                          }`}>
                            {job.status === 'completed' ? `+${job.earnings.toFixed(2)} SOL` : '--'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
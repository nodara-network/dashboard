"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useSmartContractsProgram } from '@/hooks/useSmartContracts';
import { useWallet } from '@solana/wallet-adapter-react';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function TasksOverview() {
  const [activeTab, setActiveTab] = useState<'overview' | 'recent'>('overview');
  const { getAllTasks } = useSmartContractsProgram();
  const { connected, publicKey } = useWallet();

  const { data: tasks = [], isLoading: loading } = getAllTasks;

  // Calculate stats from blockchain data
  const activeTasks = tasks.filter((task: any) => !task.account.isComplete);
  const completedTasks = tasks.filter((task: any) => task.account.isComplete);
  
  // Calculate total rewards (convert from lamports to SOL)
  const totalRewards = tasks.reduce((sum: number, task: any) => {
    return sum + (task.account.rewardPerResponse || 0);
  }, 0) / 1e9; // Convert lamports to SOL

  // Calculate average reward
  const avgReward = tasks.length > 0 ? totalRewards / tasks.length : 0;

  const stats = [
    { label: 'Active Tasks', value: activeTasks.length.toString() },
    { label: 'Completed', value: completedTasks.length.toString() },
    { label: 'Total SOL', value: totalRewards.toFixed(4) },
    { label: 'Avg Reward', value: avgReward.toFixed(4) }
  ];

  const recentTasks = tasks.slice(0, 3); // Show last 3 tasks

  // If wallet not connected, show simplified view
  if (!connected) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-lg">
                <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Task Management
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connect wallet to view tasks
                </p>
              </div>
            </div>
            <Link
              href="/tasks"
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium text-sm transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
        
        <div className="p-6 text-center">
          <div className="text-4xl mb-4">🔌</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Connect your wallet to view task data
          </p>
          <Link
            href="/tasks"
            className="inline-block px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-all duration-200"
          >
            Go to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-lg">
              <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Task Management
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Distributed compute tasks overview
              </p>
            </div>
          </div>
          <Link
            href="/tasks"
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium text-sm transition-colors"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-b-2 border-cyan-500'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
            activeTab === 'recent'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-b-2 border-cyan-500'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Recent Tasks
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                >
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {loading ? '...' : stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link
                href="/tasks"
                className="block w-full px-4 py-3 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-all duration-200 text-center"
              >
                Create New Task
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading tasks from blockchain...</p>
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 dark:text-gray-400">No tasks found</p>
              </div>
            ) : (
              recentTasks.map((task: any, index: number) => {
                const taskData = task.account;
                const rewardInSol = taskData.rewardPerResponse / 1e9;
                const isComplete = taskData.isComplete;
                const deadline = new Date(taskData.deadline * 1000);
                const isExpired = deadline < new Date();
                
                return (
                  <div
                    key={task.publicKey?.toString() || index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          Task #{taskData.taskId.toString()}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isComplete
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              : isExpired
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400'
                          }`}
                        >
                          {isComplete ? 'Complete' : isExpired ? 'Expired' : 'Active'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {taskData.responsesReceived}/{taskData.maxResponses} responses
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                        IPFS: {taskData.cid.slice(0, 12)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">
                        {rewardInSol.toFixed(4)} SOL
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        per response
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Activity Summary */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Blockchain Activity
          </h4>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Live data from Solana
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Network:</span>
            <span className="font-mono text-gray-900 dark:text-white">Localhost</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Tasks:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{tasks.length}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Active/Complete:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {activeTasks.length}/{completedTasks.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 
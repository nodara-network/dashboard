"use client";

import React, { useState } from 'react';
import { ChartIcon } from '@/components/ui/icons';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  reward: number;
  responses: number;
  maxResponses: number;
  deadline: Date;
  status: 'active' | 'completed' | 'cancelled';
  creator: string;
}

export default function TasksOverview() {
  const [activeTab, setActiveTab] = useState<'overview' | 'recent'>('overview');

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Image Processing Task',
      reward: 0.5,
      responses: 3,
      maxResponses: 5,
      deadline: new Date(Date.now() + 86400000), // 24 hours from now
      status: 'active',
      creator: '0x1234...5678'
    },
    {
      id: '2',
      title: 'Data Analysis Request',
      reward: 1.2,
      responses: 2,
      maxResponses: 3,
      deadline: new Date(Date.now() + 172800000), // 48 hours from now
      status: 'active',
      creator: '0x8765...4321'
    },
    {
      id: '3',
      title: 'ML Model Training',
      reward: 2.0,
      responses: 1,
      maxResponses: 2,
      deadline: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'completed',
      creator: '0xabcd...efgh'
    }
  ];

  const totalTasks = mockTasks.length;
  const activeTasks = mockTasks.filter(task => task.status === 'active').length;
  const totalRewards = mockTasks.reduce((sum, task) => sum + task.reward, 0);
  const avgResponseTime = '2.3s';

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task Management</h2>
          <Link 
            href="/tasks"
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Create and manage distributed compute tasks</p>
      </div>
      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'recent'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Recent Tasks
          </button>
        </div>

        {activeTab === 'overview' ? (
          /* Overview Tab */
          <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{totalTasks}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Tasks</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{activeTasks}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Active Tasks</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Quick Actions</h4>
              <div className="flex space-x-3">
                <button className="flex-1 py-2 px-4 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-all duration-200">
                  Create Task
                </button>
                <button className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
                  View Responses
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Performance</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Total Rewards</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {totalRewards.toFixed(2)} SOL
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Avg Response</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {avgResponseTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Recent Tasks Tab */
          <div className="space-y-3">
            {mockTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'active'
                          ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400'
                          : task.status === 'completed'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                    <span>{task.reward} SOL</span>
                    <span>{task.responses}/{task.maxResponses} responses</span>
                    <span>
                      {task.deadline > new Date() 
                        ? `${Math.ceil((task.deadline.getTime() - Date.now()) / (1000 * 60 * 60))}h left`
                        : 'Expired'
                      }
                    </span>
                  </div>
                </div>
                <button className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Chart Preview */}
        <div className="h-32 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50 rounded-lg flex items-center justify-center mt-4">
          <div className="text-center">
            <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
              <ChartIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <p className="text-gray-900 dark:text-white text-xs font-medium">Task Dashboard</p>
            <p className="text-gray-600 dark:text-gray-300 text-xs">Manage compute tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
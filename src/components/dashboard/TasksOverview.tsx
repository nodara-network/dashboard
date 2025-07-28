"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useTaskContext } from '@/contexts/TaskContext';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function TasksOverview() {
  const [activeTab, setActiveTab] = useState<'overview' | 'recent'>('overview');
  const { tasks, loading, getTasksByStatus } = useTaskContext();

  const activeTasks = getTasksByStatus('active');
  const completedTasks = getTasksByStatus('completed');
  const totalRewards = tasks.reduce((sum, task) => sum + task.reward, 0);

  const stats = [
    { label: 'Active Tasks', value: activeTasks.length.toString() },
    { label: 'Completed', value: completedTasks.length.toString() },
    { label: 'Total SOL', value: totalRewards.toFixed(2) },
    { label: 'Avg Reward', value: tasks.length > 0 ? (totalRewards / tasks.length).toFixed(2) : '0.00' }
  ];

  const recentTasks = tasks.slice(0, 3); // Show last 3 tasks

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
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading tasks...</p>
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 dark:text-gray-400">No tasks found</p>
              </div>
            ) : (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
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
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {task.responses}/{task.maxResponses} responses
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {task.reward} SOL
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      per response
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Chart Preview */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Task Activity
          </h4>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Last 7 days
          </span>
        </div>
        <div className="h-20 bg-gradient-to-r from-cyan-100 to-teal-100 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Chart visualization coming soon
          </span>
        </div>
      </div>
    </div>
  );
} 
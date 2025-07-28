"use client";

import React, { useState } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import ChartCard from "@/components/ui/ChartCard";

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  responses: number;
  maxResponses: number;
  deadline: Date;
  status: 'active' | 'completed' | 'cancelled';
  creator: string;
  cid: string;
}

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'create'>('all');

  // Mock data - replace with actual smart contract data
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Image Processing Task',
      description: 'Process and analyze satellite imagery for agricultural monitoring',
      reward: 0.5,
      responses: 3,
      maxResponses: 5,
      deadline: new Date(Date.now() + 86400000),
      status: 'active',
      creator: '0x1234...5678',
      cid: 'QmX...abc'
    },
    {
      id: '2',
      title: 'Data Analysis Request',
      description: 'Analyze customer behavior patterns from e-commerce dataset',
      reward: 1.2,
      responses: 2,
      maxResponses: 3,
      deadline: new Date(Date.now() + 172800000),
      status: 'active',
      creator: '0x8765...4321',
      cid: 'QmY...def'
    },
    {
      id: '3',
      title: 'ML Model Training',
      description: 'Train a sentiment analysis model on social media data',
      reward: 2.0,
      responses: 1,
      maxResponses: 2,
      deadline: new Date(Date.now() - 3600000),
      status: 'completed',
      creator: '0xabcd...efgh',
      cid: 'QmZ...ghi'
    },
    {
      id: '4',
      title: 'Text Classification',
      description: 'Classify news articles into categories',
      reward: 0.8,
      responses: 0,
      maxResponses: 4,
      deadline: new Date(Date.now() + 259200000),
      status: 'active',
      creator: '0x1234...5678',
      cid: 'QmA...jkl'
    }
  ];

  const filteredTasks = mockTasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  });

  const totalTasks = mockTasks.length;
  const activeTasks = mockTasks.filter(task => task.status === 'active').length;
  const completedTasks = mockTasks.filter(task => task.status === 'completed').length;
  const totalRewards = mockTasks.reduce((sum, task) => sum + task.reward, 0);

  const stats = [
    { label: "Total Tasks", value: totalTasks.toString() },
    { label: "Active Tasks", value: activeTasks.toString() },
    { label: "Completed", value: completedTasks.toString() },
    { label: "Total SOL", value: totalRewards.toFixed(2) },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Task Management"
        description="Create, manage, and monitor your distributed compute tasks"
      />

      {/* Action Button */}
      <div className="mb-8 flex justify-end">
        <button
          onClick={() => setActiveTab('create')}
          className="px-6 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-all duration-200"
        >
          Create New Task
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <MetricCard
            key={index}
            label={stat.label}
            value={stat.value}
            isLoading={false}
          />
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-1 border border-gray-200 dark:border-gray-700">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'active', label: 'Active' },
          { id: 'completed', label: 'Completed' },
          { id: 'create', label: 'Create Task' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'create' ? (
        <CreateTaskForm onCancel={() => setActiveTab('all')} />
      ) : (
        <TaskList tasks={filteredTasks} />
      )}
    </PageLayout>
  );
}

function CreateTaskForm({ onCancel }: { onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    maxResponses: '',
    deadline: '',
    cid: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with smart contract
    console.log('Creating task:', formData);
    onCancel();
  };

  return (
    <ChartCard
      title="Create New Task"
      description="Set up a new distributed compute task"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reward per Response (SOL)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.reward}
              onChange={(e) => setFormData({...formData, reward: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="0.5"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Describe what this task requires..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Responses
            </label>
            <input
              type="number"
              value={formData.maxResponses}
              onChange={(e) => setFormData({...formData, maxResponses: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="5"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deadline
            </label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              IPFS CID
            </label>
            <input
              type="text"
              value={formData.cid}
              onChange={(e) => setFormData({...formData, cid: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Qm..."
              required
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-all duration-200"
          >
            Create Task
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </ChartCard>
  );
}

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ChartCard
      title="Task List"
      description="Manage your distributed compute tasks"
    >
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
            <p className="text-gray-600 dark:text-gray-400">Create your first task to get started</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </ChartCard>
  );
}

function TaskCard({ task }: { task: Task }) {
  const timeLeft = task.deadline > new Date() 
    ? Math.ceil((task.deadline.getTime() - Date.now()) / (1000 * 60 * 60))
    : 0;

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {task.title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
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
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {task.description}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {task.reward} SOL
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            per response
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
        <div>
          <div className="text-gray-600 dark:text-gray-400">Responses</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {task.responses}/{task.maxResponses}
          </div>
        </div>
        <div>
          <div className="text-gray-600 dark:text-gray-400">Time Left</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {timeLeft > 0 ? `${timeLeft}h` : 'Expired'}
          </div>
        </div>
        <div>
          <div className="text-gray-600 dark:text-gray-400">Creator</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {task.creator}
          </div>
        </div>
        <div>
          <div className="text-gray-600 dark:text-gray-400">CID</div>
          <div className="font-mono text-xs text-gray-900 dark:text-white truncate">
            {task.cid}
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-all duration-200">
          View Responses
        </button>
        {task.status === 'active' && (
          <>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
              Cancel Task
            </button>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
              Mark Complete
            </button>
          </>
        )}
      </div>
    </div>
  );
} 
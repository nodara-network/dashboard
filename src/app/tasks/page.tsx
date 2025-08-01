"use client";

import React, { useState } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import ChartCard from "@/components/ui/ChartCard";
import { useSmartContractsProgram, useSmartContractsProgramAccount } from '@/hooks/useSmartContracts';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/solana/SolanaProvider';
import { AdminPanel } from '@/components/tasks/AdminPanel';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { toast } from 'sonner';
import { mockTasks, mockStats } from '@/services/mockData';

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'create' | 'admin'>('all');
  const { connected, publicKey } = useWallet();
  const { getAllTasks } = useSmartContractsProgram();
  const { isAdmin, isLoading: adminLoading } = useAdminAccess();
  const { 
    createTask,
    depositFunds,
    markTaskComplete,
    submitResponse 
  } = useSmartContractsProgramAccount();

  // Mock loading state for pitch deck
  const loading = false;

  // Use mock data for pitch deck
  const tasks = mockTasks.map(task => ({
    publicKey: { toString: () => `mock-${task.taskId}` },
    account: {
      taskId: task.taskId,
      creator: { toString: () => task.creator },
      rewardPerResponse: { toNumber: () => task.rewardPerResponse * 1e9 }, // Convert to lamports
      maxResponses: task.maxResponses,
      responsesReceived: task.responsesReceived,
      deadline: task.deadline,
      cid: task.cid,
      isComplete: task.isComplete
    }
  }));

  const activeTasks = tasks.filter((task: any) => !task.account.isComplete);
  const completedTasks = tasks.filter((task: any) => task.account.isComplete);
  
  const filteredTasks = activeTab === 'all' 
    ? tasks 
    : activeTab === 'active' 
    ? activeTasks
    : completedTasks;

  const stats = [
    { label: "Total Tasks", value: mockStats.totalTasks.toString() },
    { label: "Active Tasks", value: mockStats.activeTasks.toString() },
    { label: "Completed", value: mockStats.completedTasks.toString() },
    { label: "Total SOL", value: mockStats.totalRewards.toFixed(4) },
    { label: "Avg Reward", value: mockStats.averageReward.toFixed(3) + " SOL" },
    { label: "Total Responses", value: mockStats.totalResponses.toString() },
  ];

  if (!connected) {
    return (
      <PageLayout>
        <PageHeader
          title="Task Management"
          description="Create, manage, and monitor your distributed compute tasks"
        />
        
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-6">🔌</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
            Please connect your Solana wallet to create and manage tasks on the blockchain.
          </p>
          <WalletButton />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Task Management"
        description="Create, manage, and monitor your distributed compute tasks"
      />

      {/* Action Button */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Connected: <span className="font-mono text-xs">{publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}</span>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('create')}
          className="px-6 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-all duration-200"
        >
          Create New Task
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, index) => (
          <MetricCard
            key={index}
            label={stat.label}
            value={stat.value}
            isLoading={loading}
          />
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-1 border border-gray-200 dark:border-gray-700">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'active', label: 'Active' },
          { id: 'completed', label: 'Completed' },
          { id: 'create', label: 'Create Task' },
          { id: 'admin', label: 'Admin' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-0 py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
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
      ) : activeTab === 'admin' ? (
        <AdminPanel />
      ) : (
        <>
          {/* Category Breakdown */}
          <div className="mb-6">
            <ChartCard
              title="Task Categories"
              description="Distribution of tasks across different categories"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {Object.entries(mockStats.categories).map(([category, count]) => (
                  <div key={category} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{count}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{category}</div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
          
          <TaskList tasks={filteredTasks} loading={loading} />
        </>
      )}
    </PageLayout>
  );
}

function CreateTaskForm({ onCancel }: { onCancel: () => void }) {
  const { createTask } = useSmartContractsProgramAccount();
  const [formData, setFormData] = useState({
    reward: '',
    maxResponses: '',
    deadline: '',
    cid: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const taskId = Math.floor(Math.random() * 1000000); // Generate random task ID
      const rewardInLamports = Math.floor(parseFloat(formData.reward) * 1e9); // Convert SOL to lamports
      const deadline = Math.floor(new Date(formData.deadline).getTime() / 1000); // Convert to Unix timestamp

      await createTask.mutateAsync({
        taskId,
        rewardPerResponse: rewardInLamports,
        maxResponses: parseInt(formData.maxResponses),
        deadline,
        cid: formData.cid
      });

      toast.success('Task created successfully!');
      onCancel();
    } catch (error: any) {
      console.error('Failed to create task:', error);
      toast.error(`Failed to create task: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <ChartCard
      title="Create New Task"
      description="Set up a new distributed compute task on the blockchain"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reward per Response (SOL)
            </label>
            <input
              type="number"
              step="0.001"
              value={formData.reward}
              onChange={(e) => setFormData({...formData, reward: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="0.01"
              required
              min="0.001"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Amount in SOL to pay per valid response
            </p>
          </div>
          
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
              min="1"
              max="1000"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maximum number of responses to accept
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              When the task should be completed
            </p>
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
              placeholder="QmExample..."
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              IPFS hash containing task details
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Important
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>Make sure you have enough SOL to fund the task rewards. Total cost will be: <strong>{formData.reward && formData.maxResponses ? (parseFloat(formData.reward || '0') * parseInt(formData.maxResponses || '0')).toFixed(3) : '0'} SOL</strong></p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={createTask.isPending}
            className="px-6 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createTask.isPending ? 'Creating...' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={createTask.isPending}
            className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </ChartCard>
  );
}

function TaskList({ tasks, loading }: { tasks: any[], loading: boolean }) {
  return (
    <ChartCard
      title="Task List"
      description="Manage your distributed compute tasks on the blockchain"
    >
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Loading tasks from blockchain...</p>
          </div>
        ) : tasks.length === 0 ? (
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
          tasks.map((task, index) => (
            <TaskCard key={task.publicKey?.toString() || index} task={task} />
          ))
        )}
      </div>
    </ChartCard>
  );
}

function TaskCard({ task }: { task: any }) {
  const { markTaskComplete } = useSmartContractsProgramAccount();
  const { publicKey } = useWallet();
  
  // Extract task data from the blockchain response
  const taskData = task.account;
  const taskPubkey = task.publicKey;
  
  // Find corresponding mock task for enhanced data
  const mockTask = mockTasks.find(t => t.taskId === taskData.taskId);
  
  const deadline = new Date(taskData.deadline * 1000); // Convert from Unix timestamp
  const isExpired = deadline < new Date();
  const timeLeft = isExpired ? 0 : Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60));
  
  const rewardInSol = taskData.rewardPerResponse / 1e9; // Convert from lamports to SOL
  const isCreator = publicKey && taskData.creator.toString() === publicKey.toString();
  
  const handleMarkComplete = async () => {
    if (!isCreator) return;
    
    try {
      await markTaskComplete.mutateAsync({
        taskId: taskData.taskId,
        creator: taskData.creator
      });
      toast.success('Task marked as complete!');
    } catch (error: any) {
      console.error('Failed to mark task complete:', error);
      toast.error(`Failed to mark task complete: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Task #{taskData.taskId.toString()}
            </h3>
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                taskData.isComplete
                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  : isExpired
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400'
              }`}
            >
              {taskData.isComplete ? 'Completed' : isExpired ? 'Expired' : 'Active'}
            </span>
            {isCreator && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Your Task
              </span>
            )}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span>Creator: <span className="font-mono text-xs">{taskData.creator.toString().slice(0, 8)}...{taskData.creator.toString().slice(-8)}</span></span>
              <span>IPFS: <span className="font-mono text-xs">{taskData.cid.slice(0, 12)}...</span></span>
            </div>
            {mockTask && (
              <div className="mt-2">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{mockTask.title}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{mockTask.description}</div>
                <div className="inline-block mt-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                  {mockTask.category}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {rewardInSol.toFixed(4)} SOL
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            per response
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm mb-4">
        <div>
          <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Responses</div>
          <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
            {taskData.responsesReceived}/{taskData.maxResponses}
          </div>
        </div>
        <div>
          <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Time Left</div>
          <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
            {timeLeft > 0 ? `${timeLeft}h` : 'Expired'}
          </div>
        </div>
        <div>
          <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Deadline</div>
          <div className="font-semibold text-gray-900 dark:text-white text-xs">
            {deadline.toLocaleDateString()}
          </div>
        </div>
        <div>
          <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Address</div>
          <div className="font-mono text-xs text-gray-900 dark:text-white">
            {taskPubkey.toString().slice(0, 8)}...
          </div>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Task Content (IPFS)</div>
        <div className="font-mono text-xs sm:text-sm text-gray-900 dark:text-white break-all">
          {taskData.cid}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => window.open(`https://ipfs.io/ipfs/${taskData.cid}`, '_blank')}
          className="px-3 sm:px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-all duration-200"
        >
          View Content
        </button>
        
        {isCreator && !taskData.isComplete && (
          <button 
            onClick={handleMarkComplete}
            disabled={markTaskComplete.isPending}
            className="px-3 sm:px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200 disabled:opacity-50"
          >
            {markTaskComplete.isPending ? 'Marking...' : 'Mark Complete'}
          </button>
        )}
        
        <button 
          onClick={() => window.open(`https://explorer.solana.com/address/${taskPubkey.toString()}?cluster=custom&customUrl=http://localhost:8899`, '_blank')}
          className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
        >
          View on Explorer
        </button>
      </div>
    </div>
  );
} 
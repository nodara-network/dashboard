"use client";

import React from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { useWallet } from '@/contexts/WalletContext';

export default function TaskTest() {
  const { tasks, loading, error, createTask } = useTaskContext();
  const { wallet, walletAddress } = useWallet();

  const handleTestCreate = async () => {
    if (!wallet?.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const testTask = {
        taskId: Date.now(),
        rewardPerResponse: 0.1, // 0.1 SOL
        maxResponses: 3,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        cid: 'QmTestTask' + Date.now()
      };

      console.log('Creating test task:', testTask);
      const signature = await createTask(testTask);
      console.log('Task created successfully! Signature:', signature);
      alert(`Task created! Signature: ${signature}`);
    } catch (error) {
      console.error('Failed to create test task:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Smart Contract Integration Test
      </h3>
      
      <div className="space-y-4">
        {/* Wallet Status */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Wallet Status</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div>Connected: {wallet ? 'Yes' : 'No'}</div>
            <div>Address: {walletAddress || 'Not connected'}</div>
          </div>
        </div>

        {/* Task Context Status */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Task Context Status</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div>Loading: {loading ? 'Yes' : 'No'}</div>
            <div>Tasks Count: {tasks.length}</div>
            <div>Error: {error || 'None'}</div>
          </div>
        </div>

        {/* Test Actions */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Test Actions</h4>
          <button
            onClick={handleTestCreate}
            disabled={!wallet || loading}
            className="px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Test Task'}
          </button>
        </div>

        {/* Recent Tasks */}
        {tasks.length > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Tasks</h4>
            <div className="space-y-2">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="text-sm text-gray-600 dark:text-gray-400">
                  <div>ID: {task.id}</div>
                  <div>Title: {task.title}</div>
                  <div>Reward: {task.reward} SOL</div>
                  <div>Status: {task.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
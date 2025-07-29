"use client";

import { useSmartContractsProgramAccount, useSmartContractsProgram } from "@/hooks/useSmartContracts";
import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import ChartCard from "@/components/ui/ChartCard";

export function AdminPanel() {
  const [taskId, setTaskId] = useState("");
  const [creator, setCreator] = useState("");
  const [isDelegating, setIsDelegating] = useState(false);

  const { initAdmin, delegateTaskAccount, undelegateTaskAccount } = useSmartContractsProgramAccount();
  const { getAllAdminAccounts } = useSmartContractsProgram();
  const { data: adminAccounts = [], isLoading: adminLoading } = getAllAdminAccounts;

  const handleInitAdmin = async () => {
    try {
      await initAdmin.mutateAsync();
    } catch (error) {
      console.error("Failed to initialize admin:", error);
    }
  };

  const handleDelegateTask = async () => {
    if (!taskId || !creator) {
      alert("Please fill all fields");
      return;
    }

    try {
      setIsDelegating(true);
      await delegateTaskAccount.mutateAsync({
        taskId: parseInt(taskId),
        creator: new PublicKey(creator),
      });
      
      // Reset form
      setTaskId("");
      setCreator("");
    } catch (error) {
      console.error("Failed to delegate task:", error);
    } finally {
      setIsDelegating(false);
    }
  };

  const handleUndelegateTask = async () => {
    if (!taskId || !creator) {
      alert("Please fill all fields");
      return;
    }

    try {
      setIsDelegating(true);
      await undelegateTaskAccount.mutateAsync({
        taskId: parseInt(taskId),
        creator: new PublicKey(creator),
      });
      
      // Reset form
      setTaskId("");
      setCreator("");
    } catch (error) {
      console.error("Failed to undelegate task:", error);
    } finally {
      setIsDelegating(false);
    }
  };

  return (
    <ChartCard
      title="Admin Panel"
      description="Manage admin accounts and system privileges"
    >
      <div className="space-y-6">
        {/* Admin Accounts Viewer */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Admin Accounts</h3>
          {adminLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600 mx-auto"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading admin accounts...</p>
            </div>
          ) : adminAccounts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">No admin accounts found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {adminAccounts.map((admin: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Admin #{index + 1}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
                    {admin.account.authority.toString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Account: {admin.publicKey.toString().slice(0, 8)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Initialize Admin */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Initialize Admin Account</h3>
          <button
            onClick={handleInitAdmin}
            disabled={initAdmin.isPending}
            className="w-full px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initAdmin.isPending ? "Initializing..." : "Initialize Admin"}
          </button>
        </div>

        {/* Delegate Task - Coming Soon */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Delegate Task Account</h3>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  MagicBlock Integration
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>MagicBlock delegation requires additional setup. This feature will be available soon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Undelegate Task - Coming Soon */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Undelegate Task Account</h3>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  MagicBlock Integration
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>MagicBlock undelegation requires additional setup. This feature will be available soon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Status */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Admin Status</h3>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Admin Access Granted
                </h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p>✅ You have admin privileges</p>
                  <p>✅ Can manage tasks and responses</p>
                  <p>✅ Can verify responses and distribute rewards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
} 
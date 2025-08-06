"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useSmartContractsProgramAccount } from "@/hooks/useSmartContracts";
import { getProgramId } from "@/utils/solana";

interface AdminAccount {
  authority: PublicKey;
  bump: number;
}

export function AdminInitializer() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const { initAdmin } = useSmartContractsProgramAccount();
  const [isChecking, setIsChecking] = useState(false);

  // Get the program ID
  const programId = getProgramId();

  // Derive the admin account PDA
  const adminAccountPda = PublicKey.findProgramAddressSync(
    [Buffer.from("admin")],
    programId
  )[0];

  // Query to check if admin account exists and get its data
  const adminAccountQuery = useQuery({
    queryKey: ['admin-account', adminAccountPda.toString()],
    queryFn: async () => {
      try {
        const accountInfo = await connection.getAccountInfo(adminAccountPda);
        if (!accountInfo) {
          return { exists: false, error: null };
        }
        
        // Account exists, try to parse the account data if needed
        return {
          exists: true,
          authority: publicKey, // This should be parsed from account data in a real implementation
          bump: 0,
          error: null
        };
      } catch (error) {
        console.error('Error fetching admin account:', error);
        return { 
          exists: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    },
    enabled: !!connection,
    refetchInterval: 5000, // Refetch every 5 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const handleInitAdmin = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsChecking(true);
      await initAdmin.mutateAsync();
      // Refetch admin account data after successful initialization
      await adminAccountQuery.refetch();
    } catch (error) {
      console.error('Failed to initialize admin:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const adminExists = adminAccountQuery.data?.exists ?? false;
  const hasError = adminAccountQuery.data?.error || adminAccountQuery.error;
  const isLoading = adminAccountQuery.isLoading || initAdmin.isPending || isChecking;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Admin Account
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Initialize the admin account to manage the smart contract
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasError ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
              ✗ Error
            </span>
          ) : adminExists ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              ✓ Initialized
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
              ⚠ Not Initialized
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Admin Account PDA Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Admin Account Details
          </h4>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-gray-600 dark:text-gray-400">PDA Address:</span>
              <div className="font-mono text-gray-900 dark:text-white break-all">
                {adminAccountPda.toString()}
              </div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Program ID:</span>
              <div className="font-mono text-gray-900 dark:text-white break-all">
                {programId.toString()}
              </div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`ml-2 ${
                hasError ? 'text-red-600 dark:text-red-400' : 
                adminExists ? 'text-green-600 dark:text-green-400' : 
                'text-yellow-600 dark:text-yellow-400'
              }`}>
                {isLoading ? 'Checking...' : 
                 hasError ? `Error: ${hasError}` :
                 adminExists ? 'Account exists' : 'Account does not exist'}
              </span>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        {!connected ? (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Connect your wallet to initialize the admin account
            </p>
            <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Connected Wallet Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">Connected Wallet:</span>
                <div className="font-mono text-xs mt-1 break-all">
                  {publicKey?.toString()}
                </div>
              </div>
            </div>

            {/* Error Display and Retry */}
            {hasError && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                <div className="text-sm text-red-800 dark:text-red-200 mb-2">
                  ⚠️ Failed to check admin account status
                </div>
                <div className="text-xs text-red-600 dark:text-red-400 mb-3">
                  Error: {typeof hasError === 'string' ? hasError : 'Unknown error occurred'}
                </div>
                <button
                  onClick={() => adminAccountQuery.refetch()}
                  disabled={isLoading}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded text-xs font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Retrying...' : 'Retry'}
                </button>
              </div>
            )}

            {/* Initialize Button */}
            {!adminExists && !hasError && (
              <button
                onClick={handleInitAdmin}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Initializing Admin Account...</span>
                  </div>
                ) : (
                  "Initialize Admin Account"
                )}
              </button>
            )}

            {/* Success Message */}
            {adminExists && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div className="text-sm text-green-800 dark:text-green-200">
                  ✅ Admin account is already initialized and ready to use!
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
            📋 Instructions
          </h4>
          <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Connect your wallet to initialize the admin account</li>
            <li>• The admin account is required to manage tasks and contract settings</li>
            <li>• Only one admin account can exist per program</li>
            <li>• Make sure you have sufficient SOL for transaction fees</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
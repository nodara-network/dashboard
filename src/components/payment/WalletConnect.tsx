"use client";

import { WalletButton } from '@/components/solana/SolanaProvider';
import { useWallet } from '@solana/wallet-adapter-react';

export default function WalletConnect() {
  const { publicKey, connected } = useWallet();

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Wallet Connection</h2>
      
      <div className="space-y-4">
        <div className="text-center">
          <WalletButton />
        </div>
        
        {connected && publicKey && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
              Wallet Connected
            </h3>
            <p className="text-sm text-green-600 dark:text-green-300 break-all">
              {publicKey.toString()}
            </p>
          </div>
        )}
        
        {!connected && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Connect your wallet to interact with smart contracts
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

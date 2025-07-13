"use client";

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { 
  WalletIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ArrowsRightLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap';
  amount: number;
  token: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
  recipient?: string;
}

interface Balance {
  SOL: number;
  [key: string]: number;
}

export default function WalletConnect() {
  const { wallet, walletAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const [balance, setBalance] = useState<Balance>({ SOL: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  // Mock balance fetching - replace with actual API calls
  const fetchBalance = useCallback(async () => {
    if (!wallet?.publicKey) return;
    
    setIsLoadingBalance(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance({ SOL: 2.45, USDC: 150.75 });
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [wallet?.publicKey]);

  // Mock transaction history - replace with actual API calls
  const fetchTransactions = useCallback(async () => {
    if (!wallet?.publicKey) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'receive',
          amount: 0.5,
          token: 'SOL',
          timestamp: new Date(Date.now() - 3600000),
          status: 'confirmed',
          hash: '0x123...abc'
        },
        {
          id: '2',
          type: 'send',
          amount: 0.1,
          token: 'SOL',
          timestamp: new Date(Date.now() - 7200000),
          status: 'confirmed',
          hash: '0x456...def',
          recipient: '0x789...ghi'
        },
        {
          id: '3',
          type: 'swap',
          amount: 50,
          token: 'USDC',
          timestamp: new Date(Date.now() - 10800000),
          status: 'pending'
        }
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [wallet?.publicKey]);

  useEffect(() => {
    if (wallet?.publicKey) {
      fetchBalance();
      fetchTransactions();
    }
  }, [wallet?.publicKey, fetchBalance, fetchTransactions]);

  const handleQuickAction = useCallback((action: 'send' | 'receive' | 'swap') => {
    // Implement quick action handlers
    console.log(`Quick action: ${action}`);
  }, []);

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!wallet?.publicKey) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <WalletIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Connect your Solana wallet to view your balance and transaction history
          </p>
          <button
            onClick={() => connectWallet('Phantom')}
            disabled={isConnecting}
            className="bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Display */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Wallet Balance
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatAddress(walletAddress!)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(balance).map(([token, amount]) => (
            <div key={token} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{token}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{token}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isLoadingBalance ? 'Loading...' : `${amount.toFixed(4)}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => fetchBalance()}
                disabled={isLoadingBalance}
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleQuickAction('send')}
            className="flex flex-col items-center p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/30 dark:hover:to-red-700/30 transition-all duration-200"
          >
            <ArrowUpIcon className="w-6 h-6 text-red-600 dark:text-red-400 mb-2" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">Send</span>
          </button>
          
          <button
            onClick={() => handleQuickAction('receive')}
            className="flex flex-col items-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-200"
          >
            <ArrowDownIcon className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Receive</span>
          </button>
          
          <button
            onClick={() => handleQuickAction('swap')}
            className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-200"
          >
            <ArrowsRightLeftIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Swap</span>
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h3>
          <button
            onClick={() => setShowTransactionHistory(!showTransactionHistory)}
            className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
          >
            {showTransactionHistory ? 'Hide' : 'View All'}
          </button>
        </div>

        <div className="space-y-3">
          {transactions.slice(0, showTransactionHistory ? undefined : 3).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(tx.status)}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {tx.type}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tx.timestamp.toLocaleDateString()} {tx.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  tx.type === 'receive' ? 'text-green-600 dark:text-green-400' : 
                  tx.type === 'send' ? 'text-red-600 dark:text-red-400' : 
                  'text-blue-600 dark:text-blue-400'
                }`}>
                  {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.token}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-8">
            <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No transactions yet</p>
          </div>
        )}
      </div>

      {/* Disconnect Button */}
      <div className="text-center">
        <button
          onClick={disconnectWallet}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
} 
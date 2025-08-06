"use client";

import React from 'react';
import { useWebSocketConnection } from '@/hooks/useWebSocketConnection';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/solana/SolanaProvider';

export default function PowerButton() {
  const { connected: walletConnected } = useWallet();
  const { connectionState, connect, disconnect, isWalletRequired } = useWebSocketConnection();
  const [connectionTime, setConnectionTime] = React.useState<Date | null>(null);
  const [uptime, setUptime] = React.useState<string>('00:00:00');

  // Track connection time and uptime
  React.useEffect(() => {
    if (connectionState.isConnected && !connectionTime) {
      setConnectionTime(new Date());
    } else if (!connectionState.isConnected) {
      setConnectionTime(null);
      setUptime('00:00:00');
    }
  }, [connectionState.isConnected, connectionTime]);

  // Update uptime every second
  React.useEffect(() => {
    if (!connectionTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - connectionTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setUptime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [connectionTime]);

  const handlePowerToggle = async () => {
    if (connectionState.isConnected) {
      disconnect();
    } else {
      await connect();
    }
  };

  const getPowerButtonState = () => {
    if (!walletConnected) return 'wallet-required';
    if (connectionState.isConnecting) return 'connecting';
    if (connectionState.isConnected) return 'connected';
    return 'disconnected';
  };

  const state = getPowerButtonState();

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Big Clean Power Button - VPN Style */}
      {!walletConnected ? (
        <div className="text-center">
          <div className="mb-8">
            {/* Inactive Button */}
            <div className="w-52 h-52 rounded-full bg-gray-900 border-8 border-gray-700 flex items-center justify-center shadow-2xl relative">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
          <WalletButton />
        </div>
      ) : (
        <button
          onClick={handlePowerToggle}
          disabled={connectionState.isConnecting}
          className="relative w-52 h-52 rounded-full transition-all duration-300 focus:outline-none"
        >
          {/* Outer Ring */}
          <div className={`
            absolute inset-0 rounded-full border-8 transition-all duration-500
            ${state === 'connected' 
              ? 'border-cyan-400 shadow-lg shadow-cyan-400/30' 
              : state === 'connecting'
              ? 'border-teal-400 shadow-lg shadow-teal-400/30'
              : 'border-gray-700 hover:border-cyan-400'
            }
          `}></div>
          
          {/* Inner Dark Circle */}
          <div className="absolute inset-8 rounded-full bg-gray-900 flex items-center justify-center">
            {/* Power Icon */}
            {state === 'connected' ? (
              <svg className="w-16 h-16 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : state === 'connecting' ? (
              <div className="w-16 h-16 border-4 border-gray-600 border-t-teal-400 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} 
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            )}
          </div>
          
          {/* Pulse animation for connected state */}
          {state === 'connected' && (
            <div className="absolute inset-0 rounded-full border-8 border-cyan-400 animate-ping opacity-30"></div>
          )}
        </button>
      )}

      {/* Status Text - Clean and Simple */}
      <div className="text-center space-y-2">
        <div className="text-lg font-medium text-white">
          Status: <span className={`
            ${state === 'connected' ? 'text-cyan-400' : 
              state === 'connecting' ? 'text-teal-400' : 
              state === 'wallet-required' ? 'text-orange-400' : 'text-gray-400'}
          `}>
            {state === 'wallet-required' && 'Wallet Required'}
            {state === 'connecting' && 'Connecting...'}
            {state === 'connected' && 'Connected'}
            {state === 'disconnected' && 'Disconnected'}
          </span>
        </div>
        
        {connectionState.error && (
          <div className="text-sm text-red-400">
            {connectionState.error}
          </div>
        )}
      </div>

      {/* Connection Stats - VPN Style */}
      {state === 'connected' && (
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-cyan-800/30">
          {/* <div className="pt-4 border-t border-gray-700 text-center"> */}
            <div className="text-xs text-gray-400 mb-1">Connected Time</div>
            <div className="text-lg text-cyan-400 font-mono">
              {uptime}
            </div>
          </div>
        // </div>
      )}

      {/* Instructions */}
      <div className="text-center max-w-sm">
        <div className="text-sm text-gray-400">
          {state === 'wallet-required' && 'Connect your Solana wallet to access the Nodara compute network'}
          {state === 'connecting' && 'Establishing secure connection to network...'}
          {state === 'connected' && 'You are now connected to the Nodara network. Ready to run compute tasks.'}
          {state === 'disconnected' && 'Tap the button to connect to the Nodara compute network'}
        </div>
      </div>
    </div>
  );
}
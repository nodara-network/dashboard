"use client";

import React from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useWallet } from '@solana/wallet-adapter-react';

interface WebSocketStatusProps {
  variant?: 'minimal' | 'detailed';
  className?: string;
}

export function WebSocketStatus({ variant = 'minimal', className = '' }: WebSocketStatusProps) {
  const { connected: walletConnected } = useWallet();
  const { connectionState } = useWebSocket();

  if (!walletConnected) {
    return null;
  }

  const getStatusColor = () => {
    if (connectionState.isConnecting) return 'text-yellow-500';
    if (connectionState.isConnected) return 'text-green-500';
    if (connectionState.error) return 'text-red-500';
    return 'text-gray-500';
  };

  const getStatusText = () => {
    if (connectionState.isConnecting) return 'Connecting...';
    if (connectionState.isConnected) return 'Connected';
    if (connectionState.error) return 'Disconnected';
    return 'Not Connected';
  };

  const getStatusDot = () => {
    if (connectionState.isConnecting) return 'animate-pulse bg-yellow-500';
    if (connectionState.isConnected) return 'bg-green-500';
    if (connectionState.error) return 'bg-red-500';
    return 'bg-gray-500';
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${getStatusDot()}`} />
        <span className={`text-sm ${getStatusColor()}`}>
          {connectionState.isConnected ? 'Live' : 'Offline'}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 ${className}`}>
      <div className={`w-3 h-3 rounded-full ${getStatusDot()}`} />
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {connectionState.lastHeartbeat && connectionState.isConnected && (
          <span className="text-xs text-gray-500">
            Last ping: {new Date(connectionState.lastHeartbeat).toLocaleTimeString()}
          </span>
        )}
        {connectionState.error && (
          <span className="text-xs text-red-500">
            {connectionState.error}
          </span>
        )}
      </div>
    </div>
  );
}
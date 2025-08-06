"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { useWebSocketConnection, WebSocketConnectionState } from '@/hooks/useWebSocketConnection';
import { useWallet } from '@solana/wallet-adapter-react';

interface WebSocketContextType {
  connectionState: WebSocketConnectionState;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  sendMessage: (message: any) => boolean;
  isWalletRequired: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { connected: walletConnected } = useWallet();
  const { connectionState, connect, disconnect, sendMessage, isWalletRequired } = useWebSocketConnection();

  // Auto-connect when wallet becomes available
  useEffect(() => {
    if (walletConnected && !connectionState.isConnected && !connectionState.isConnecting) {
      console.log('🔗 Wallet connected, auto-connecting to WebSocket...');
      connect();
    }
  }, [walletConnected, connectionState.isConnected, connectionState.isConnecting, connect]);

  // Auto-disconnect when wallet disconnects
  useEffect(() => {
    if (!walletConnected && connectionState.isConnected) {
      console.log('💸 Wallet disconnected, closing WebSocket connection...');
      disconnect();
    }
  }, [walletConnected, connectionState.isConnected, disconnect]);

  const value = {
    connectionState,
    connect,
    disconnect,
    sendMessage,
    isWalletRequired
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
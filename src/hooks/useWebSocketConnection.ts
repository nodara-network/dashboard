"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export interface WebSocketConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastHeartbeat: Date | null;
}

export function useWebSocketConnection() {
  const { publicKey, connected: walletConnected } = useWallet();
  const [connectionState, setConnectionState] = useState<WebSocketConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastHeartbeat: null
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const clearTimers = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    clearTimers();
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'HEARTBEAT' }));
        console.log('📡 Heartbeat sent to Nodara network');
      }
    }, 5000); // Send heartbeat every 5 seconds
  }, [clearTimers]);

  const connect = useCallback(async () => {
    if (!walletConnected || !publicKey) {
      setConnectionState(prev => ({
        ...prev,
        error: 'Wallet must be connected first'
      }));
      return false;
    }

    if (connectionState.isConnecting || connectionState.isConnected) {
      return connectionState.isConnected;
    }

    setConnectionState(prev => ({
      ...prev,
      isConnecting: true,
      error: null
    }));

    try {
      // Use localhost for development, production URL for deployed version  
      const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      const isDevelopment = process.env.NODE_ENV === 'development';
      const wsUrl = (isDevelopment || isLocalhost)
        ? `ws://localhost:8080?publicKey=${encodeURIComponent(publicKey.toString())}`
        : `wss://ws.nodara.network?publicKey=${encodeURIComponent(publicKey.toString())}`;
      
      console.log(`🔗 Connecting to WebSocket: ${wsUrl} (dev: ${isDevelopment}, localhost: ${isLocalhost})`);
      
      // For development, simulate connection success without actual WebSocket
      if (isDevelopment && isLocalhost) {
        console.log('🔧 Development mode: simulating WebSocket connection');
        
        // Simulate connection success after a short delay
        setTimeout(() => {
          setConnectionState(prev => ({
            ...prev,
            isConnected: true,
            isConnecting: false,
            error: null,
            lastHeartbeat: new Date()
          }));
          
          // Simulate periodic heartbeats
          const heartbeatInterval = setInterval(() => {
            setConnectionState(prev => ({
              ...prev,
              lastHeartbeat: new Date()
            }));
          }, 30000);
          
          heartbeatIntervalRef.current = heartbeatInterval;
          console.log('🚀 Simulated connection to Nodara WebSocket network');
        }, 1000);
        
        return true;
      }
      
      const ws = new WebSocket(wsUrl);
      
      // Set connection timeout
      const timeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close();
          setConnectionState(prev => ({
            ...prev,
            isConnecting: false,
            error: 'Connection timeout'
          }));
        }
      }, 10000);

      ws.onopen = () => {
        clearTimeout(timeout);
        wsRef.current = ws;
        reconnectAttempts.current = 0;
        
        setConnectionState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null
        }));

        startHeartbeat();
        console.log('🚀 Connected to Nodara WebSocket network');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📥 Received from Nodara network:', data);
          
          if (data.type === 'HEARTBEAT') {
            setConnectionState(prev => ({
              ...prev,
              lastHeartbeat: new Date()
            }));
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        clearTimeout(timeout);
        clearTimers();
        wsRef.current = null;
        
        const wasConnected = connectionState.isConnected;
        
        let errorMessage = null;
        if (event.code !== 1000) {
          switch (event.code) {
            case 1001:
              errorMessage = 'Connection closed: Server going away';
              break;
            case 1002:
              errorMessage = 'Connection closed: Protocol error';
              break;
            case 1003:
              errorMessage = 'Connection closed: Unsupported data';
              break;
            case 1006:
              errorMessage = 'Connection closed: Abnormal closure (network issue)';
              break;
            case 1011:
              errorMessage = 'Connection closed: Server error';
              break;
            default:
              errorMessage = `Connection closed: ${event.reason || `Code ${event.code}`}`;
          }
        }
        
        setConnectionState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: errorMessage
        }));

        // Auto-reconnect if it was an unexpected disconnection
        if (wasConnected && event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectAttempts.current++;
          
          console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts}) - Code: ${event.code}`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.log('❌ Max reconnection attempts reached');
          setConnectionState(prev => ({
            ...prev,
            error: 'Connection failed after multiple attempts. Please try manually reconnecting.'
          }));
        }

        console.log(`🔌 Disconnected from Nodara network - Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`);
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error('❌ WebSocket error:', error);
        setConnectionState(prev => ({
          ...prev,
          isConnecting: false,
          error: 'Connection failed'
        }));
      };

      return true;
    } catch (error) {
      setConnectionState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Unknown connection error'
      }));
      return false;
    }
  }, [walletConnected, publicKey, connectionState.isConnecting, connectionState.isConnected, startHeartbeat, clearTimers]);

  const disconnect = useCallback(() => {
    clearTimers();
    reconnectAttempts.current = 0;
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect');
      wsRef.current = null;
    }
    
    setConnectionState({
      isConnected: false,
      isConnecting: false,
      error: null,
      lastHeartbeat: null
    });
    
    console.log('🛑 Manually disconnected from Nodara network');
  }, [clearTimers]);

  const resetConnection = useCallback(() => {
    reconnectAttempts.current = 0;
    setConnectionState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  return {
    connectionState,
    connect,
    disconnect,
    resetConnection,
    sendMessage,
    isWalletRequired: !walletConnected || !publicKey
  };
}
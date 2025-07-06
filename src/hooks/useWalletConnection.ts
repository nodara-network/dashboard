"use client";

import { useState, useCallback, useEffect } from 'react';
import type { SolanaWallet, WalletProvider } from '@/types/wallet';

export function useWalletConnection() {
  const [wallet, setWallet] = useState<SolanaWallet | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [availableWallets, setAvailableWallets] = useState<WalletProvider[]>([]);
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    const checkWallets = () => {
      const wallets: WalletProvider[] = [];
      if (typeof window !== 'undefined') {
        if (window.solana?.isPhantom) wallets.push('Phantom');
        if (window.solflare) wallets.push('Solflare');
        if (window.backpack) wallets.push('Backpack');
      }
      setAvailableWallets(wallets);
    };
    
    checkWallets();
    const timer = setTimeout(checkWallets, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const connectWallet = useCallback(async (walletName: WalletProvider) => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setShowWalletModal(false);
    
    try {
      if (typeof window === 'undefined') {
        throw new Error('Not in browser environment');
      }

      let selectedWallet: SolanaWallet | null = null;
      
      switch (walletName) {
        case 'Phantom':
          if (window.solana?.isPhantom) {
            selectedWallet = window.solana;
          } else if (window.phantom?.solana) {
            selectedWallet = window.phantom.solana;
          } else {
            throw new Error('Phantom wallet not found. Please install Phantom wallet extension.');
          }
          break;
          
        case 'Solflare':
          if (window.solflare) {
            selectedWallet = window.solflare;
          } else {
            throw new Error('Solflare wallet not found. Please install Solflare wallet extension.');
          }
          break;
          
        case 'Backpack':
          if (window.backpack) {
            selectedWallet = window.backpack;
          } else {
            throw new Error('Backpack wallet not found. Please install Backpack wallet extension.');
          }
          break;
          
        default:
          throw new Error('Unsupported wallet provider');
      }
      
      if (!selectedWallet) {
        throw new Error('Selected wallet not available.');
      }
      
      await selectedWallet.connect();
      
      if (selectedWallet.publicKey) {
        setWallet(selectedWallet);
        setWalletAddress(selectedWallet.publicKey.toString());
      } else {
        throw new Error('No public key received from wallet');
      }
      
    } catch (error) {
      console.error('Wallet connection error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('User rejected') || error.message.includes('User denied')) {
          throw new Error('Connection cancelled by user');
        } else {
          throw error;
        }
      } else {
        throw new Error('Unknown connection error');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  const disconnectWallet = useCallback(async () => {
    if (!wallet) return;
    
    try {
      await wallet.disconnect();
      setWallet(null);
      setWalletAddress(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  }, [wallet]);

  useEffect(() => {
    const autoReconnect = async () => {
      if (typeof window === 'undefined') return;
      
      const connectedWallet = 
        (window.solana?.isConnected && window.solana) ||
        (window.solflare?.isConnected && window.solflare) ||
        (window.backpack?.isConnected && window.backpack) ||
        null;
      
      if (connectedWallet && connectedWallet.publicKey) {
        setWallet(connectedWallet);
        setWalletAddress(connectedWallet.publicKey.toString());
      }
    };

    autoReconnect();
  }, []);

  return {
    wallet,
    walletAddress,
    isConnecting,
    availableWallets,
    connectWallet,
    disconnectWallet,
    showWalletModal,
    setShowWalletModal,
  };
} 
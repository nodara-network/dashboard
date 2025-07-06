"use client"
import { createContext, useContext, ReactNode } from 'react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import type { WalletContextType } from '@/types/wallet';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const walletState = useWalletConnection();

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 
"use client"
import { createContext, useContext, ReactNode } from 'react';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';

// Simple wallet context that directly uses Solana wallet adapter
const WalletContext = createContext<ReturnType<typeof useSolanaWallet> | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const solanaWallet = useSolanaWallet();

  return (
    <WalletContext.Provider value={solanaWallet}>
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
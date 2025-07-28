"use client";

import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';

export default function TaskProviderWrapper({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  
  // Create a connection to Solana devnet (you can change this to mainnet later)
  const connection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.testnet.solana.com",
    "confirmed"
  );

  return (
    <TaskProvider connection={connection} wallet={wallet}>
      {children}
    </TaskProvider>
  );
} 
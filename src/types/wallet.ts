import type { PublicKey, Transaction } from '@solana/web3.js';

export interface SolanaWallet {
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction?: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
  isPhantom?: boolean;
  isConnected?: boolean;
}

export type WalletProvider = 'Phantom' | 'Solflare' | 'Backpack';

export interface WalletContextType {
  wallet: SolanaWallet | null;
  walletAddress: string | null;
  isConnecting: boolean;
  availableWallets: WalletProvider[];
  connectWallet: (walletName: WalletProvider) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  showWalletModal: boolean;
  setShowWalletModal: (show: boolean) => void;
}

declare global {
  interface Window {
    solana?: SolanaWallet;
    phantom?: {
      solana?: SolanaWallet;
    };
    solflare?: SolanaWallet;
    backpack?: SolanaWallet;
  }
} 
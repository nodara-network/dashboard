'use client'

import { AnchorProvider } from '@coral-xyz/anchor'
import { WalletError } from '@solana/wallet-adapter-base'
import { AnchorWallet, ConnectionProvider, useConnection, useWallet, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import '@solana/wallet-adapter-react-ui/styles.css'
import { Connection } from '@solana/web3.js'
import dynamic from 'next/dynamic'
import { ReactNode, useCallback, useMemo } from 'react'
import { useCluster } from '@/components/cluster/cluster-data-access'

export const WalletButton = () => (
   <WalletMultiButton style={{
      backgroundImage: "linear-gradient(to right, #22d3ee, #2dd4bf)",
      color: "#0891b2",
      borderRadius: "10px",
      padding: "2px 18px",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }} />

);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster()
  
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], [])
  
  const onError = useCallback((error: WalletError) => {
    console.error('Wallet error:', error)
  }, [])

  // Force devnet for now to avoid localhost caching issues
  const endpoint = cluster.name === 'local' ? 'https://api.devnet.solana.com' : cluster.endpoint

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export function useAnchorProvider() {
  const { connection } = useConnection()
  const wallet = useWallet()

  return new AnchorProvider(connection, wallet as AnchorWallet, { commitment: 'confirmed' })
}

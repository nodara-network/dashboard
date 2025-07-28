'use client'

import { AnchorProvider } from '@coral-xyz/anchor'
import { WalletError } from '@solana/wallet-adapter-base'
import { AnchorWallet, ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'
import { Connection } from '@solana/web3.js'
import dynamic from 'next/dynamic'
import { ReactNode, useCallback } from 'react'

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
  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  return (
    <ConnectionProvider endpoint={"http://localhost:8899"}>
      <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export function useAnchorProvider() {
  const connection = new Connection("http://localhost:8899", 'confirmed')
  const wallet = useWallet()

  return new AnchorProvider(connection, wallet as AnchorWallet, { commitment: 'confirmed' })
}

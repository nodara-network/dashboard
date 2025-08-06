'use client'

import { ReactQueryProvider } from './ReactQueryProvider'
import { ClusterProvider } from '@/components/cluster/cluster-data-access'
import { SolanaProvider } from '@/components/solana/SolanaProvider'
import { WebSocketProvider } from '@/contexts/WebSocketContext'
import React from 'react'
import { Toaster } from 'sonner'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReactQueryProvider>
      <ClusterProvider>
        <SolanaProvider>
          <WebSocketProvider>
            {children}
            <Toaster />
          </WebSocketProvider>
        </SolanaProvider>
      </ClusterProvider>
    </ReactQueryProvider>
  )
}

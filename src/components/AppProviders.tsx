'use client'

import { ReactQueryProvider } from './ReactQueryProvider'
import { ClusterProvider } from '@/components/cluster/cluster-data-access'
import { SolanaProvider } from '@/components/solana/SolanaProvider'
import React from 'react'
import { Toaster } from 'sonner'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReactQueryProvider>
      <ClusterProvider>
        <SolanaProvider>
          {children}
          <Toaster />
        </SolanaProvider>
      </ClusterProvider>
    </ReactQueryProvider>
  )
}

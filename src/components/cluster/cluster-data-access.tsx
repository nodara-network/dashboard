'use client'

import { clusterApiUrl, Connection } from '@solana/web3.js'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { createContext, ReactNode, useContext } from 'react'

export interface SolanaCluster {
  name: string
  endpoint: string
  network?: ClusterNetwork
  active?: boolean
}

export enum ClusterNetwork {
  Mainnet = 'mainnet-beta',
  Testnet = 'testnet',
  Devnet = 'devnet',
  Custom = 'custom',
}

// By default, we don't configure the mainnet-beta cluster
// The endpoint provided by clusterApiUrl('mainnet-beta') does not allow access from the browser due to CORS restrictions
// To use the mainnet-beta cluster, provide a custom endpoint
export const defaultClusters: SolanaCluster[] = [
  {
    name: 'devnet',
    endpoint: clusterApiUrl('devnet'),
    network: ClusterNetwork.Devnet,
  },
  { name: 'local', endpoint: 'http://localhost:8899' },
  {
    name: 'testnet',
    endpoint: clusterApiUrl('testnet'),
    network: ClusterNetwork.Testnet,
  },
]

const clusterAtom = atomWithStorage<SolanaCluster>('solana-cluster', defaultClusters[0])
const clustersAtom = atomWithStorage<SolanaCluster[]>('solana-clusters', defaultClusters)

const activeClustersAtom = atom<SolanaCluster[]>((get) => {
  const clusters = get(clustersAtom)
  const cluster = get(clusterAtom)
  return clusters.map((item) => ({
    ...item,
    active: item.name === cluster.name,
  }))
})

const activeClusterAtom = atom<SolanaCluster>((get) => {
  const clusters = get(activeClustersAtom)

  return clusters.find((item) => item.active) || clusters[0]
})

export function useCluster() {
  return {
    cluster: useAtomValue(activeClusterAtom),
    clusters: useAtomValue(activeClustersAtom),
    addCluster: useSetAtom(
      atom(null, (get, set, cluster: SolanaCluster) => {
        const clusters = get(clustersAtom)
        set(clustersAtom, [...clusters, cluster])
      })
    ),
    setCluster: useSetAtom(clusterAtom),
    deleteCluster: useSetAtom(
      atom(null, (get, set, cluster: SolanaCluster) => {
        const clusters = get(clustersAtom)
        set(
          clustersAtom,
          clusters.filter((item) => item.name !== cluster.name)
        )
      })
    ),
  }
}

export function getExplorerUrl(path: string, cluster?: SolanaCluster) {
  return `https://explorer.solana.com/${path}${getClusterUrlParam(cluster)}`
}

export function getClusterUrlParam(cluster?: SolanaCluster): string {
  let suffix = ''
  switch (cluster?.network) {
    case ClusterNetwork.Devnet:
      suffix = 'devnet'
      break
    case ClusterNetwork.Testnet:
      suffix = 'testnet'
      break
    default:
      break
  }

  return suffix.length ? `?cluster=${suffix}` : ''
}

const ClusterContext = createContext<{ cluster: SolanaCluster }>({
  cluster: defaultClusters[0],
})

export function ClusterProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster()

  const value = {
    cluster,
  }
  return <ClusterContext.Provider value={value}>{children}</ClusterContext.Provider>
}

export function useClusterContext() {
  return useContext(ClusterContext)
}

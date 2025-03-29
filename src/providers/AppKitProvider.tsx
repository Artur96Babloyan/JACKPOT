'use client'

import { wagmiAdapter, projectId } from '@/config/appkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'Jackpot',
  description: 'Web3 Lottery Application',
  url: 'https://jackpot.com',
  icons: ['https://jackpot.com/icon.png']
}

// Create AppKit instance
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const appKit = createAppKit({
  projectId,
  networks: [mainnet, arbitrum],
  metadata,
  adapters: [wagmiAdapter]
})

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
} 
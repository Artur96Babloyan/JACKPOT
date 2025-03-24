import { createWeb3Modal } from '@web3modal/wagmi/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig, chains } from '../../config/web3modal'
import { projectId } from '../../constants'

const queryClient = new QueryClient()

// Initialize Web3Modal
createWeb3Modal({ 
  wagmiConfig, 
  projectId,
  defaultChain: chains[0], // Ethereum mainnet
  includeWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e4ec99396d96', // MetaMask
    '4622a2b2d6af1c9844944291e5e7351a1aa24cd7b23099efac1b2fd875da31a0', // WalletConnect
  ],
  themeMode: 'dark',
  themeVariables: {
    '--w3m-z-index': 1000
  }
})

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
} 
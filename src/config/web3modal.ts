import { defaultWagmiConfig } from '@web3modal/wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { projectId } from '../constants'

export const chains = [mainnet, sepolia] as const

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata: {
    name: 'Jackpot DApp',
    description: 'A decentralized lottery application',
    url: 'https://jackpot-dapp.vercel.app',
    icons: ['https://jackpot-dapp.vercel.app/favicon.ico']
  }
}) 
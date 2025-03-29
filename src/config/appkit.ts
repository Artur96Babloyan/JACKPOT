// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'

// Get projectId from environment variable
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined. Please add NEXT_PUBLIC_REOWN_PROJECT_ID to your .env file')
}

// Define supported networks
export const networks = [mainnet, arbitrum]

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig 
'use client';

import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import { motion } from 'framer-motion'

export function WalletConnect() {
  const { open } = useWeb3Modal()
  const { address, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()

  const handleClick = async () => {
    if (address) {
      disconnect()
    } else {
      try {
        console.log('Opening Web3Modal...')
        console.log('Current window location:', window.location.origin)
        console.log('Project ID:', process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID)
        await open()
        console.log('Web3Modal opened successfully')
      } catch (error) {
        console.error('Failed to open Web3Modal:', error)
        // Show error to user
        alert('Failed to connect wallet. Please try again.')
      }
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={isConnecting}
      className="px-4 py-2 font-medium text-white transition-colors rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isConnecting ? (
        'Connecting...'
      ) : address ? (
        `${address.slice(0, 6)}...${address.slice(-4)}`
      ) : (
        'Connect Wallet'
      )}
    </motion.button>
  )
} 
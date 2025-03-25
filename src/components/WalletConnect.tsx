'use client';

import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { motion } from 'framer-motion';

export function WalletConnect() {
  const { open } = useWeb3Modal();
  const { address, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  const handleClick = async () => {
    if (address) {
      disconnect();
    } else {
      try {
        await open({ view: 'Connect' });
      } catch (error) {
        console.error('Failed to open Web3Modal:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isConnecting}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative px-6 py-3 rounded-full font-medium
        ${address 
          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-500/50'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
        }
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg hover:shadow-purple-500/20
        flex items-center space-x-2
      `}
    >
      {isConnecting ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Connecting...</span>
        </>
      ) : address ? (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Connect Wallet</span>
        </>
      )}
    </motion.button>
  );
} 
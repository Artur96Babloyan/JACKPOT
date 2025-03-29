'use client';

import { useAppKit } from '@reown/appkit/react';
import { motion } from 'framer-motion';
import { useAppKitAccount } from '@reown/appkit/react';

export function WalletConnect() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <motion.button
      onClick={() => open()}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative px-6 py-3 rounded-full font-medium
        ${isConnected 
          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-500/50'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
        }
        transition-all duration-300
        shadow-lg hover:shadow-purple-500/20
        flex items-center space-x-3
        backdrop-blur-sm
        group
      `}
    >
      {isConnected ? (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-mono text-sm">
            {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
          </span>
        </>
      ) : (
        <>
          <svg 
            className="w-5 h-5 transition-transform group-hover:rotate-12" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
          <span className="font-medium">Connect Wallet</span>
        </>
      )}
    </motion.button>
  );
} 
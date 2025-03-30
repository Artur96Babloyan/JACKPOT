'use client';

import { useAppKit } from '@reown/appkit/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppKitAccount } from '@reown/appkit/react';

export function WalletConnect() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.button
      onClick={() => open()}
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className={`
        relative px-2.5 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-1.5 md:py-2 lg:py-3 rounded-full font-medium text-xs sm:text-sm md:text-base
        ${isConnected 
          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-500/50'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
        }
        transition-all duration-300
        shadow-lg hover:shadow-purple-500/20
        flex items-center space-x-1.5 sm:space-x-2 md:space-x-3
        backdrop-blur-sm
        group
      `}
    >
      <AnimatePresence mode="wait">
        {isConnected ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3"
          >
            <motion.div 
              className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full"
              variants={pulseVariants}
              animate="animate"
            />
            <motion.span 
              className="font-mono text-[10px] sm:text-xs md:text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {`${address?.slice(0, 4)}...${address?.slice(-4)}`}
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3"
          >
            <motion.svg 
              className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform group-hover:rotate-12" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </motion.svg>
            <motion.span 
              className="font-medium"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Connect
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
} 
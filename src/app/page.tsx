'use client';

import { WalletConnect } from '@/components/WalletConnect';
import { useAccount } from 'wagmi';
import { useBalance } from '@/hooks/useBalance';
import { NumberSelector } from '@/components/NumberSelector';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const { address } = useAccount();
  const { balance, isLoading } = useBalance();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const handleNumbersSelected = (numbers: number[]) => {
    setSelectedNumbers(numbers);
    // Here you would typically handle the selected numbers (e.g., save to state, send to contract)
    console.log('Selected numbers:', numbers);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">J</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Jackpot
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WalletConnect />
          </motion.div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Decentralized Lottery
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of lottery with our decentralized platform. 
              Fair, transparent, and secure - powered by blockchain technology.
            </p>
          </motion.div>

          {/* Current Lottery Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <div className="text-4xl mb-2">🎲</div>
              <h4 className="text-lg font-medium text-purple-300">Current Draw</h4>
              <p className="text-3xl font-bold text-white">#123</p>
              <p className="text-sm text-gray-400">Next draw in 2 days</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <div className="text-4xl mb-2">💰</div>
              <h4 className="text-lg font-medium text-purple-300">Prize Pool</h4>
              <p className="text-3xl font-bold text-white">0.5 ETH</p>
              <p className="text-sm text-gray-400">Growing with each ticket</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <div className="text-4xl mb-2">🎫</div>
              <h4 className="text-lg font-medium text-purple-300">Tickets Sold</h4>
              <p className="text-3xl font-bold text-white">1,234</p>
              <p className="text-sm text-gray-400">This draw</p>
            </div>
          </motion.div>

          {/* Number Selection Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <NumberSelector onNumbersSelected={handleNumbersSelected} />
            {selectedNumbers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center"
              >
                <p className="text-purple-400">Your ticket numbers:</p>
                <div className="flex justify-center gap-2 mt-2">
                  {selectedNumbers.map((num) => (
                    <span key={num} className="px-3 py-1 bg-purple-500/20 rounded-full">
                      {num}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Wallet Info Section (Only shown when connected) */}
          {address && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-gray-700"
            >
              <h3 className="text-2xl font-semibold mb-6 text-purple-400">Your Wallet</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="font-mono">{address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="font-mono">{isLoading ? 'Loading...' : balance}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Fair & Transparent',
                description: 'Every draw is verifiable on the blockchain',
                icon: '🎲'
              },
              {
                title: 'Secure',
                description: 'Powered by smart contracts and cryptography',
                icon: '🔒'
              },
              {
                title: 'Instant Payouts',
                description: 'Winners receive their prizes immediately',
                icon: '💰'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-purple-400">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { NumberSelector } from './NumberSelector';
import { LanguageSelector } from './LanguageSelector';
import { WalletConnect } from './WalletConnect';
import { motion, AnimatePresence } from 'framer-motion';

export function HomePage() {
  const t = useTranslations();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const handleNumbersSelected = (numbers: number[]) => {
    setSelectedNumbers(numbers);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="flex justify-between items-center px-6 py-4 backdrop-blur-md bg-black/20 border-b border-white/10">
          <LanguageSelector />
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-20"
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text drop-shadow-lg">
            {t('lottery.title')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('lottery.description')}
          </p>
        </motion.div>

        {/* Steps Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-20"
        >
          {[
            { key: 'connect', title: t('lottery.steps.connect'), desc: t('common.connectWallet') },
            { key: 'buy', title: t('lottery.steps.buy'), desc: t('lottery.selectNumbers') },
            { key: 'win', title: t('lottery.steps.win'), desc: t('lottery.placeBet') }
          ].map((step, index) => (
            <motion.div
              key={step.key}
              variants={itemVariants}
              className="relative p-6 sm:p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-3xl border border-purple-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:border-purple-500/40"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                {index + 1}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-white">
                {step.title}
              </h3>
              <p className="text-base text-gray-400 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Number Selector Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-20">
          <NumberSelector onNumbersSelected={handleNumbersSelected} />
          <AnimatePresence>
            {selectedNumbers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 sm:mt-12 text-center"
              >
                <p className="text-lg sm:text-xl font-semibold text-gray-300 mb-6">
                  {t('lottery.numberSelector.selectedCount', { count: selectedNumbers.length })}
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                  {selectedNumbers.map((num) => (
                    <motion.div
                      key={num}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow duration-300"
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {[
            { key: 'fairness', icon: '🎲', title: t('lottery.features.fairness'), desc: t('lottery.features.fairnessDesc') },
            { key: 'security', icon: '🔒', title: t('lottery.features.security'), desc: t('lottery.features.securityDesc') },
            { key: 'instantPayout', icon: '💎', title: t('lottery.features.instantPayout'), desc: t('lottery.features.instantPayoutDesc') }
          ].map((feature) => (
            <motion.div
              key={feature.key}
              variants={itemVariants}
              className="p-6 sm:p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-3xl border border-purple-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:border-purple-500/40"
            >
              <div className="text-3xl sm:text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-base text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
} 
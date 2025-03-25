'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { NumberSelector } from './NumberSelector';
import { LanguageSelector } from './LanguageSelector';
import { JackpotDisplay } from './JackpotDisplay';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <LanguageSelector />
      <JackpotDisplay />
      
      <main className="container mx-auto px-4 py-8 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            {t('lottery.title')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            {t('lottery.description')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-16"
        >
          {[
            { key: 'connect', title: t('lottery.steps.connect'), desc: t('common.connectWallet') },
            { key: 'buy', title: t('lottery.steps.buy'), desc: t('lottery.selectNumbers') },
            { key: 'win', title: t('lottery.steps.win'), desc: t('lottery.placeBet') }
          ].map((step, index) => (
            <motion.div
              key={step.key}
              variants={itemVariants}
              className="relative p-4 sm:p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl border border-purple-500/20 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                {index + 1}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <NumberSelector onNumbersSelected={handleNumbersSelected} />
          <AnimatePresence>
            {selectedNumbers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 sm:mt-8 text-center"
              >
                <p className="text-base sm:text-lg font-semibold text-gray-300 mb-4">
                  {t('lottery.numberSelector.selectedCount', { count: selectedNumbers.length })}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                  {selectedNumbers.map((num) => (
                    <motion.div
                      key={num}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg shadow-purple-500/20"
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {[
            { key: 'fairness', icon: '🎲', title: t('lottery.features.fairness'), desc: t('lottery.features.fairnessDesc') },
            { key: 'security', icon: '🔒', title: t('lottery.features.security'), desc: t('lottery.features.securityDesc') },
            { key: 'instantPayout', icon: '💎', title: t('lottery.features.instantPayout'), desc: t('lottery.features.instantPayoutDesc') }
          ].map((feature) => (
            <motion.div
              key={feature.key}
              variants={itemVariants}
              className="p-4 sm:p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl border border-purple-500/20 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
} 
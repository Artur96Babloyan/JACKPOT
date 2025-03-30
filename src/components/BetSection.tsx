'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

interface BetSectionProps {
  selectedNumbers: number[];
  onPlaceBet: (amount: number) => void;
}

const MIN_BET = 2.4; // USDT
const MAX_BET = 1000; // USDT

export function BetSection({ selectedNumbers, onPlaceBet }: BetSectionProps) {
  const t = useTranslations();
  const [betAmount, setBetAmount] = useState<string>('');
  const [fundAmount, setFundAmount] = useState<string>('');
  const [isAddingFunds, setIsAddingFunds] = useState(false);

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBetAmount(value);
    }
  };

  const handleFundAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFundAmount(value);
    }
  };

  const handlePlaceBet = () => {
    const amount = parseFloat(betAmount);
    if (amount >= MIN_BET && amount <= MAX_BET) {
      onPlaceBet(amount);
    }
  };

  const handleAddFunds = () => {
    const amount = parseFloat(fundAmount);
    if (amount > 0) {
      // Here you would integrate with your payment provider
      console.log('Adding funds:', amount);
      setIsAddingFunds(false);
      setFundAmount('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-purple-500/20 shadow-xl">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
          {t('betting.title')}
        </h2>
        <p className="text-sm sm:text-base text-purple-400">
          {t('betting.ticketPrice')}
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
            {t('betting.betAmount')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={betAmount}
              onChange={handleBetAmountChange}
              placeholder="0.00"
              className="w-full px-4 py-2 sm:py-3 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {t('betting.currency')}
            </span>
          </div>
          <div className="mt-1 flex justify-between text-xs sm:text-sm text-gray-400">
            <span>{t('betting.minBet')}</span>
            <span>{t('betting.maxBet')}</span>
          </div>
        </div>

        {selectedNumbers.length > 0 && (
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
              {t('betting.selectedNumbers')}
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedNumbers.map((num) => (
                <span
                  key={num}
                  className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm sm:text-base"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handlePlaceBet}
            disabled={!betAmount || parseFloat(betAmount) < MIN_BET || parseFloat(betAmount) > MAX_BET}
            className="flex-1 px-4 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {t('betting.placeBet')}
          </button>
          <button
            onClick={() => setIsAddingFunds(true)}
            className="px-4 py-2 sm:py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
          >
            {t('betting.addFunds')}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAddingFunds && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {t('betting.addFundsTitle')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('betting.amount')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fundAmount}
                      onChange={handleFundAmountChange}
                      placeholder="0.00"
                      className="w-full px-4 py-2 bg-gray-800 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {t('betting.currency')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddFunds}
                    disabled={!fundAmount || parseFloat(fundAmount) <= 0}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {t('betting.confirm')}
                  </button>
                  <button
                    onClick={() => setIsAddingFunds(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
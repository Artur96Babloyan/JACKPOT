'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface NumberSelectorProps {
  onNumbersSelected: (numbers: number[]) => void;
}

export function NumberSelector({ onNumbersSelected }: NumberSelectorProps) {
  const t = useTranslations('lottery.numberSelector');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isThrowing, setIsThrowing] = useState(false);

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 6) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const quickPick = () => {
    const numbers = new Set<number>();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 49) + 1);
    }
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    setSelectedNumbers(sortedNumbers);
    onNumbersSelected(sortedNumbers);
  };

  const throwLuckyNumbers = async () => {
    setIsThrowing(true);
    
    // Special lucky number logic
    const luckyPrimes = [3, 7, 13, 19, 31, 37, 43];
    const zodiacNumbers = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48];
    
    // Ensure at least one lucky prime and one zodiac number
    const numbers = new Set<number>();
    numbers.add(luckyPrimes[Math.floor(Math.random() * luckyPrimes.length)]);
    numbers.add(zodiacNumbers[Math.floor(Math.random() * zodiacNumbers.length)]);
    
    // Fill remaining numbers randomly
    while (numbers.size < 6) {
      const num = Math.floor(Math.random() * 49) + 1;
      if (!numbers.has(num)) {
        numbers.add(num);
      }
    }
    
    // Add some delay for animation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    setSelectedNumbers(sortedNumbers);
    onNumbersSelected(sortedNumbers);
    setIsThrowing(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
        {t('selectNumbers')}
      </h2>
      
      <div className="grid grid-cols-7 gap-2 mb-6">
        {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => (
          <motion.button
            key={num}
            onClick={() => toggleNumber(num)}
            disabled={selectedNumbers.length >= 6 && !selectedNumbers.includes(num)}
            className={`
              w-10 h-10 rounded-lg font-semibold transition-all duration-200
              ${selectedNumbers.includes(num)
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                : selectedNumbers.length >= 6
                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white hover:shadow-lg hover:shadow-purple-500/10'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {num}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-300">
          {t('selectedCount', { count: selectedNumbers.length })}
        </div>
        <div className="flex gap-4">
          <motion.button
            onClick={quickPick}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('quickPick')}
          </motion.button>
          <motion.button
            onClick={throwLuckyNumbers}
            disabled={isThrowing}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isThrowing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              t('throwLucky')
            )}
          </motion.button>
        </div>
      </div>

      {selectedNumbers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-2"
        >
          {selectedNumbers.map((num) => (
            <div
              key={num}
              className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold"
            >
              {num}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
} 
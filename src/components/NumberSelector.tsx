'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NumberSelectorProps {
  onNumbersSelected: (numbers: number[]) => void;
  maxNumbers?: number;
  maxValue?: number;
}

export function NumberSelector({ 
  onNumbersSelected, 
  maxNumbers = 6, 
  maxValue = 49 
}: NumberSelectorProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isBetting, setIsBetting] = useState(false);
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hoveredNumber, setHoveredNumber] = useState<number | null>(null);

  const toggleNumber = (num: number) => {
    setSelectedNumbers(prev => {
      if (prev.includes(num)) {
        return prev.filter(n => n !== num);
      }
      if (prev.length < maxNumbers) {
        return [...prev, num];
      }
      return prev;
    });
  };

  const generateLuckyNumbers = () => {
    const lucky = new Set<number>();
    while (lucky.size < maxNumbers) {
      const num = Math.floor(Math.random() * maxValue) + 1;
      if (!lucky.has(num)) {
        lucky.add(num);
      }
    }
    return Array.from(lucky).sort((a, b) => a - b);
  };

  const handleBet = async () => {
    if (selectedNumbers.length !== maxNumbers) return;
    
    setIsBetting(true);
    setLuckyNumbers([]);
    
    // Simulate betting process with number reveal animation
    for (let i = 0; i < maxNumbers; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setLuckyNumbers(prev => [...prev, generateLuckyNumbers()[i]]);
    }
    
    // Combine user numbers with lucky numbers
    const allNumbers = [...selectedNumbers, ...luckyNumbers];
    onNumbersSelected(allNumbers);
    
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    setIsBetting(false);
  };

  const handleQuickPick = () => {
    const numbers = new Set<number>();
    while (numbers.size < maxNumbers) {
      numbers.add(Math.floor(Math.random() * maxValue) + 1);
    }
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    setSelectedNumbers(sortedNumbers);
  };

  const numberVariants = {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 15 }
    },
    hover: { 
      scale: 1.2,
      rotate: 5,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { 
      scale: 0.9,
      rotate: -5,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    selected: { 
      scale: 1.2,
      rotate: 0,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.03
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { 
      scale: 0.9,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const luckyNumberVariants = {
    initial: { 
      y: -100,
      opacity: 0,
      scale: 0.5,
      rotate: -180
    },
    animate: (index: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: index * 0.1,
        duration: 0.5
      }
    }),
    exit: {
      y: 100,
      opacity: 0,
      scale: 0.5,
      rotate: 180,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gray-800 rounded-2xl p-4 border border-gray-700 shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-purple-400">
          Select Your Numbers
        </h3>
        <div className="text-sm font-medium text-gray-300">
          {selectedNumbers.length}/{maxNumbers} numbers selected
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {Array.from({ length: maxValue }, (_, i) => i + 1).map((num) => (
          <motion.button
            key={num}
            variants={numberVariants}
            initial="initial"
            animate={selectedNumbers.includes(num) ? "selected" : "animate"}
            whileHover="hover"
            whileTap="tap"
            onHoverStart={() => setHoveredNumber(num)}
            onHoverEnd={() => setHoveredNumber(null)}
            onClick={() => toggleNumber(num)}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center text-base font-medium
              transition-all duration-200
              ${selectedNumbers.includes(num)
                ? 'bg-purple-500 text-white shadow-md'
                : selectedNumbers.length >= maxNumbers
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer'
              }
              ${hoveredNumber === num ? 'ring-2 ring-purple-400' : ''}
            `}
            disabled={selectedNumbers.length >= maxNumbers && !selectedNumbers.includes(num)}
          >
            {num}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
          onClick={handleQuickPick}
        >
          Quick Pick
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          disabled={selectedNumbers.length !== maxNumbers || isBetting}
          className={`
            px-4 py-2 rounded-full font-medium
            ${selectedNumbers.length === maxNumbers && !isBetting
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
            transition-all duration-200
          `}
          onClick={handleBet}
        >
          {isBetting ? 'Generating Lucky Numbers...' : 'Place Bet'}
        </motion.button>
      </div>

      <AnimatePresence>
        {selectedNumbers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-4 p-3 bg-purple-500/10 rounded-lg"
          >
            <h4 className="text-base font-medium text-purple-300 mb-2">
              Your Numbers:
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedNumbers.sort((a, b) => a - b).map((num) => (
                <motion.span
                  key={`selected-${num}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300"
                >
                  {num}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {luckyNumbers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-4 p-3 bg-pink-500/10 rounded-lg"
          >
            <h4 className="text-base font-medium text-pink-300 mb-2">
              Lucky Numbers:
            </h4>
            <div className="flex flex-wrap gap-2">
              {luckyNumbers.map((num, index) => (
                <motion.span
                  key={`lucky-${num}-${index}`}
                  custom={index}
                  variants={luckyNumberVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="px-2 py-1 rounded-full bg-pink-500/20 text-pink-300"
                >
                  {num}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-purple-500/10 animate-pulse" />
        </motion.div>
      )}
    </motion.div>
  );
} 
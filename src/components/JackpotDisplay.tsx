'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function JackpotDisplay() {
  const t = useTranslations('lottery');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-4 z-[40]"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl rounded-full" />
        <div className="relative p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl border border-purple-500/20 shadow-xl">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              {t('currentDraw.prizePool')}
            </h3>
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-lg rounded-full"
              />
              <p className="relative text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                $1,000,000
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-gray-400">
              <span className="animate-pulse">●</span>
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 
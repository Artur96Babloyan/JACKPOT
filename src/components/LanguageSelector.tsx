'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];


export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === locale);

  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
    setIsOpen(false);
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: 10,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0,
      y: 10,
      scale: 0.95
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    })
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-lg sm:rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/10"
      >
        <motion.span 
          className="text-base sm:text-lg md:text-xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {currentLanguage?.flag}
        </motion.span>
        <span className="text-gray-300 font-medium text-xs sm:text-sm md:text-base hidden sm:inline">{currentLanguage?.name}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-purple-400 text-[10px] sm:text-xs md:text-sm"
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 mt-2 w-[120px] sm:w-[140px] md:w-48 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg rounded-lg sm:rounded-xl border border-purple-500/20 shadow-xl overflow-hidden z-50"
          >
            {languages.map((lang, index) => (
              <motion.button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                variants={itemVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                className={`w-full flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-left transition-all duration-200 ${
                  lang.code === locale
                    ? 'bg-purple-500/20 text-purple-400 font-medium'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
                whileHover={{ x: 4 }}
              >
                <motion.span 
                  className="text-base sm:text-lg md:text-xl"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {lang.flag}
                </motion.span>
                <span className="text-xs sm:text-sm md:text-base truncate">{lang.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
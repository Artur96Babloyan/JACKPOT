import { motion } from 'framer-motion'
import { numberSelect } from '@/utils/animations'

interface NumberButtonProps {
  number: number
  isSelected: boolean
  onClick: () => void
}

export function NumberButton({ number, isSelected, onClick }: NumberButtonProps) {
  return (
    <motion.button
      variants={numberSelect}
      initial="initial"
      whileHover="hover"
      animate={isSelected ? "selected" : "initial"}
      onClick={onClick}
      className={`
        aspect-square rounded-xl text-base font-semibold
        transition-all duration-300
        ${isSelected
          ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg'
          : 'bg-white/10 hover:bg-white/20 text-gray-300'
        }
      `}
    >
      {number}
    </motion.button>
  )
} 
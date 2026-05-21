import { motion } from 'motion/react'
import { X, Heart, Check } from 'lucide-react'

interface ActionButtonsProps {
  onSkip: () => void
  onFavorite: () => void
  onWatched: () => void
  isFavorite: boolean
}

export default function ActionButtons({
  onSkip,
  onFavorite,
  onWatched,
  isFavorite,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-6 py-4 px-6">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSkip}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/30 text-red-500"
      >
        <X size={22} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onFavorite}
        className={`w-16 h-16 rounded-full flex items-center justify-center border transition-colors duration-200 ${
          isFavorite
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
            : 'bg-gray-500/10 border-gray-500/30 text-gray-400'
        }`}
      >
        <Heart
          size={26}
          className={isFavorite ? 'fill-amber-500' : ''}
        />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onWatched}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-green-500/10 border border-green-500/30 text-green-500"
      >
        <Check size={22} />
      </motion.button>
    </div>
  )
}

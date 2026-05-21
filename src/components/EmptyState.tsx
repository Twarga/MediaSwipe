import { motion } from 'motion/react'
import { CheckCircle, RefreshCw } from 'lucide-react'
import type { CategoryType } from '../types/media'

const categoryLabels: Record<CategoryType, string> = {
  movies: 'Movies',
  tvshows: 'TV Shows',
  books: 'Books',
}

interface EmptyStateProps {
  category: CategoryType
  watchedCount: number
  onReload: () => void
  loading?: boolean
}

export default function EmptyState({
  category,
  watchedCount,
  onReload,
  loading,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="flex flex-col items-center justify-center gap-3 text-center px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <CheckCircle size={56} className="text-watched" />
      </motion.div>
      <p className="text-white text-lg font-medium">
        You're all caught up on {categoryLabels[category]}!
      </p>
      <p className="text-gray-500 text-sm max-w-xs">
        You've watched {watchedCount} {watchedCount === 1 ? 'item' : 'items'} in this category.
        {watchedCount === 0 && ' Start swiping to build your history!'}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReload}
        disabled={loading}
        className="mt-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"
      >
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Loading...' : 'Load More'}
      </motion.button>
    </motion.div>
  )
}

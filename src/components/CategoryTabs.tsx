import { motion } from 'motion/react'
import { Film, Tv, BookOpen } from 'lucide-react'
import type { CategoryType } from '../types/media'

interface CategoryTabsProps {
  active: CategoryType
  onChange: (category: CategoryType) => void
  counts: { movies: number; tvshows: number; books: number }
}

const categories: { key: CategoryType; label: string; Icon: typeof Film }[] = [
  { key: 'movies', label: 'Movies', Icon: Film },
  { key: 'tvshows', label: 'TV Shows', Icon: Tv },
  { key: 'books', label: 'Books', Icon: BookOpen },
]

export default function CategoryTabs({ active, onChange, counts }: CategoryTabsProps) {
  return (
    <div className="flex border-b border-white/5 px-2">
      {categories.map(({ key, label, Icon }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 relative"
          >
            <Icon size={16} className={isActive ? 'text-accent' : 'text-gray-500'} />
            <span
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive ? 'text-accent' : 'text-gray-500'
              }`}
            >
              {label}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive
                  ? 'bg-accent/20 text-accent'
                  : 'bg-gray-500/10 text-gray-500'
              }`}
            >
              {(key === 'movies' ? counts.movies : key === 'tvshows' ? counts.tvshows : counts.books) > 0
                ? (key === 'movies' ? counts.movies : key === 'tvshows' ? counts.tvshows : counts.books)
                : ''}
            </span>
            {isActive && (
              <motion.div
                layoutId="category-underline"
                className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, X, Film, Tv, BookOpen } from 'lucide-react'
import { useMediaStore } from '../store/mediaStore'
import type { MediaType } from '../types/media'

const filters: { key: MediaType | 'all'; label: string; Icon: typeof Film }[] = [
  { key: 'all', label: 'All', Icon: Film },
  { key: 'movie', label: 'Movies', Icon: Film },
  { key: 'tvshow', label: 'TV Shows', Icon: Tv },
  { key: 'book', label: 'Books', Icon: BookOpen },
]

const typeColors: Record<MediaType, string> = {
  movie: 'bg-blue-500/20 text-blue-400',
  tvshow: 'bg-purple-500/20 text-purple-400',
  book: 'bg-emerald-500/20 text-emerald-400',
}

const typeLabels: Record<MediaType, string> = {
  movie: 'Movie',
  tvshow: 'TV Show',
  book: 'Book',
}

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useMediaStore()
  const [filter, setFilter] = useState<MediaType | 'all'>('all')

  const filtered = filter === 'all' ? favorites : favorites.filter((f) => f.type === filter)

  return (
    <div className="flex flex-col flex-1 px-4 pt-4">
      <h1 className="text-xl font-bold text-white mb-1">Favorites</h1>
      <p className="text-gray-500 text-sm mb-4">
        {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved for later
      </p>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {filters.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === key
                ? 'bg-accent text-white'
                : 'bg-surface-light text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
          <Heart size={48} className="text-gray-600" />
          <p className="text-gray-400 text-lg font-medium">No favorites yet</p>
          <p className="text-gray-500 text-sm">
            Tap the star icon while swiping to save media for later
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative rounded-xl overflow-hidden bg-surface aspect-[3/4] group"
              >
                {item.posterUrl ? (
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-light">
                    <span className="text-gray-600 text-xs">No Image</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <span
                  className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${typeColors[item.type]}`}
                >
                  {typeLabels[item.type]}
                </span>

                <button
                  onClick={() => toggleFavorite(item)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} className="text-white" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-medium leading-tight line-clamp-2">
                    {item.title}
                  </p>
                  {item.year > 0 && (
                    <p className="text-gray-400 text-[10px] mt-0.5">{item.year}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

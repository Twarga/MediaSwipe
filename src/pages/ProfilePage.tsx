import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useSpring, useInView } from 'motion/react'
import { Film, Tv, BookOpen, Trophy, Heart, ChevronDown, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMediaStore } from '../store/mediaStore'
import type { MediaItem } from '../types/media'

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const spring = useSpring(0, { stiffness: 60, damping: 15 })
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) spring.set(value)
  }, [inView, value, spring])

  useEffect(() => {
    return spring.on('change', (latest) => {
      if (ref.current) ref.current.textContent = `${Math.round(latest)}${suffix}`
    })
  }, [spring, suffix])

  return <span ref={ref}>{value}{suffix}</span>
}

function getMilestone(total: number): { emoji: string; message: string } {
  if (total === 0) return { emoji: '👋', message: 'Start swiping to track your media!' }
  if (total < 10) return { emoji: '🌱', message: 'You\'re just getting started!' }
  if (total < 25) return { emoji: '📚', message: 'Nice collection building!' }
  if (total < 50) return { emoji: '🎯', message: 'You\'re a media connoisseur!' }
  if (total < 100) return { emoji: '🔥', message: 'Legendary consumption!' }
  return { emoji: '👑', message: `${total}+ pieces of media consumed! Unbelievable!` }
}

function HistorySection({
  label,
  icon: Icon,
  items,
  color,
}: {
  label: string
  icon: typeof Film
  items: MediaItem[]
  color: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className={color} />
          <span className="text-sm font-medium text-white">{label}</span>
          <span className="text-xs text-gray-500">({items.length})</span>
        </div>
        {open ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />}
      </button>
      <AnimatePresence>
        {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-white/5"
        >
          {items.length === 0 ? (
            <p className="text-gray-500 text-xs p-3">Nothing watched yet</p>
          ) : (
            <div className="max-h-48 overflow-y-auto p-2 space-y-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5">
                  <div className="w-8 h-11 rounded overflow-hidden bg-surface-light flex-shrink-0">
                    {item.posterUrl ? (
                      <img src={item.posterUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[8px] text-gray-600">N/A</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{item.title}</p>
                    {item.year > 0 && <p className="text-[10px] text-gray-500">{item.year}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { getStats, watched, favorites } = useMediaStore()
  const stats = getStats()
  const milestone = getMilestone(stats.grandTotal)

  const statCards = [
    { label: 'Movies', value: stats.totalMovies, icon: Film, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'TV Shows', value: stats.totalTvShows, icon: Tv, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Books', value: stats.totalBooks, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ]

  return (
    <div className="flex flex-col flex-1 px-4 pt-4 pb-4 overflow-y-auto">
      <h1 className="text-xl font-bold text-white mb-4">Profile</h1>

      {/* Milestone */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-4 bg-accent/10 border border-accent/20 rounded-xl px-4 py-3"
      >
        <span className="text-2xl">{milestone.emoji}</span>
        <p className="text-sm text-accent font-medium">{milestone.message}</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-3 flex flex-col items-center gap-1`}>
            <Icon size={18} className={color} />
            <span className="text-2xl font-bold text-white">
              <AnimatedCounter value={value} />
            </span>
            <span className="text-[10px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Total card */}
      <motion.button
        whileHover={{ y: -2 }}
        onClick={() => navigate('/favorites')}
        className="flex items-center justify-between bg-gradient-to-r from-accent/20 to-accent-light/20 border border-accent/20 rounded-xl p-3 mb-4"
      >
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-accent" />
          <div>
            <p className="text-sm font-bold text-white">Total Consumed</p>
            <p className="text-[10px] text-gray-400">
              <AnimatedCounter value={stats.grandTotal} suffix=" media" />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Heart size={14} className="text-amber-500" />
          <span className="text-xs text-amber-400">{favorites.length} saved</span>
        </div>
      </motion.button>

      {/* History */}
      <h2 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Watched History</h2>
      <div className="space-y-1.5">
        <HistorySection label="Movies" icon={Film} items={watched.movies} color="text-blue-400" />
        <HistorySection label="TV Shows" icon={Tv} items={watched.tvshows} color="text-purple-400" />
        <HistorySection label="Books" icon={BookOpen} items={watched.books} color="text-emerald-400" />
      </div>
    </div>
  )
}

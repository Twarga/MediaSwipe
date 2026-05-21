import { useEffect, useCallback, useState, useRef } from 'react'
import { motion } from 'motion/react'
import Confetti from 'react-confetti'
import { useMediaStore } from '../store/mediaStore'
import CategoryTabs from '../components/CategoryTabs'
import SwipeCard from '../components/SwipeCard'
import ActionButtons from '../components/ActionButtons'
import EmptyState from '../components/EmptyState'
import type { MediaItem, CategoryType } from '../types/media'

const categoryWatchedKey: Record<CategoryType, keyof typeof watchedInit> = {
  movies: 'movies',
  tvshows: 'tvshows',
  books: 'books',
}

const watchedInit = { movies: 0, tvshows: 0, books: 0 }

function SwipePage() {
  const {
    currentCategory,
    queue,
    loading,
    error,
    watched,
    favorites,
    setCategory,
    swipeWatched,
    swipeSkipped,
    toggleFavorite,
    loadMore,
  } = useMediaStore()

  const [showConfetti, setShowConfetti] = useState(false)
  const prevHadItems = useRef(true)
  const hasShownConfetti = useRef<Record<string, boolean>>({})

  const items = queue[currentCategory]
  const currentItem = items[0]
  const isFavorite = currentItem ? favorites.some((f) => f.id === currentItem.id) : false

  const isComplete = !loading && !error && items.length === 0
  const prevComplete = useRef(false)

  useEffect(() => {
    if (items.length === 0 && !loading) {
      loadMore(currentCategory)
    }
  }, [currentCategory, items.length, loading, loadMore])

  useEffect(() => {
    if (isComplete && !prevComplete.current && !hasShownConfetti.current[currentCategory]) {
      setShowConfetti(true)
      hasShownConfetti.current[currentCategory] = true
      const timer = setTimeout(() => setShowConfetti(false), 4000)
      return () => clearTimeout(timer)
    }
    prevComplete.current = isComplete
  }, [isComplete, currentCategory])

  useEffect(() => {
    prevHadItems.current = items.length > 0
  }, [items.length])

  const handleSwipeRight = useCallback(
    (item: MediaItem) => swipeWatched(item),
    [swipeWatched]
  )

  const handleSwipeLeft = useCallback(
    (item: MediaItem) => swipeSkipped(item),
    [swipeSkipped]
  )

  const handleSkip = useCallback(() => {
    if (currentItem) swipeSkipped(currentItem)
  }, [currentItem, swipeSkipped])

  const handleWatched = useCallback(() => {
    if (currentItem) swipeWatched(currentItem)
  }, [currentItem, swipeWatched])

  const handleFavorite = useCallback(() => {
    if (currentItem) toggleFavorite(currentItem)
  }, [currentItem, toggleFavorite])

  const handleCategoryChange = useCallback(
    (cat: CategoryType) => {
      setCategory(cat)
      if (queue[cat].length === 0) {
        loadMore(cat)
      }
    },
    [setCategory, queue, loadMore]
  )

  const watchedCountThisCategory = watched[categoryWatchedKey[currentCategory]].length

  return (
    <div className="flex flex-col flex-1">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          colors={['#7c3aed', '#ec4899', '#22c55e', '#f59e0b', '#3b82f6']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 100 }}
        />
      )}

      <CategoryTabs
        active={currentCategory}
        onChange={handleCategoryChange}
        counts={{
          movies: watched.movies.length,
          tvshows: watched.tvshows.length,
          books: watched.books.length,
        }}
      />

      <div className="flex-1 flex items-center justify-center p-4 relative">
        {loading && items.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
            />
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        ) : error && items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => loadMore(currentCategory)}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : items.length > 0 ? (
          <div className="w-full max-w-sm mx-auto">
            <SwipeCard
              items={items}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />

            {items.length < 5 && !loading && (
              <div className="mt-2 text-center">
                <button
                  onClick={() => loadMore(currentCategory)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            category={currentCategory}
            watchedCount={watchedCountThisCategory}
            onReload={() => loadMore(currentCategory)}
            loading={loading}
          />
        )}

        {loading && items.length > 0 && (
          <div className="absolute top-4 right-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full"
            />
          </div>
        )}
      </div>

      {items.length > 0 && (
        <ActionButtons
          onSkip={handleSkip}
          onFavorite={handleFavorite}
          onWatched={handleWatched}
          isFavorite={isFavorite}
        />
      )}
    </div>
  )
}

export default SwipePage

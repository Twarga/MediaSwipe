import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MediaItem, MediaStats, CategoryType } from '../types/media'
import { getTrendingMovies } from '../api/imdbot'
import { getPopularShows } from '../api/tvmaze'
import { getPopularBooks } from '../api/openLibrary'

interface MediaStore {
  swipedIds: string[]
  watched: { movies: MediaItem[]; tvshows: MediaItem[]; books: MediaItem[] }
  skipped: MediaItem[]
  favorites: MediaItem[]
  queue: { movies: MediaItem[]; tvshows: MediaItem[]; books: MediaItem[] }
  currentCategory: CategoryType
  loading: boolean
  error: string | null

  setCategory: (category: CategoryType) => void
  swipeWatched: (item: MediaItem) => void
  swipeSkipped: (item: MediaItem) => void
  toggleFavorite: (item: MediaItem) => void
  loadMore: (category: CategoryType) => Promise<void>
  getStats: () => MediaStats
}

export const useMediaStore = create<MediaStore>()(
  persist(
    (set, get) => ({
      swipedIds: [],
      watched: { movies: [], tvshows: [], books: [] },
      skipped: [],
      favorites: [],
      queue: { movies: [], tvshows: [], books: [] },
      currentCategory: 'movies',
      loading: false,
      error: null,

      setCategory: (category) => set({ currentCategory: category }),

      swipeWatched: (item) => {
        const state = get()
        const category = item.type === 'book' ? 'books' : item.type === 'tvshow' ? 'tvshows' : 'movies'
        set({
          swipedIds: [...state.swipedIds, item.id],
          watched: { ...state.watched, [category]: [...state.watched[category], item] },
        })
      },

      swipeSkipped: (item) => {
        const state = get()
        set({
          swipedIds: [...state.swipedIds, item.id],
          skipped: [...state.skipped, item],
        })
      },

      toggleFavorite: (item) => {
        const state = get()
        const exists = state.favorites.find((f) => f.id === item.id)
        set({
          favorites: exists
            ? state.favorites.filter((f) => f.id !== item.id)
            : [...state.favorites, item],
        })
      },

      loadMore: async (category) => {
        const state = get()
        if (state.loading) return
        set({ loading: true, error: null })
        try {
          let results: MediaItem[] = []
          if (category === 'movies') results = await getTrendingMovies()
          else if (category === 'tvshows') results = await getPopularShows()
          else results = await getPopularBooks()

          const fresh = get()
          const filtered = results.filter((item) => !fresh.swipedIds.includes(item.id))
          const added = filtered.length
          set({
            queue: { ...fresh.queue, [category]: [...fresh.queue[category], ...filtered] },
            loading: false,
            error: added === 0 ? 'No more items found. Try another category.' : null,
          })
        } catch {
          set({ error: 'Failed to load media. Check your connection.', loading: false })
        }
      },

      getStats: () => {
        const state = get()
        return {
          totalMovies: state.watched.movies.length,
          totalTvShows: state.watched.tvshows.length,
          totalBooks: state.watched.books.length,
          grandTotal: state.watched.movies.length + state.watched.tvshows.length + state.watched.books.length,
          favoritesCount: state.favorites.length,
        }
      },
    }),
    { name: 'mediaswipe-store', version: 1 }
  )
)

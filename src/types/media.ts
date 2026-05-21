export type MediaType = 'movie' | 'tvshow' | 'book'

export type CategoryType = 'movies' | 'tvshows' | 'books'

export interface MediaItem {
  id: string
  title: string
  type: MediaType
  posterUrl: string
  year: number
  rating: number
  overview: string
  genres: string[]
}

export interface MediaStats {
  totalMovies: number
  totalTvShows: number
  totalBooks: number
  grandTotal: number
  favoritesCount: number
}

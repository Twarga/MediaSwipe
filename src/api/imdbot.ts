import type { MediaItem } from '../types/media'
import { safeImageUrl } from '../lib/utils'

const BASE_URL = 'https://imdb.iamidiotareyoutoo.com'

export async function searchMovies(query: string): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`)
    if (!res.ok) return []
    const data = await res.json()
    return (data.desc ?? []).map((item: Record<string, unknown>) => ({
      id: String(item.id ?? ''),
      title: String(item.name ?? item.title ?? 'Unknown'),
      type: 'movie' as const,
      posterUrl: safeImageUrl(String(item.image ?? '')),
      year: Number(item.year ?? item['@year'] ?? 0),
      rating: Number(item.rating ?? item['@rating'] ?? 0),
      overview: String(item.description ?? item['@plot'] ?? ''),
      genres: [],
    })).filter((m: MediaItem) => m.id && m.title !== 'Unknown')
  } catch {
    return []
  }
}

export async function getTrendingMovies(): Promise<MediaItem[]> {
  return searchMovies('movie+2025')
}

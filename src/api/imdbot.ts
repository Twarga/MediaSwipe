import type { MediaItem } from '../types/media'
import { safeImageUrl } from '../lib/utils'

const BASE_URL = 'https://imdb.iamidiotareyoutoo.com'

export async function searchMovies(query: string): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`)
    if (!res.ok) return []
    const data = await res.json()
    const items = data.description ?? data.desc ?? []
    return items.map((item: Record<string, unknown>) => ({
      id: String(item['#IMDB_ID'] ?? item.id ?? ''),
      title: String(item['#TITLE'] ?? item.title ?? item.name ?? 'Unknown'),
      type: 'movie' as const,
      posterUrl: safeImageUrl(String(item['#IMG_POSTER'] ?? item.image ?? '')),
      year: Number(item['#YEAR'] ?? item.year ?? 0),
      rating: Number(item['#RANK'] ? Math.max(0, 10 - Number(item['#RANK']) / 100) : item.rating ?? 0),
      overview: String(item['#AKA'] ?? item.description ?? item['@plot'] ?? ''),
      genres: [],
    })).filter((m: MediaItem) => m.id && m.title !== 'Unknown')
  } catch {
    return []
  }
}

const SEARCH_TERMS = ['popular+movie+2025', 'top+rated+movie', 'best+movie+2024', 'action+movie', 'comedy+movie']

export async function getTrendingMovies(): Promise<MediaItem[]> {
  const results = await Promise.allSettled(SEARCH_TERMS.map((t) => searchMovies(t)))
  const seen = new Set<string>()
  const all: MediaItem[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') {
      for (const item of r.value) {
        if (!seen.has(item.id)) {
          seen.add(item.id)
          all.push(item)
        }
      }
    }
  }
  return all
}

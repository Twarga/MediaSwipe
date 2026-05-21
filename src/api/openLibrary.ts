import type { MediaItem } from '../types/media'
import { safeImageUrl } from '../lib/utils'

const BASE_URL = 'https://openlibrary.org'

const PLACEHOLDER_COVER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect fill="%23333" width="200" height="300"/><text fill="%23999" font-size="14" text-anchor="middle" x="100" y="150">No Cover</text></svg>'

export async function searchBooks(query: string, sort?: string): Promise<MediaItem[]> {
  try {
    let url = `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=30`
    if (sort) url += `&sort=${encodeURIComponent(sort)}`
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    return (data.docs ?? []).map((doc: Record<string, unknown>) => ({
      id: String(doc.key ?? ''),
      title: String(doc.title ?? 'Unknown'),
      type: 'book' as const,
      posterUrl: doc.cover_i
        ? safeImageUrl(`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`, PLACEHOLDER_COVER)
        : PLACEHOLDER_COVER,
      year: Number(doc.first_publish_year ?? 0),
      rating: Number(doc.ratings_average ?? 0),
      overview: [doc.subtitle, doc.description].filter(Boolean).join(' - '),
      genres: (doc.subject as string[])?.slice(0, 5) ?? [],
    })).filter((m: MediaItem) => m.id && m.title !== 'Unknown')
  } catch {
    return []
  }
}

export async function getPopularBooks(): Promise<MediaItem[]> {
  return searchBooks('subject:fiction', 'rating')
}

export async function searchManga(): Promise<MediaItem[]> {
  return searchBooks('subject:manga')
}

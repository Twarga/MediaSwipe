import type { MediaItem } from '../types/media'

const BASE_URL = 'https://openlibrary.org'

const PLACEHOLDER_COVER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect fill="%23333" width="200" height="300"/><text fill="%23999" font-size="14" text-anchor="middle" x="100" y="150">No Cover</text></svg>'

export async function searchBooks(query: string): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=30`)
    if (!res.ok) return []
    const data = await res.json()
    return (data.docs ?? []).map((doc: Record<string, unknown>) => ({
      id: String(doc.key ?? ''),
      title: String(doc.title ?? 'Unknown'),
      type: 'book' as const,
      posterUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        : PLACEHOLDER_COVER,
      year: Number(doc.first_publish_year ?? 0),
      rating: Number(doc.ratings_average ?? 0),
      overview: [doc.subtitle, doc.description].filter(Boolean).join(' - '),
      genres: (doc.subject as string[])?.slice(0, 5) ?? [],
    })).filter((m: MediaItem) => m.id)
  } catch {
    return []
  }
}

export async function getPopularBooks(): Promise<MediaItem[]> {
  return searchBooks('subject:fiction&sort=rating')
}

export async function searchManga(): Promise<MediaItem[]> {
  return searchBooks('subject:manga')
}

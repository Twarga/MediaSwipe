import type { MediaItem } from '../types/media'

const BASE_URL = 'https://api.tvmaze.com'

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export async function searchShows(query: string): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.map((entry: { score: number; show: Record<string, unknown> }) => {
      const show = entry.show as Record<string, unknown>
      const image = show.image as Record<string, string> | null
      return {
        id: String(show.id ?? ''),
        title: String(show.name ?? 'Unknown'),
        type: 'tvshow' as const,
        posterUrl: image?.original ?? image?.medium ?? '',
        year: show.premiered ? Number(String(show.premiered).slice(0, 4)) : 0,
        rating: Number((show.rating as Record<string, number>)?.average ?? 0),
        overview: stripHtml(String(show.summary ?? '')),
        genres: (show.genres as string[]) ?? [],
      }
    }).filter((m: MediaItem) => m.id)
  } catch {
    return []
  }
}

export async function getPopularShows(): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/shows?page=0`)
    if (!res.ok) return []
    const data = await res.json()
    return data.slice(0, 50).map((show: Record<string, unknown>) => {
      const image = show.image as Record<string, string> | null
      return {
        id: String(show.id ?? ''),
        title: String(show.name ?? 'Unknown'),
        type: 'tvshow' as const,
        posterUrl: image?.original ?? image?.medium ?? '',
        year: show.premiered ? Number(String(show.premiered).slice(0, 4)) : 0,
        rating: Number((show.rating as Record<string, number>)?.average ?? 0),
        overview: stripHtml(String(show.summary ?? '')),
        genres: (show.genres as string[]) ?? [],
      }
    }).filter((m: MediaItem) => m.id)
  } catch {
    return []
  }
}

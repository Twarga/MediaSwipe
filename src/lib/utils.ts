export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatRating(rating: number): string {
  return rating > 0 ? rating.toFixed(1) : 'N/A'
}

export function safeImageUrl(url: string, fallback = ''): string {
  if (!url) return fallback
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') return url
    if (parsed.protocol === 'data:' && url.includes('svg')) return url
  } catch {
    return fallback
  }
  return fallback
}

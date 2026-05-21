export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatRating(rating: number): string {
  return rating > 0 ? rating.toFixed(1) : 'N/A'
}

import type { MediaItem } from '../types/media'
import { formatRating } from '../lib/utils'

interface MediaCardContentProps {
  item: MediaItem
}

export function MediaCardContent({ item }: MediaCardContentProps) {
  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden bg-surface">
      {item.posterUrl ? (
        <img
          src={item.posterUrl}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-surface-light">
          <span className="text-gray-500 text-lg">No Image</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
        <span className="text-amber-400 text-xs">★</span>
        <span className="text-white text-xs font-medium">{formatRating(item.rating)}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h2 className="text-white text-lg font-bold leading-tight mb-1">{item.title}</h2>
        {item.year > 0 && (
          <p className="text-gray-400 text-sm mb-2">{item.year}</p>
        )}
        {item.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/80"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

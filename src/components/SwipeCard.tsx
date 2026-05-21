import { useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform } from 'motion/react'
import type { MediaItem } from '../types/media'
import { MediaCardContent } from './MediaCardContent'

const SWIPE_THRESHOLD = 120

interface SwipeCardProps {
  items: MediaItem[]
  onSwipeLeft: (item: MediaItem) => void
  onSwipeRight: (item: MediaItem) => void
}

function SwipeableCard({
  item,
  onSwipeLeft,
  onSwipeRight,
  onExitComplete,
}: {
  item: MediaItem
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onExitComplete: () => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12])

  const rightOpacity = useTransform(x, [0, 100], [0, 1])
  const leftOpacity = useTransform(x, [-100, 0], [1, 0])

  const [exitX, setExitX] = useState<number | null>(null)

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      if (info.offset.x > SWIPE_THRESHOLD) {
        setExitX(500)
      } else if (info.offset.x < -SWIPE_THRESHOLD) {
        setExitX(-500)
      } else {
        x.set(0)
      }
    },
    [x]
  )

  if (exitX !== null) {
    return (
      <motion.div
        initial={false}
        animate={{ x: exitX, rotate: exitX > 0 ? 12 : -12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onAnimationComplete={() => {
          if (exitX > 0) onSwipeRight()
          else onSwipeLeft()
          onExitComplete()
        }}
        className="absolute inset-0"
      >
        <MediaCardContent item={item} />
      </motion.div>
    )
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      style={{ x, rotate }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="absolute inset-0 cursor-grab"
    >
      <MediaCardContent item={item} />

      <motion.div
        style={{ opacity: rightOpacity }}
        className="absolute top-8 left-8 z-10"
      >
        <span className="text-watched text-4xl font-black border-4 border-watched rounded-xl px-4 py-1 rotate-[-8deg] bg-black/30 backdrop-blur-sm">
          WATCHED
        </span>
      </motion.div>

      <motion.div
        style={{ opacity: leftOpacity }}
        className="absolute top-8 right-8 z-10"
      >
        <span className="text-skipped text-4xl font-black border-4 border-skipped rounded-xl px-4 py-1 rotate-[8deg] bg-black/30 backdrop-blur-sm">
          SKIP
        </span>
      </motion.div>
    </motion.div>
  )
}

export default function SwipeCard({
  items,
  onSwipeLeft,
  onSwipeRight,
}: SwipeCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const visibleItems = items.slice(currentIndex, currentIndex + 3)

  if (visibleItems.length === 0) return null

  const handleSwipeDone = () => setCurrentIndex((i) => i + 1)

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4]">
      {visibleItems
        .slice()
        .reverse()
        .map((item, i) => {
          const isFront = i === visibleItems.length - 1
          const scale = 1 - (visibleItems.length - 1 - i) * 0.05
          const y = (visibleItems.length - 1 - i) * 8

          return (
            <div
              key={item.id}
              className="absolute inset-0"
              style={{
                transform: isFront ? undefined : `scale(${scale}) translateY(${y}px)`,
                zIndex: i,
                pointerEvents: isFront ? 'auto' : 'none',
              }}
            >
              {isFront ? (
                <SwipeableCard
                  item={item}
                  onSwipeLeft={() => onSwipeLeft(item)}
                  onSwipeRight={() => onSwipeRight(item)}
                  onExitComplete={handleSwipeDone}
                />
              ) : (
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <MediaCardContent item={item} />
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}

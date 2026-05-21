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

  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null)

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      if (info.offset.x > SWIPE_THRESHOLD) setExitDir('right')
      else if (info.offset.x < -SWIPE_THRESHOLD) setExitDir('left')
      else x.set(0)
    },
    [x]
  )

  const handleExitComplete = useCallback(() => {
    if (exitDir === 'right') onSwipeRight()
    else onSwipeLeft()
    onExitComplete()
  }, [exitDir, onSwipeRight, onSwipeLeft, onExitComplete])

  if (exitDir) {
    const exitX = exitDir === 'right' ? 500 : -500
    const exitRotate = exitDir === 'right' ? 12 : -12
    return (
      <motion.div
        initial={{ x: x.get(), rotate: rotate.get(), opacity: 1 }}
        animate={{ x: exitX, rotate: exitRotate, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 1 }}
        onAnimationComplete={handleExitComplete}
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
      dragElastic={0.7}
      style={{ x, rotate }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="absolute inset-0 cursor-grab"
    >
      <MediaCardContent item={item} />

      <motion.div
        style={{ opacity: rightOpacity }}
        className="absolute top-8 left-8 z-10 pointer-events-none"
      >
        <span className="text-watched text-4xl font-black border-4 border-watched rounded-xl px-4 py-1 -rotate-8 bg-black/30 backdrop-blur-sm block">
          WATCHED
        </span>
      </motion.div>

      <motion.div
        style={{ opacity: leftOpacity }}
        className="absolute top-8 right-8 z-10 pointer-events-none"
      >
        <span className="text-skipped text-4xl font-black border-4 border-skipped rounded-xl px-4 py-1 rotate-8 bg-black/30 backdrop-blur-sm block">
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

  const stack = visibleItems.slice().reverse()

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4]">
      {stack.map((item, i) => {
        const isFront = i === stack.length - 1
        const depth = stack.length - 1 - i
        const scale = 1 - depth * 0.05
        const y = depth * 8

        return (
          <div
            key={item.id}
            className="absolute inset-0"
            style={{ zIndex: i, pointerEvents: isFront ? 'auto' : 'none' }}
          >
            {isFront ? (
              <SwipeableCard
                item={item}
                onSwipeLeft={() => onSwipeLeft(item)}
                onSwipeRight={() => onSwipeRight(item)}
                onExitComplete={handleSwipeDone}
              />
            ) : (
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{ transform: `scale(${scale}) translateY(${y}px)` }}
              >
                <MediaCardContent item={item} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

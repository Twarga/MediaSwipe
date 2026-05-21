import { useLocation, useNavigate } from 'react-router-dom'
import { Layers, Heart, User } from 'lucide-react'
import { motion } from 'motion/react'

const tabs = [
  { path: '/', label: 'Swipe', Icon: Layers },
  { path: '/favorites', label: 'Favorites', Icon: Heart },
  { path: '/profile', label: 'Profile', Icon: User },
]

export default function TabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="flex items-center justify-around px-4 py-2 bg-black/80 backdrop-blur-lg border-t border-white/5">
      {tabs.map(({ path, label, Icon }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-0.5 py-1 px-4 relative"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`transition-colors duration-200 ${active ? 'text-accent' : 'text-gray-500'}`}
            >
              <Icon size={22} />
            </motion.div>
            <span className={`text-[10px] font-medium transition-colors duration-200 ${active ? 'text-accent' : 'text-gray-500'}`}>
              {label}
            </span>
            {active && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute -top-2 w-8 h-0.5 bg-accent rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}

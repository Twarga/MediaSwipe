import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import TabBar from './components/TabBar'
import SwipePage from './pages/SwipePage'
import FavoritesPage from './pages/FavoritesPage'
import ProfilePage from './pages/ProfilePage'

const pages = [
  { path: '/', Component: SwipePage },
  { path: '/favorites', Component: FavoritesPage },
  { path: '/profile', Component: ProfilePage },
]

function App() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-surface-dark to-surface">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col"
          >
            <Routes location={location}>
              {pages.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
      <TabBar />
    </div>
  )
}

export default App

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Professional from './pages/Professional'
import Info from './pages/Info'

function App() {
  const [activeTab, setActiveTab] = useState<'work' | 'info'>('work')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{ flex: 1, padding: '0 1.5rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'work' ? (
            <motion.div
              key="work"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Professional />
            </motion.div>
          ) : (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Info />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default App

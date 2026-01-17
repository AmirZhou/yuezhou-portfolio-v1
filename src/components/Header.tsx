import { motion } from 'framer-motion'

interface HeaderProps {
  activeTab: 'work' | 'info'
  onTabChange: (tab: 'work' | 'info') => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header style={{
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '900px',
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Name */}
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,1)' }}>
          Yue Zhou
        </div>
      </div>

      {/* Tab Navigation */}
      <nav style={{
        display: 'inline-flex',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '100px',
        padding: '4px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <TabButton
          active={activeTab === 'work'}
          onClick={() => onTabChange('work')}
        >
          Work
        </TabButton>
        <TabButton
          active={activeTab === 'info'}
          onClick={() => onTabChange('info')}
        >
          Info
        </TabButton>
      </nav>

      {/* LinkedIn */}
      <a
        href="https://www.linkedin.com/in/amir-zhou"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: '0.875rem',
          color: 'rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}
      >
        LinkedIn
        <span style={{ fontSize: '0.75rem' }}>↗</span>
      </a>
    </header>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        padding: '0.5rem 1.25rem',
        borderRadius: '100px',
        fontSize: '0.875rem',
        fontWeight: 500,
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
        color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
      }}
    >
      {children}
    </motion.button>
  )
}

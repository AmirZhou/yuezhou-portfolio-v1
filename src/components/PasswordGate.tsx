import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

interface PasswordGateProps {
  children: React.ReactNode
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true'
  })

  const verifyPassword = useMutation(api.auth.verifyPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const valid = await verifyPassword({ password })
      if (valid) {
        localStorage.setItem('admin_authenticated', 'true')
        setAuthenticated(true)
      } else {
        setError('Invalid password')
      }
    } catch {
      setError('Error verifying password')
    }
  }

  if (authenticated) {
    return <>{children}</>
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        maxWidth: '300px',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 500, color: 'rgba(255,255,255,1)' }}>
          Admin Access
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1rem',
          }}
        />
        {error && (
          <p style={{ color: '#ff6b6b', fontSize: '0.875rem' }}>{error}</p>
        )}
        <button
          type="submit"
          style={{
            padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Enter
        </button>
      </form>
    </div>
  )
}

import { motion } from 'framer-motion'

const friends = [
  {
    name: 'Rhailyn Jane Cona',
    role: 'Software Developer',
    website: 'rhailynjane.dev',
    url: 'https://rhailynjane.dev',
  },
]

export default function Info() {
  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          marginBottom: '4rem',
        }}
      >
        <div style={{
          fontSize: '0.625rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
          }} />
          About Me
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 400,
          lineHeight: 1.3,
          marginBottom: '2rem',
        }}>
          Beyond work, I run marathons<br />
          and chase <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>personal records.</span>
        </h1>
      </motion.section>

      {/* Section 1: Victoria Marathon - Image Left, Text Right */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center',
          marginBottom: '6rem',
        }}
      >
        <div>
          <img
            src="/2025-victoria-marathon.jpeg"
            alt="Victoria Marathon 2025"
            loading="eager"
            fetchPriority="high"
            style={{
              width: '100%',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        </div>
        <div>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 500,
            marginBottom: '0.5rem',
            color: 'rgba(255,255,255,0.9)',
          }}>
            Victoria Marathon
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '1rem',
          }}>
            October 2025 · Full Marathon · 3:11
          </p>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
          }}>
            The body breaks before the mind does.
          </p>
        </div>
      </motion.section>

      {/* Section 2: Calgary Marathon - Text Left, Image Right */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center',
          marginBottom: '6rem',
        }}
      >
        <div>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 500,
            marginBottom: '0.5rem',
            color: 'rgba(255,255,255,0.9)',
          }}>
            Calgary Marathon
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '1rem',
          }}>
            May 2025 · Half Marathon · 1:29
          </p>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
          }}>
            You don't find your limits. You set them.
          </p>
        </div>
        <div>
          <img
            src="/2025-calgary-marathon.jpeg"
            alt="Calgary Marathon 2025"
            style={{
              width: '100%',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          padding: '2rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '4rem',
        }}
      >
        <StatItem label="Marathons" value="2" />
        <StatItem label="Full Marathon PB" value="3:11" />
        <StatItem label="2024 Avg" value="14km/day" />
      </motion.section>

      {/* Friends */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{
          fontSize: '0.625rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
          }} />
          Friends
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
        }}>
          {friends.map((friend) => (
            <FriendCard key={friend.name} {...friend} />
          ))}
        </div>
      </motion.section>

      {/* Thanks */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          padding: '4rem 0 2rem',
        }}
      >
        <p style={{
          fontSize: '1.25rem',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.7)',
        }}>
          Thanks for stopping by!
        </p>
        <div style={{
          marginTop: '1rem',
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.5)',
        }}>
          — Yue
        </div>
      </motion.section>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '1.5rem',
        fontWeight: 300,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: '0.25rem',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'rgba(255,255,255,0.4)',
      }}>
        {label}
      </div>
    </div>
  )
}

function FriendCard({ name, role, website, url }: { name: string; role: string; website: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        textDecoration: 'none',
      }}
    >
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: '0.25rem',
      }}>
        {name}
      </h3>
      <p style={{
        fontSize: '0.875rem',
        color: 'rgba(255,255,255,0.4)',
        marginBottom: '0.75rem',
      }}>
        {role}
      </p>
      <span style={{
        fontSize: '0.875rem',
        color: 'rgba(255,255,255,0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
      }}>
        {website}
        <span style={{ fontSize: '0.75rem' }}>↗</span>
      </span>
    </a>
  )
}

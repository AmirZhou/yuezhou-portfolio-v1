import { motion } from 'framer-motion'

interface Video {
  title: string
  youtubeId: string
  publishedAt: string
}

const videos: Video[] = [
  // Add videos here when ready:
  // {
  //   title: 'My First Video',
  //   youtubeId: 'dQw4w9WgXcQ',
  //   publishedAt: '2026-01-15',
  // },
]

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

export default function VideosSection() {
  if (videos.length === 0) {
    return null
  }

  return (
    <section style={{ marginTop: '4rem' }}>
      <div style={{
        fontSize: '0.625rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: 'rgba(255,255,255,0.55)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.55)',
        }} />
        Videos
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        {videos.map((video, index) => (
          <motion.a
            key={video.youtubeId}
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{
              display: 'block',
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
            }}
          >
            <img
              src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
              alt={video.title}
              style={{
                width: '100%',
                aspectRatio: '16/9',
                objectFit: 'cover',
              }}
            />
            <div style={{ padding: '1rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,1)',
                marginBottom: '0.5rem',
              }}>
                {video.title}
              </h3>
              <p style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.55)',
              }}>
                {formatDate(video.publishedAt)}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}

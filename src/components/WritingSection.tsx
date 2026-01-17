import { useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { api } from '../../convex/_generated/api'

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

export default function WritingSection() {
  const posts = useQuery(api.posts.getPublishedPosts)

  if (!posts || posts.length === 0) {
    return null
  }

  const displayPosts = posts.slice(0, 5)

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
        Writing
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {displayPosts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              style={{
                display: 'block',
                padding: '1.25rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                textDecoration: 'none',
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
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,1)',
                marginBottom: '0.5rem',
              }}>
                {post.title}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.75)',
                marginBottom: '0.75rem',
                lineHeight: 1.5,
              }}>
                {post.excerpt}
              </p>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.55)',
                display: 'flex',
                gap: '0.75rem',
              }}>
                <span>{formatDate(post.publishedAt!)}</span>
                <span>·</span>
                <span>{calculateReadingTime(post.content)}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {posts.length > 5 && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link
            to="/blog"
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '0.875rem',
              textDecoration: 'underline',
            }}
          >
            View all posts →
          </Link>
        </div>
      )}
    </section>
  )
}

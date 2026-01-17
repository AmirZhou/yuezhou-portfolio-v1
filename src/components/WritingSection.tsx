import { useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { api } from '../../convex/_generated/api'

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min`
}

export default function WritingSection() {
  const posts = useQuery(api.posts.getPublishedPosts)

  if (!posts || posts.length === 0) {
    return null
  }

  const displayPosts = posts.slice(0, 6)

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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem',
      }}>
        {displayPosts.map((post: { _id: string; slug: string; title: string; excerpt: string; content: string; publishedAt?: number; coverImageUrl?: string | null }, index: number) => (
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
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                textDecoration: 'none',
                overflow: 'hidden',
                transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {post.coverImageUrl && (
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  overflow: 'hidden',
                }}>
                  <img
                    src={post.coverImageUrl}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              )}
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,1)',
                  marginBottom: '0.5rem',
                  lineHeight: 1.3,
                }}>
                  {post.title}
                </h3>
                <p style={{
                  fontSize: '0.8125rem',
                  color: 'rgba(255,255,255,0.75)',
                  marginBottom: '0.75rem',
                  lineHeight: 1.5,
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {post.excerpt}
                </p>
                <div style={{
                  fontSize: '0.6875rem',
                  color: 'rgba(255,255,255,0.55)',
                  display: 'flex',
                  gap: '0.5rem',
                }}>
                  <span>{formatDate(post.publishedAt!)}</span>
                  <span>·</span>
                  <span>{calculateReadingTime(post.content)}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {posts.length > 6 && (
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

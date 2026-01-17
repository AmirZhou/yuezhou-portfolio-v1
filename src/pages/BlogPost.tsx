import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Header from '../components/Header'
import Footer from '../components/Footer'

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = useQuery(api.posts.getPost, slug ? { slug } : 'skip')

  if (post === undefined) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
        <Header activeTab="work" onTabChange={() => {}} />
        <main style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '4rem 1.5rem',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.55)',
        }}>
          Loading...
        </main>
      </div>
    )
  }

  if (post === null) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
        <Header activeTab="work" onTabChange={() => {}} />
        <main style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '4rem 1.5rem',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Post not found</h1>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.55)' }}>
            ← Back to Work
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Header activeTab="work" onTabChange={() => {}} />

      <main style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
      }}>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            color: 'rgba(255,255,255,0.55)',
            fontSize: '0.875rem',
            marginBottom: '2rem',
          }}
        >
          ← Back to Work
        </Link>

        <article>
          <header style={{ marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 600,
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}>
              {post.title}
            </h1>
            <div style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.55)',
              display: 'flex',
              gap: '0.75rem',
            }}>
              <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}</span>
              <span>·</span>
              <span>{calculateReadingTime(post.content)}</span>
            </div>
          </header>

          <div style={{
            fontSize: '1.125rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.85)',
          }}>
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const isInline = !match
                  return isInline ? (
                    <code
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '0.2em 0.4em',
                        borderRadius: '4px',
                        fontSize: '0.9em',
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  )
                },
                h2: ({ children }) => (
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    marginTop: '2rem',
                    marginBottom: '1rem',
                  }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    marginTop: '1.5rem',
                    marginBottom: '0.75rem',
                  }}>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p style={{ marginBottom: '1.25rem' }}>{children}</p>
                ),
                ul: ({ children }) => (
                  <ul style={{
                    marginBottom: '1.25rem',
                    paddingLeft: '1.5rem',
                  }}>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol style={{
                    marginBottom: '1.25rem',
                    paddingLeft: '1.5rem',
                  }}>
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li style={{ marginBottom: '0.5rem' }}>{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote style={{
                    borderLeft: '3px solid rgba(255,255,255,0.3)',
                    paddingLeft: '1rem',
                    marginLeft: 0,
                    marginBottom: '1.25rem',
                    fontStyle: 'italic',
                    color: 'rgba(255,255,255,0.7)',
                  }}>
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'rgba(255,255,255,1)',
                      textDecoration: 'underline',
                    }}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link
            to="/"
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '0.875rem',
            }}
          >
            ← Back to Work
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

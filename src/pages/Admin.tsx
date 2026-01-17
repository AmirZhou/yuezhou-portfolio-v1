import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import PasswordGate from '../components/PasswordGate'
import MarkdownEditor from '../components/MarkdownEditor'

interface Post {
  _id: Id<'posts'>
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt?: number
}

function AdminContent() {
  const posts = useQuery(api.posts.getAllPosts) ?? []
  const createPost = useMutation(api.posts.createPost)
  const updatePost = useMutation(api.posts.updatePost)
  const deletePost = useMutation(api.posts.deletePost)

  const [selectedId, setSelectedId] = useState<Id<'posts'> | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')

  const selectedPost = posts.find((p: Post) => p._id === selectedId)

  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title)
      setSlug(selectedPost.slug)
      setExcerpt(selectedPost.excerpt)
      setContent(selectedPost.content)
    }
  }, [selectedPost])

  const handleNew = () => {
    setSelectedId(null)
    setTitle('')
    setSlug('')
    setExcerpt('')
    setContent('')
  }

  const handleSave = async (publish: boolean) => {
    if (selectedId) {
      await updatePost({ id: selectedId, title, slug, excerpt, content, publish })
    } else {
      const id = await createPost({ title, slug, excerpt, content, publish })
      setSelectedId(id)
    }
  }

  const handleDelete = async () => {
    if (selectedId && confirm('Delete this post?')) {
      await deletePost({ id: selectedId })
      handleNew()
    }
  }

  const inputStyle = {
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.875rem',
    width: '100%',
  }

  const buttonStyle = {
    padding: '0.5rem 1rem',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.875rem',
    cursor: 'pointer',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
      }}>
        <button onClick={handleNew} style={{ ...buttonStyle, width: '100%', marginBottom: '1rem' }}>
          + New Post
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {posts.map((post: Post) => (
            <button
              key={post._id}
              onClick={() => setSelectedId(post._id)}
              style={{
                ...buttonStyle,
                textAlign: 'left',
                background: selectedId === post._id ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: selectedId === post._id ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
              }}
            >
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>
                {post.title || 'Untitled'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                {post.publishedAt ? 'published' : 'draft'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            style={{ ...inputStyle, flex: 2 }}
          />
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug-url"
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>
        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief excerpt..."
          style={inputStyle}
        />
        <div style={{ flex: 1 }}>
          <MarkdownEditor
            key={selectedId ?? 'new'}
            initialContent={content}
            onChange={setContent}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          {selectedId && (
            <button onClick={handleDelete} style={{ ...buttonStyle, color: '#ff6b6b' }}>
              Delete
            </button>
          )}
          <button onClick={() => handleSave(false)} style={buttonStyle}>
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} style={{ ...buttonStyle, background: 'rgba(255,255,255,0.15)' }}>
            Publish
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  return (
    <PasswordGate>
      <AdminContent />
    </PasswordGate>
  )
}

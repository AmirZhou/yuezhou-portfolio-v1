import { useState } from 'react'
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

interface PostEditorProps {
  post: Post | null
  onSave: (data: { title: string; slug: string; excerpt: string; content: string }, publish: boolean) => Promise<void>
  onDelete: () => void
}

function PostEditor({ post, onSave, onDelete }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')

  const handleSave = async (publish: boolean) => {
    await onSave({ title, slug, excerpt, content }, publish)
  }

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
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
          initialContent={content}
          onChange={setContent}
        />
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        {post && (
          <button onClick={onDelete} style={{ ...buttonStyle, color: '#ff6b6b' }}>
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
  )
}

function AdminContent() {
  const posts = useQuery(api.posts.getAllPosts) ?? []
  const createPost = useMutation(api.posts.createPost)
  const updatePost = useMutation(api.posts.updatePost)
  const deletePost = useMutation(api.posts.deletePost)

  const [selectedId, setSelectedId] = useState<Id<'posts'> | null>(null)

  const selectedPost = posts.find((p: Post) => p._id === selectedId) ?? null

  const handleNew = () => {
    setSelectedId(null)
  }

  const handleSave = async (data: { title: string; slug: string; excerpt: string; content: string }, publish: boolean) => {
    if (selectedId) {
      await updatePost({ id: selectedId, ...data, publish })
    } else {
      const id = await createPost({ ...data, publish })
      setSelectedId(id)
    }
  }

  const handleDelete = async () => {
    if (selectedId && confirm('Delete this post?')) {
      await deletePost({ id: selectedId })
      handleNew()
    }
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

      {/* Editor - key forces remount when selection changes */}
      <PostEditor
        key={selectedId ?? 'new'}
        post={selectedPost}
        onSave={handleSave}
        onDelete={handleDelete}
      />
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

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
  coverImage?: Id<'_storage'>
  coverImageUrl?: string | null
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
  onSave: (data: { title: string; slug: string; excerpt: string; content: string; coverImage?: Id<'_storage'> }, publish: boolean) => Promise<void>
  onDelete: () => void
}

function PostEditor({ post, onSave, onDelete }: PostEditorProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [coverImage, setCoverImage] = useState<Id<'_storage'> | undefined>(post?.coverImage)
  const [coverPreview, setCoverPreview] = useState<string | null>(post?.coverImageUrl ?? null)
  const [uploading, setUploading] = useState(false)

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      const { storageId } = await result.json()
      setCoverImage(storageId)
      setCoverPreview(URL.createObjectURL(file))
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveCover = () => {
    setCoverImage(undefined)
    setCoverPreview(null)
  }

  const handleSave = async (publish: boolean) => {
    await onSave({ title, slug, excerpt, content, coverImage }, publish)
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

      {/* Cover Image Upload */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 1rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
      }}>
        {coverPreview ? (
          <>
            <img
              src={coverPreview}
              alt="Cover"
              style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <span style={{ flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              Cover image set
            </span>
            <button
              onClick={handleRemoveCover}
              style={{ ...buttonStyle, padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <span style={{ flex: 1, color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
              {uploading ? 'Uploading...' : 'No cover image'}
            </span>
            <label style={{ ...buttonStyle, cursor: 'pointer' }}>
              Upload Cover
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </label>
          </>
        )}
      </div>

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

  const handleSave = async (data: { title: string; slug: string; excerpt: string; content: string; coverImage?: Id<'_storage'> }, publish: boolean) => {
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

# Portfolio Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add color contrast improvements, a markdown blog system with Convex backend, and YouTube video integration to the portfolio site.

**Architecture:** React frontend with Convex backend for blog storage. Secret `/admin` route with password protection for blog editing. Markdown editor with live preview. YouTube videos as hardcoded array with thumbnail links.

**Tech Stack:** React 19, TypeScript, Vite, Convex, React Router, react-markdown, react-syntax-highlighter

---

## Phase 1: Color Contrast Improvements

### Task 1.1: Update Header Component Colors

**Files:**
- Modify: `src/components/Header.tsx`

**Step 1: Read current Header implementation**

Read the file to understand current opacity values.

**Step 2: Update opacity values**

Apply new color scale:
- Headings/active: 1.0 (was 0.9)
- Body/inactive: 0.55 (was lower)

**Step 3: Verify visually**

Run: `npm run dev`
Check header in browser - tabs should have clearer contrast.

**Step 4: Commit**

```bash
git add src/components/Header.tsx
git commit -m "style: improve header color contrast"
```

---

### Task 1.2: Update Footer Component Colors

**Files:**
- Modify: `src/components/Footer.tsx`

**Step 1: Read current Footer implementation**

**Step 2: Update opacity values**

Apply new color scale to footer text.

**Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "style: improve footer color contrast"
```

---

### Task 1.3: Update Professional Page Colors

**Files:**
- Modify: `src/pages/Professional.tsx`

**Step 1: Read current implementation**

**Step 2: Update opacity values throughout**

- Hero heading: 1.0
- "Software Engineer" text: 0.55
- Scroll indicator: 0.55

**Step 3: Commit**

```bash
git add src/pages/Professional.tsx
git commit -m "style: improve Professional page color contrast"
```

---

### Task 1.4: Update Info Page Colors

**Files:**
- Modify: `src/pages/Info.tsx`

**Step 1: Read current implementation**

**Step 2: Update opacity values throughout**

- Section labels: 0.55
- Headings: 1.0
- Italic accent: 0.85
- Body text: 0.75
- Dates/metadata: 0.55
- Stats values: 1.0
- Stats labels: 0.55

**Step 3: Commit**

```bash
git add src/pages/Info.tsx
git commit -m "style: improve Info page color contrast"
```

---

### Task 1.5: Update ProjectCard Colors

**Files:**
- Modify: `src/components/ProjectCard.tsx`

**Step 1: Read current implementation**

**Step 2: Update opacity values**

- Title: 1.0
- Description: 0.75
- Company/year metadata: 0.55

**Step 3: Commit**

```bash
git add src/components/ProjectCard.tsx
git commit -m "style: improve ProjectCard color contrast"
```

---

## Phase 2: Project Setup for Blog

### Task 2.1: Install Dependencies

**Step 1: Install Convex**

Run: `npx convex dev --once` to initialize, then:
```bash
npm install convex
```

**Step 2: Install React Router**

```bash
npm install react-router-dom
```

**Step 3: Install Markdown dependencies**

```bash
npm install react-markdown react-syntax-highlighter
npm install -D @types/react-syntax-highlighter
```

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add convex, react-router, markdown dependencies"
```

---

### Task 2.2: Initialize Convex

**Files:**
- Create: `convex/schema.ts`
- Create: `convex/tsconfig.json` (auto-generated)

**Step 1: Initialize Convex project**

Run: `npx convex init`

Follow prompts to create new Convex project.

**Step 2: Create schema**

Create `convex/schema.ts`:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"])
    .index("by_published", ["publishedAt"]),
});
```

**Step 3: Push schema**

Run: `npx convex dev --once`

**Step 4: Commit**

```bash
git add convex/
git commit -m "feat: initialize convex with posts schema"
```

---

### Task 2.3: Set Up Convex Provider

**Files:**
- Modify: `src/main.tsx`
- Create: `convex/_generated/` (auto-generated)

**Step 1: Update main.tsx**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from "convex/react"
import App from './App.tsx'
import './index.css'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </StrictMode>,
)
```

**Step 2: Add env variable**

Create `.env.local`:
```
VITE_CONVEX_URL=<your-convex-url>
```

**Step 3: Verify it runs**

Run: `npm run dev`
Should start without errors.

**Step 4: Commit**

```bash
git add src/main.tsx .env.local
git commit -m "feat: configure convex provider"
```

---

### Task 2.4: Set Up React Router

**Files:**
- Modify: `src/App.tsx`
- Create: `src/pages/BlogPost.tsx`
- Create: `src/pages/Admin.tsx`

**Step 1: Update App.tsx with router**

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Professional from './pages/Professional'
import Info from './pages/Info'
import BlogPost from './pages/BlogPost'
import Admin from './pages/Admin'

function Home() {
  const [activeTab, setActiveTab] = useState<'work' | 'info'>('work')

  return (
    <>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main style={{ flex: 1, padding: '0 1.5rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'work' ? (
            <motion.div
              key="work"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Professional />
            </motion.div>
          ) : (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Info />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
```

**Step 2: Create placeholder BlogPost.tsx**

```typescript
export default function BlogPost() {
  return <div>Blog Post (TODO)</div>
}
```

**Step 3: Create placeholder Admin.tsx**

```typescript
export default function Admin() {
  return <div>Admin (TODO)</div>
}
```

**Step 4: Verify routing works**

Run: `npm run dev`
Navigate to `/`, `/blog/test`, `/admin` - each should show respective content.

**Step 5: Commit**

```bash
git add src/App.tsx src/pages/BlogPost.tsx src/pages/Admin.tsx
git commit -m "feat: set up react router with blog and admin routes"
```

---

## Phase 3: Blog Backend (Convex)

### Task 3.1: Create Post Queries

**Files:**
- Create: `convex/posts.ts`

**Step 1: Create queries and mutations**

```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPublishedPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_published")
      .filter((q) => q.neq(q.field("publishedAt"), undefined))
      .order("desc")
      .collect();
  },
});

export const getPost = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getAllPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").collect();
  },
});

export const createPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    publish: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("posts", {
      title: args.title,
      slug: args.slug,
      content: args.content,
      excerpt: args.excerpt,
      publishedAt: args.publish ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updatePost = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    publish: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Post not found");

    await ctx.db.patch(args.id, {
      title: args.title,
      slug: args.slug,
      content: args.content,
      excerpt: args.excerpt,
      publishedAt: args.publish ? (existing.publishedAt ?? Date.now()) : undefined,
      updatedAt: Date.now(),
    });
  },
});

export const deletePost = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
```

**Step 2: Push to Convex**

Run: `npx convex dev --once`

**Step 3: Commit**

```bash
git add convex/posts.ts
git commit -m "feat: add convex posts queries and mutations"
```

---

### Task 3.2: Create File Upload Functions

**Files:**
- Create: `convex/files.ts`

**Step 1: Create file upload mutation**

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
```

**Step 2: Push to Convex**

Run: `npx convex dev --once`

**Step 3: Commit**

```bash
git add convex/files.ts
git commit -m "feat: add convex file upload functions"
```

---

### Task 3.3: Create Admin Password Check

**Files:**
- Create: `convex/auth.ts`

**Step 1: Create password verification**

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const verifyPassword = mutation({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error("ADMIN_PASSWORD not configured");
    }
    return args.password === adminPassword;
  },
});
```

**Step 2: Set environment variable in Convex dashboard**

Go to Convex dashboard → Settings → Environment Variables
Add: `ADMIN_PASSWORD` = your chosen password

**Step 3: Push to Convex**

Run: `npx convex dev --once`

**Step 4: Commit**

```bash
git add convex/auth.ts
git commit -m "feat: add admin password verification"
```

---

## Phase 4: Admin Editor Interface

### Task 4.1: Create Password Gate Component

**Files:**
- Create: `src/components/PasswordGate.tsx`

**Step 1: Create component**

```typescript
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
```

**Step 2: Commit**

```bash
git add src/components/PasswordGate.tsx
git commit -m "feat: add password gate component"
```

---

### Task 4.2: Create Markdown Editor Component

**Files:**
- Create: `src/components/MarkdownEditor.tsx`

**Step 1: Create component**

```typescript
import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

interface MarkdownEditorProps {
  initialContent?: string
  onChange: (content: string) => void
}

export default function MarkdownEditor({ initialContent = '', onChange }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [uploading, setUploading] = useState(false)

  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const getFileUrl = useMutation(api.files.getFileUrl)

  const handleChange = (value: string) => {
    setContent(value)
    onChange(value)
  }

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      const { storageId } = await result.json()
      const url = await getFileUrl({ storageId })

      const isImage = file.type.startsWith('image/')
      const markdown = isImage
        ? `![${file.name}](${url})`
        : `[${file.name}](${url})`

      handleChange(content + '\n' + markdown)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }, [content, generateUploadUrl, getFileUrl])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }, [handleFileUpload])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', height: '100%' }}>
      {/* Editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            padding: '0.5rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,255,255,0.2)',
            borderRadius: '8px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.55)',
            fontSize: '0.75rem',
          }}
        >
          {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
          <input
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload" style={{ cursor: 'pointer', marginLeft: '0.5rem', textDecoration: 'underline' }}>
            browse
          </label>
        </div>
        <textarea
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write your post in markdown..."
          style={{
            flex: 1,
            padding: '1rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.9)',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            resize: 'none',
            minHeight: '400px',
          }}
        />
      </div>

      {/* Preview */}
      <div style={{
        padding: '1rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        overflow: 'auto',
        minHeight: '400px',
      }}>
        <div className="prose" style={{ color: 'rgba(255,255,255,0.75)' }}>
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                const inline = !match
                return !inline ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/MarkdownEditor.tsx
git commit -m "feat: add markdown editor with preview and file upload"
```

---

### Task 4.3: Create Admin Page

**Files:**
- Modify: `src/pages/Admin.tsx`

**Step 1: Implement full Admin page**

```typescript
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import PasswordGate from '../components/PasswordGate'
import MarkdownEditor from '../components/MarkdownEditor'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function Admin() {
  return (
    <PasswordGate>
      <AdminContent />
    </PasswordGate>
  )
}

function AdminContent() {
  const posts = useQuery(api.posts.getAllPosts)
  const createPost = useMutation(api.posts.createPost)
  const updatePost = useMutation(api.posts.updatePost)
  const deletePost = useMutation(api.posts.deletePost)

  const [selectedId, setSelectedId] = useState<Id<"posts"> | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [autoSlug, setAutoSlug] = useState(true)

  const selectedPost = posts?.find(p => p._id === selectedId)

  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title)
      setSlug(selectedPost.slug)
      setExcerpt(selectedPost.excerpt)
      setContent(selectedPost.content)
      setAutoSlug(false)
    }
  }, [selectedPost])

  useEffect(() => {
    if (autoSlug && !selectedId) {
      setSlug(slugify(title))
    }
  }, [title, autoSlug, selectedId])

  const handleNew = () => {
    setSelectedId(null)
    setTitle('')
    setSlug('')
    setExcerpt('')
    setContent('')
    setAutoSlug(true)
  }

  const handleSave = async (publish: boolean) => {
    if (selectedId) {
      await updatePost({ id: selectedId, title, slug, excerpt, content, publish })
    } else {
      await createPost({ title, slug, excerpt, content, publish })
    }
    handleNew()
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
        padding: '1rem',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <button
          onClick={handleNew}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '6px',
            color: 'rgba(255,255,255,0.9)',
            cursor: 'pointer',
          }}
        >
          + New Post
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {posts?.map(post => (
            <button
              key={post._id}
              onClick={() => setSelectedId(post._id)}
              style={{
                padding: '0.5rem',
                background: selectedId === post._id ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: 'rgba(255,255,255,0.75)',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '0.875rem' }}>{post.title || 'Untitled'}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                {post.publishedAt ? 'Published' : 'Draft'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            style={{
              flex: 1,
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '1rem',
            }}
          />
          <input
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setAutoSlug(false) }}
            placeholder="slug"
            style={{
              width: '200px',
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.55)',
              fontSize: '0.875rem',
            }}
          />
        </div>

        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short excerpt for preview..."
          style={{
            padding: '0.5rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            color: 'rgba(255,255,255,0.75)',
            fontSize: '0.875rem',
          }}
        />

        <div style={{ flex: 1 }}>
          <MarkdownEditor
            key={selectedId || 'new'}
            initialContent={content}
            onChange={setContent}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          {selectedId && (
            <button
              onClick={handleDelete}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255,100,100,0.1)',
                border: '1px solid rgba(255,100,100,0.3)',
                borderRadius: '6px',
                color: 'rgba(255,100,100,0.9)',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          )}
          <button
            onClick={() => handleSave(false)}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.75)',
              cursor: 'pointer',
            }}
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.9)',
              cursor: 'pointer',
            }}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify admin page works**

Run: `npm run dev`
Navigate to `/admin`, enter password, create a test post.

**Step 3: Commit**

```bash
git add src/pages/Admin.tsx
git commit -m "feat: implement full admin page with post management"
```

---

## Phase 5: Public Blog Display

### Task 5.1: Create Writing Section Component

**Files:**
- Create: `src/components/WritingSection.tsx`

**Step 1: Create component**

```typescript
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
```

**Step 2: Commit**

```bash
git add src/components/WritingSection.tsx
git commit -m "feat: add writing section component for blog posts"
```

---

### Task 5.2: Add Writing Section to Professional Page

**Files:**
- Modify: `src/pages/Professional.tsx`

**Step 1: Import and add WritingSection**

Add import at top:
```typescript
import WritingSection from '../components/WritingSection'
```

Add after projects section (before closing `</div>`):
```typescript
<WritingSection />
```

**Step 2: Verify it appears**

Run: `npm run dev`
Create a published post in admin, verify it shows on Work page.

**Step 3: Commit**

```bash
git add src/pages/Professional.tsx
git commit -m "feat: add writing section to professional page"
```

---

### Task 5.3: Implement BlogPost Page

**Files:**
- Modify: `src/pages/BlogPost.tsx`

**Step 1: Implement full blog post page**

```typescript
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { api } from '../../convex/_generated/api'
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
      <>
        <Header activeTab="work" onTabChange={() => {}} />
        <main style={{ flex: 1, padding: '4rem 1.5rem', maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.55)' }}>Loading...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (post === null) {
    return (
      <>
        <Header activeTab="work" onTabChange={() => {}} />
        <main style={{ flex: 1, padding: '4rem 1.5rem', maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ color: 'rgba(255,255,255,1)', marginBottom: '1rem' }}>Post not found</h1>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.55)' }}>← Back to Work</Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header activeTab="work" onTabChange={() => {}} />
      <main style={{ flex: 1, padding: '0 1.5rem', maxWidth: '700px', margin: '0 auto', width: '100%' }}>
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ padding: '4rem 0' }}
        >
          <Link
            to="/"
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '2rem',
            }}
          >
            ← Back to Work
          </Link>

          <h1 style={{
            fontSize: '2rem',
            fontWeight: 500,
            color: 'rgba(255,255,255,1)',
            marginBottom: '1rem',
            lineHeight: 1.3,
          }}>
            {post.title}
          </h1>

          <div style={{
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: '3rem',
            display: 'flex',
            gap: '0.75rem',
          }}>
            <span>{formatDate(post.publishedAt!)}</span>
            <span>·</span>
            <span>{calculateReadingTime(post.content)}</span>
          </div>

          <div style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '1rem',
            lineHeight: 1.8,
          }}>
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 500, color: 'rgba(255,255,255,1)', marginTop: '2.5rem', marginBottom: '1rem' }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p style={{ marginBottom: '1.25rem' }}>{children}</p>
                ),
                a: ({ href, children }) => (
                  <a href={href} style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: '8px', margin: '1.5rem 0' }} />
                ),
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const inline = !match
                  return !inline ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ borderRadius: '8px', margin: '1.5rem 0' }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
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
                  )
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <div style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}>
            <Link
              to="/"
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              ← Back to Work
            </Link>
          </div>
        </motion.article>
      </main>
      <Footer />
    </>
  )
}
```

**Step 2: Verify blog post page**

Run: `npm run dev`
Click on a post from Writing section, verify it renders correctly.

**Step 3: Commit**

```bash
git add src/pages/BlogPost.tsx
git commit -m "feat: implement blog post page with markdown rendering"
```

---

## Phase 6: YouTube Integration

### Task 6.1: Create Videos Section Component

**Files:**
- Create: `src/components/VideosSection.tsx`

**Step 1: Create component**

```typescript
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
```

**Step 2: Commit**

```bash
git add src/components/VideosSection.tsx
git commit -m "feat: add videos section component"
```

---

### Task 6.2: Add Videos Section to Professional Page

**Files:**
- Modify: `src/pages/Professional.tsx`

**Step 1: Import and add VideosSection**

Add import at top:
```typescript
import VideosSection from '../components/VideosSection'
```

Add after WritingSection:
```typescript
<VideosSection />
```

**Step 2: Verify (section hidden since no videos)**

Run: `npm run dev`
Verify Work page loads without errors (Videos section should be hidden).

**Step 3: Commit**

```bash
git add src/pages/Professional.tsx
git commit -m "feat: add videos section to professional page"
```

---

## Phase 7: Final Verification

### Task 7.1: Build and Lint Check

**Step 1: Run build**

```bash
npm run build
```

Expected: Success, no errors.

**Step 2: Run lint**

```bash
npm run lint
```

Expected: No errors (warnings acceptable).

**Step 3: Manual verification**

- [ ] Color contrast improved across all pages
- [ ] Admin route works with password
- [ ] Can create, edit, publish, delete posts
- [ ] Writing section appears when posts exist
- [ ] Blog post page renders markdown correctly
- [ ] Videos section hidden (no videos yet)

**Step 4: Final commit if any fixes needed**

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1.1-1.5 | Color contrast improvements |
| 2 | 2.1-2.4 | Project setup (deps, Convex, router) |
| 3 | 3.1-3.3 | Blog backend (queries, files, auth) |
| 4 | 4.1-4.3 | Admin editor interface |
| 5 | 5.1-5.3 | Public blog display |
| 6 | 6.1-6.2 | YouTube integration |
| 7 | 7.1 | Final verification |

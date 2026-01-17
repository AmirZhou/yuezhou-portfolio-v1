# Portfolio Improvements Design

**Date:** 2026-01-17
**Status:** Approved

## Overview

This design covers three improvements to the portfolio site:
1. Color contrast improvements for better visual hierarchy
2. Blog system with markdown editor and Convex backend
3. YouTube video integration

---

## 1. Color Contrast System

### Updated Opacity Scale

| Level | Previous | New | Usage |
|-------|----------|-----|-------|
| Headings | 0.9 | **1.0** | Page titles, section headers, project titles |
| Italic accent | 0.7 | **0.85** | Highlighted soft text |
| Body | 0.6 | **0.75** | Descriptions, blog excerpts, paragraph text |
| Secondary | 0.4 | **0.55** | Dates, categories, metadata |
| Tertiary | 0.4 | **0.4** | Decorative elements only, use sparingly |

### Files to Update
- `src/pages/Professional.tsx`
- `src/pages/Info.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`

---

## 2. Blog System

### Site Structure

Work page sections (in order):
1. Hero (existing)
2. Projects (existing)
3. Writing (new) - blog post previews
4. Videos (new) - YouTube thumbnails

### Data Model

**Convex schema - `posts` table:**
```typescript
posts: defineTable({
  title: v.string(),
  slug: v.string(),
  content: v.string(), // markdown
  excerpt: v.string(),
  publishedAt: v.optional(v.number()), // null = draft
  createdAt: v.number(),
  updatedAt: v.number(),
})
```

**File storage:** Convex file storage for images, PDFs, and other uploads.

### Queries & Mutations

- `getPublishedPosts` - List posts for public view (where publishedAt exists)
- `getPost(slug)` - Single post by slug
- `getAllPosts` - All posts including drafts (for admin)
- `createPost` - New post
- `updatePost` - Edit existing
- `deletePost` - Remove post
- `uploadFile` - Handle media uploads

### Editor Interface

**Access:**
- Secret route at `/admin`
- Password gate checking against environment variable
- Session persisted in localStorage

**Layout:**
- Two-pane side-by-side: markdown textarea (left) + live preview (right)
- Toolbar: title input, slug input, Publish/Save Draft/Delete buttons, status indicator
- Drag-and-drop media upload zone
- Post list sidebar for navigating between posts

**Media Support:**
- Images (jpg, png, gif, webp)
- Code blocks with syntax highlighting (triple backticks + language)
- YouTube video embeds
- File uploads (PDFs, etc.)

### Public Display

**Writing section on Work page:**
- Section header with label style (small caps, dot indicator)
- 3-5 most recent post previews
- Each preview: title, excerpt, date, reading time
- Compact card style (no large images)
- "View all posts" link if > 5 posts
- Section hidden until first post published

**Individual post page (`/blog/[slug]`):**
- Back link to Work page
- Title (1.0 opacity)
- Meta: date, reading time (0.55 opacity)
- Rendered markdown with:
  - Heading hierarchy
  - Syntax-highlighted code blocks
  - Responsive images
  - Embedded YouTube videos
  - File download links
- Footer with back link

---

## 3. YouTube Integration

### Display

**Videos section on Work page (below Writing):**
- Section header with same label style
- Grid of video thumbnails (2-3 per row desktop, 1 mobile)
- Each card: thumbnail, title, date/duration
- Opens YouTube in new tab on click
- Section hidden until first video added

### Data Source

Hardcoded array in code (like current projects array):

```typescript
const videos = [
  {
    title: 'Video Title',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: '2026-01-15',
  },
]
```

---

## 4. New Dependencies

| Package | Purpose |
|---------|---------|
| `convex` | Backend, database, file storage |
| `react-router-dom` | Routing for `/blog/[slug]` and `/admin` |
| `react-markdown` | Render markdown content |
| `react-syntax-highlighter` | Code block syntax highlighting |

---

## 5. New Routes

| Route | Purpose |
|-------|---------|
| `/` | Home (Work page) |
| `/blog/:slug` | Individual blog post |
| `/admin` | Secret editor route (password protected) |

---

## Implementation Notes

- Empty states: Writing and Videos sections don't render until content exists
- Password stored as Convex environment variable
- File uploads return Convex storage URLs, inserted as markdown
- Slug auto-generated from title but editable
- Mobile responsive: editor stacks vertically, video grid becomes single column

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

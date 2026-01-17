import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

interface ProjectCardProps {
  title: string
  company: string
  year: string
  description: string
  image?: string
  link?: string
  priority?: boolean
}

export default function ProjectCard({
  title,
  company,
  year,
  description,
  image,
  link = '#',
  priority = false,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [scrollDistance, setScrollDistance] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerHeight = 280

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      const imgHeight = imgRef.current.naturalHeight
      const imgWidth = imgRef.current.naturalWidth
      const containerWidth = imgRef.current.offsetWidth || 400
      const scaledHeight = (containerWidth / imgWidth) * imgHeight
      const distance = Math.max(0, scaledHeight - containerHeight)
      setScrollDistance(distance)
    }
  }, [image])

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const containerWidth = img.offsetWidth || 400
    const scaledHeight = (containerWidth / img.naturalWidth) * img.naturalHeight
    const distance = Math.max(0, scaledHeight - containerHeight)
    setScrollDistance(distance)
  }

  return (
    <motion.a
      href={link}
      target={link.startsWith('http') ? '_blank' : undefined}
      rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'block',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
        borderRadius: '20px',
        overflow: 'hidden',
        border: `1px solid ${isHovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
        textDecoration: 'none',
        transition: 'border-color 0.3s ease',
        position: 'relative',
      }}
    >
      {/* Top-down lighting effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: '120px',
          background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)',
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0.7,
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,1)',
              marginBottom: '0.25rem',
              margin: 0,
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.55)',
              margin: 0,
            }}>
              {company}, '{year} — {description}
            </p>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>→</span>
        </div>
      </div>

      {/* Image */}
      <div style={{ padding: '0 1.5rem 1.5rem' }}>
        {image ? (
          <div
            style={{
              height: `${containerHeight}px`,
              overflow: 'hidden',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative',
            }}
          >
            <img
              ref={imgRef}
              src={image}
              alt={title}
              onLoad={handleImageLoad}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              style={{
                width: '100%',
                display: 'block',
                transform: isHovered ? `translateY(-${scrollDistance}px)` : 'translateY(0)',
                transition: isHovered
                  ? `transform ${Math.max(2, scrollDistance / 150)}s ease-in-out`
                  : 'transform 0.5s ease-out',
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              height: `${containerHeight}px`,
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '0.875rem',
            }}
          >
            Project Image
          </div>
        )}
      </div>
    </motion.a>
  )
}

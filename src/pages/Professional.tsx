import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'

const projects = [
  {
    title: 'Rural Alberta Health Connect',
    company: 'Healthcare',
    year: '24',
    description: 'Connecting rural communities to healthcare services.',
    image: '/rahc.jpeg',
    link: 'https://rahc-website.vercel.app',
  },
  {
    title: 'Selah',
    company: 'Productivity',
    year: '24',
    description: 'A tool for thoughtful planning.',
    image: '/selah.png',
    link: 'https://selah.paraflux.ca/',
  },
  {
    title: 'Nutritional Insight',
    company: 'Health',
    year: '24',
    description: 'Understanding what you eat.',
    image: '/nutrition-insight.jpeg',
    link: 'https://mango-forest-005595e10.3.azurestaticapps.net/',
  },
  {
    title: 'IMG to Markdown',
    company: 'Developer Tool',
    year: '24',
    description: 'Generate markdown links from images.',
    image: '/markdown-image-generator.png',
    link: 'https://img-md.paraflux.ca',
  },
]

export default function Professional() {
  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          padding: '4rem 0',
          marginBottom: '3rem',
        }}
      >
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 400,
          lineHeight: 1.2,
          marginBottom: '1.5rem',
        }}>
          I build products,<br />
          interactions & <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>experiences.</span>
        </h1>
        <p style={{
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.6)',
          maxWidth: '400px',
          margin: '0 auto',
        }}>
          Software Engineer.
        </p>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            marginTop: '3rem',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '1.5rem',
          }}
        >
          ↓
        </motion.div>
      </motion.section>

      {/* Projects */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProjectCard {...project} priority={index === 0} />
          </motion.div>
        ))}
      </section>
    </div>
  )
}

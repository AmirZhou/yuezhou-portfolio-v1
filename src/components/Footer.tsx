export default function Footer() {
  return (
    <footer style={{
      padding: '3rem 1.5rem',
      maxWidth: '900px',
      margin: '0 auto',
      width: '100%',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      marginTop: '4rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '2rem',
      }}>
        {/* Main Links */}
        <div style={{ display: 'flex', gap: '3rem' }}>
          <div>
            <div style={{
              fontSize: '0.625rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '0.75rem',
            }}>
              Main
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink href="#work">Work</FooterLink>
              <FooterLink href="#info">Info</FooterLink>
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '0.625rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '0.75rem',
            }}>
              Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink href="https://www.linkedin.com/in/amir-zhou" external>
                LinkedIn
              </FooterLink>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.4)',
      }}>
        © {new Date().getFullYear()} Yue Zhou.
      </div>
    </footer>
  )
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string
  external?: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
        fontSize: '0.875rem',
        color: 'rgba(255,255,255,0.7)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
    >
      {children}
      {external && <span style={{ fontSize: '0.75rem' }}>↗</span>}
    </a>
  )
}

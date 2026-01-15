# Full Component Implementations

## InsightCard

Card with icon, title, value, and hover effects.

```jsx
import { motion } from 'framer-motion';

const InsightCard = ({ icon, title, value, subtitle, color = "66,133,244" }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '1.25rem',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `rgba(${color}, 0.4)`;
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '0.25rem',
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '1.5rem',
        fontWeight: 600,
        color: `rgb(${color})`,
      }}>
        {value}
      </div>
      {subtitle && (
        <div style={{
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.4)',
          marginTop: '0.25rem',
        }}>
          {subtitle}
        </div>
      )}
    </motion.div>
  );
};
```

## DarkGlassSelect

Custom styled select dropdown.

```jsx
const DarkGlassSelect = ({ value, onChange, children, className }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <select
      value={value}
      onChange={onChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={className}
      style={{
        width: '100%',
        padding: '0.75rem 2.5rem 0.75rem 1rem',
        background: 'rgba(255, 255, 255, 0.06)',
        border: `1px solid ${isFocused ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '12px',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '0.9375rem',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='rgba(255,255,255,0.6)' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        transition: 'all 0.2s ease',
        boxShadow: isFocused
          ? '0 0 0 3px rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.2)'
          : 'none',
      }}
    >
      {children}
    </select>
  );
};
```

## PremiumTable

Animated table with hover effects.

```jsx
import { motion } from 'framer-motion';

const PremiumTable = ({ data, columns }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'rgba(255,255,255,0.5)',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <motion.tr
              key={row.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(66,133,244,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: '1rem',
                    fontSize: '0.9375rem',
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  {row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## LoadingSpinner

Animated loading indicator.

```jsx
const LoadingSpinner = ({ size = 40 }) => (
  <div
    style={{
      width: size,
      height: size,
      border: '3px solid rgba(255,255,255,0.1)',
      borderTopColor: 'rgb(66,133,244)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }}
  />
);

// Add to global CSS:
// @keyframes spin { to { transform: rotate(360deg); } }
```

## ProjectCard (Portfolio Style)

Card for showcasing projects.

```jsx
import { motion } from 'framer-motion';

const ProjectCard = ({ title, company, year, description, image, link }) => {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      style={{
        display: 'block',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '0.25rem',
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.5)',
            }}>
              {company}, '{year} — {description}
            </p>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>→</span>
        </div>
      </div>

      {/* Image */}
      <div style={{ padding: '0 1.5rem 1.5rem' }}>
        <img
          src={image}
          alt={title}
          style={{
            width: '100%',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />
      </div>
    </motion.a>
  );
};
```

## TabNavigation

Pill-style tab navigation.

```jsx
import { motion } from 'framer-motion';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div style={{
      display: 'inline-flex',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '100px',
      padding: '4px',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '100px',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === tab.id
              ? 'rgba(255,255,255,0.12)'
              : 'transparent',
            color: activeTab === tab.id
              ? 'rgba(255,255,255,0.9)'
              : 'rgba(255,255,255,0.5)',
          }}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
};
```

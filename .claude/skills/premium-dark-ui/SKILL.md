---
name: premium-dark-ui
description: Premium dark glassmorphic UI design system for React applications. Use this skill when building dark-themed interfaces with glass effects, rim lighting, multi-layer cards, and polished animations. Triggers on requests for dark mode UI, premium dashboards, glassmorphism, or professional portfolio sites.
---

# Premium Dark UI

A sophisticated dark UI design system featuring glassmorphism, rim lighting effects, and Framer Motion animations.

## Color System

### Backgrounds
```css
--bg-base: #0a0a0a;
--bg-elevated: #0f0f0f;
--bg-card: rgba(25, 25, 28, 0.75);
--bg-glass: rgba(255, 255, 255, 0.06);
```

### Text Hierarchy
```css
--text-primary: rgba(255, 255, 255, 0.9);
--text-secondary: rgba(255, 255, 255, 0.6);
--text-tertiary: rgba(255, 255, 255, 0.4);
```

### Borders & Accents
```css
--border-subtle: rgba(255, 255, 255, 0.1);
--border-medium: rgba(255, 255, 255, 0.15);
--border-strong: rgba(255, 255, 255, 0.25);
--accent-blue: rgb(66, 133, 244);
```

## Core Patterns

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.06);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 12px;
```

### Multi-Layer Shadow
```css
box-shadow:
  0 50px 100px rgba(0, 0, 0, 0.9),
  0 25px 50px rgba(0, 0, 0, 0.7),
  0 12px 25px rgba(0, 0, 0, 0.5);
```

### Focus States
```css
border: 1px solid rgba(255, 255, 255, 0.25);
box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08),
            0 4px 12px rgba(0, 0, 0, 0.2);
```

## Component Patterns

### 1. DarkGlassInput
```jsx
const DarkGlassInput = ({ type = "text", placeholder, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        width: '100%',
        padding: '0.75rem 1rem',
        background: 'rgba(255, 255, 255, 0.06)',
        border: `1px solid ${isFocused ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '12px',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '0.9375rem',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxShadow: isFocused
          ? '0 0 0 3px rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.2)'
          : 'none',
      }}
    />
  );
};
```

### 2. PremiumButton
```jsx
const PremiumButton = ({ variant = "primary", onClick, disabled, children }) => {
  const styles = {
    primary: {
      background: 'linear-gradient(135deg, rgba(66,133,244,0.3), rgba(66,133,244,0.1))',
      border: '1px solid rgba(66, 133, 244, 0.4)',
      color: 'rgb(66, 133, 244)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: 'rgba(255, 255, 255, 0.9)',
    }
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        fontSize: '0.9375rem',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease',
        ...styles[variant],
      }}
    >
      {children}
    </motion.button>
  );
};
```

### 3. MultiLayerCard (Rim Lighting)
```jsx
const MultiLayerCard = ({ children }) => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
    borderRadius: '24px',
    padding: '1px',
    position: 'relative',
  }}>
    {/* Rim lighting effect */}
    <div style={{
      position: 'absolute',
      inset: 0,
      borderRadius: '24px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      maskComposite: 'exclude',
      padding: '1px',
      pointerEvents: 'none',
    }} />

    <div style={{
      background: 'rgba(20, 20, 23, 0.8)',
      borderRadius: '23px',
      padding: '1.5rem',
    }}>
      {children}
    </div>
  </div>
);
```

### 4. StatsCard
```jsx
const StatsCard = ({ title, value, subtitle, color = "66,133,244" }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{
      fontSize: '2.5rem',
      fontWeight: 300,
      color: `rgb(${color})`,
      marginBottom: '0.5rem',
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: 'rgba(255,255,255,0.6)',
    }}>
      {title}
    </div>
    {subtitle && (
      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
        {subtitle}
      </div>
    )}
  </div>
);
```

## Animation Patterns

### Framer Motion Configs
```jsx
// Fade in from below
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Staggered children
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.03 } }
};

// Hover lift
const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2 } }
};

// Scale on interact
const scaleOnTap = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 }
};
```

### CSS Transitions
```css
transition: all 0.2s ease;
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

## Typography

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Display */ font-size: 2.5rem; font-weight: 300;
/* Heading */ font-size: 1.5rem; font-weight: 600;
/* Body */    font-size: 0.9375rem; font-weight: 400;
/* Small */   font-size: 0.75rem; font-weight: 500;
/* Mono */    font-family: monospace;
```

## Spacing Scale

```css
--space-xs: 0.5rem;   /* 8px */
--space-sm: 0.75rem;  /* 12px */
--space-md: 1rem;     /* 16px */
--space-lg: 1.5rem;   /* 24px */
--space-xl: 2rem;     /* 32px */
```

## Border Radius Scale

```css
--radius-sm: 8px;   /* badges, small elements */
--radius-md: 12px;  /* buttons, inputs */
--radius-lg: 20px;  /* cards */
--radius-xl: 24px;  /* premium cards */
```

## Resources

- See `references/components.md` for full component implementations
- See `references/tailwind-config.md` for Tailwind CSS configuration

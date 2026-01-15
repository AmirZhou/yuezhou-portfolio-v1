# Tailwind CSS Configuration

## tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          base: '#0a0a0a',
          elevated: '#0f0f0f',
          card: 'rgba(25, 25, 28, 0.75)',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          hover: 'rgba(255, 255, 255, 0.1)',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.15)',
          strong: 'rgba(255, 255, 255, 0.25)',
        },
        text: {
          primary: 'rgba(255, 255, 255, 0.9)',
          secondary: 'rgba(255, 255, 255, 0.6)',
          tertiary: 'rgba(255, 255, 255, 0.4)',
        },
        accent: {
          blue: 'rgb(66, 133, 244)',
          'blue-light': 'rgba(66, 133, 244, 0.3)',
        },
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '24px',
      },
      backdropBlur: {
        glass: '10px',
      },
      boxShadow: {
        'glass': '0 4px 12px rgba(0, 0, 0, 0.2)',
        'glass-focus': '0 0 0 3px rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.2)',
        'premium': '0 50px 100px rgba(0,0,0,0.9), 0 25px 50px rgba(0,0,0,0.7), 0 12px 25px rgba(0,0,0,0.5)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
```

## Global CSS (index.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base styles */
:root {
  --bg-base: #0a0a0a;
  --text-primary: rgba(255, 255, 255, 0.9);
  --text-secondary: rgba(255, 255, 255, 0.6);
  --accent-blue: rgb(66, 133, 244);
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Glass utilities */
@layer utilities {
  .glass {
    @apply bg-glass backdrop-blur-glass border border-border-subtle;
  }

  .glass-hover:hover {
    @apply bg-glass-hover border-border-medium;
  }

  .text-gradient {
    @apply bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent;
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Selection styling */
::selection {
  background: rgba(66, 133, 244, 0.3);
  color: white;
}
```

## Utility Classes

### Glass Components
```html
<!-- Glass card -->
<div class="bg-glass backdrop-blur-glass border border-border-subtle rounded-xl p-6">
  Content
</div>

<!-- Glass input -->
<input class="w-full px-4 py-3 bg-glass border border-border-subtle rounded-md
              text-text-primary placeholder-text-tertiary
              focus:border-border-strong focus:shadow-glass-focus
              transition-all duration-200" />

<!-- Glass button -->
<button class="px-6 py-3 bg-glass border border-border-subtle rounded-md
               text-text-primary hover:bg-glass-hover
               transition-all duration-200">
  Button
</button>
```

### Text Hierarchy
```html
<h1 class="text-4xl font-light text-text-primary">Display</h1>
<h2 class="text-2xl font-semibold text-text-primary">Heading</h2>
<p class="text-base text-text-secondary">Body text</p>
<span class="text-sm text-text-tertiary">Caption</span>
```

### Accent Variants
```html
<!-- Blue accent button -->
<button class="px-6 py-3 bg-accent-blue-light border border-accent-blue/40
               rounded-md text-accent-blue">
  Primary Action
</button>
```

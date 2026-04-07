/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'theme-bg-primary': 'var(--bg-primary)',
        'theme-bg-secondary': 'var(--bg-secondary)',
        'theme-bg-tertiary': 'var(--bg-tertiary)',
        'theme-text-primary': 'var(--text-primary)',
        'theme-text-secondary': 'var(--text-secondary)',
        'theme-text-tertiary': 'var(--text-tertiary)',
        'theme-border': 'var(--border-color)',
        'theme-card': 'var(--card-bg)',
        'theme-input': 'var(--input-bg)',
      },
    },
  },
  plugins: [],
}


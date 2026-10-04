/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#03060d',
        surface: '#0b1320',
        elevated: '#111e33',
        line: '#1c2d47',
        cyan: '#00e5e0',
        'cyan-dim': '#00b8b4',
        faint: '#4e6178',
        mute: '#7d8ea3',
        paper: '#e8f0f8',
        amber: '#f59e0b',
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
        display: ['"Big Shoulders Display"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

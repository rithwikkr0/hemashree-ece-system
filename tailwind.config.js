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
        ece: {
          bg: '#05080c',
          obsidian: '#0a0f16',
          graphite: '#0e1622',
          surface: '#131e2d',
          border: 'rgba(0, 240, 255, 0.18)',
          'border-active': 'rgba(0, 240, 255, 0.6)',
          cyan: '#00f0ff',
          'cyan-dim': 'rgba(0, 240, 255, 0.12)',
          'cyan-glow': 'rgba(0, 240, 255, 0.35)',
          orange: '#ff7b00',
          'orange-dim': 'rgba(255, 123, 0, 0.15)',
          'orange-glow': 'rgba(255, 123, 0, 0.4)',
          green: '#00ff88',
          'green-dim': 'rgba(0, 255, 136, 0.15)',
          amber: '#ffb703',
          red: '#ff3366',
          text: '#e2e8f0',
          'text-dim': '#94a3b8',
          'text-faint': '#475569',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'Menlo', 'monospace'],
        tech: ['"Space Grotesk"', '"Chakra Petch"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(rgba(0, 240, 255, 0.08) 1px, transparent 1px)',
        'pcb-trace': 'linear-gradient(90deg, transparent 0%, rgba(0, 240, 255, 0.2) 50%, transparent 100%)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'trace-flow': 'traceFlow 4s linear infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        traceFlow: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
      boxShadow: {
        'hud-cyan': '0 0 20px rgba(0, 240, 255, 0.15), inset 0 0 15px rgba(0, 240, 255, 0.05)',
        'hud-orange': '0 0 20px rgba(255, 123, 0, 0.2), inset 0 0 15px rgba(255, 123, 0, 0.05)',
        'glow-cyan': '0 0 30px rgba(0, 240, 255, 0.35)',
      },
    },
  },
  plugins: [],
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// vite.config.js
export default {
  plugins: [
    tailwindcss(),
  ],
  base: "./",
  server: {
    proxy: {
      '/api': {
        target: 'https://live-ucla-dining.pantheonsite.io',
        changeOrigin: true,
        secure: false, // If the target server uses HTTP (not HTTPS)
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: remove /api from the request path
      },
    },
  },
};

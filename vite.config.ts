import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// Relative assets work at /Info/, another repository path, or a custom domain.
export default defineConfig({ plugins: [react(), tailwindcss()], base: './' })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allows your Vite dev server to be accessed by your ngrok URL
    host: true,
    allowedHosts: [
      '.ngrok-free.dev',
      '6ca7520ac28f.gemini-2.5-flash-free.app',
      'http://localhost:5174',
      //'kpr-hackathon-st79zzkrj-agilessshobika-gmailcoms-projects.vercel.app'
    ],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

"""
Archivo: vite.config.ts
Vite es como el 'motor' rápido de nuestro coche (React).
Aquí le decimos al motor que tiene que estar listo para entender código de React.
"""
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Exportamos la configuración para que el motor la lea cuando arranque.
export default defineConfig({
  // Le agregamos el 'plugin' (la pieza extra) para que funcione con React.
  plugins: [react()],
})

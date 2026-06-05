/**
 * Punto de entrada principal de la aplicación React (Frontend).
 * Piensa en este archivo como la "puerta principal" de la casa.
 * Aquí es donde la aplicación "despierta" y se pinta en la pantalla.
 */
// Importamos herramientas básicas de React para arrancar.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Importamos el archivo de estilos globales (colores de fondo, tipos de letra, etc.)
import './index.css'

// Importamos la aplicación principal, que es como el plano de la casa.
import App from './App.tsx'

// Importamos el "Proveedor de Autenticación", que se asegura de saber si el usuario tiene llave (inició sesión).
import { AuthProvider } from './context/AuthContext'

// Aquí le decimos a React: "Busca un elemento en la página web que se llame 'root' y dibuja nuestra app ahí".
createRoot(document.getElementById('root')!).render(
  // StrictMode es como un inspector de seguridad que nos avisa si escribimos código viejo o con errores.
  <StrictMode>
    {/* AuthProvider abraza a la App para que todo el sitio sepa quién inició sesión */}
    <AuthProvider>
      {/* ¡Y finalmente aquí ponemos nuestra aplicación principal! */}
      <App />
    </AuthProvider>
  </StrictMode>,
)

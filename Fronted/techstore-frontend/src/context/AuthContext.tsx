/**
 * Contexto de Autenticación Global (React Context API).
 * Imagina que este archivo es un "brazalete VIP" invisible que
 * se le pone al usuario. Cualquier parte de la app puede ver si
 * lo tiene puesto (está logueado) o si no lo tiene.
 */
// Importamos herramientas de React. 'createContext' crea el brazalete.
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { LoginFormData } from '../types/login';

// Definimos qué información trae la "tarjeta de identificación" del usuario.
interface User {
  id: number;
  email: string;
  username: string;
  is_staff: boolean;
}

// Definimos qué poderes y cosas tiene este "brazalete VIP"
interface AuthContextType {
  user: User | null; // La información del usuario (o null si no hay nadie)
  isLoading: boolean; // ¿Estamos todavía revisando si el usuario tiene permiso?
  login: (datos: LoginFormData) => Promise<void>; // Función para entrar
  logout: () => void; // Función para salir
}

// Creamos el contexto (la caja mágica que guarda la información)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proveedor de Autenticación.
 * Este componente "abraza" a nuestra aplicación y le reparte los brazaletes VIP.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 'user' guarda la info de la persona. Empieza en null (nadie).
  const [user, setUser] = useState<User | null>(null);
  
  // 'isLoading' es true mientras la app despierta y busca si había alguien logueado ayer.
  const [isLoading, setIsLoading] = useState(true);

  // Revisa si hay un token válido (llave) al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      // Buscamos las llaves guardadas en el navegador (localStorage es como la memoria del navegador).
      let token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      // Si encontramos una llave (token)...
      if (token) {
        try {
          // Tocamos a la puerta del servidor ("http://localhost:8000/api/auth/me/")
          // y le mostramos nuestra llave (Authorization: Bearer token) para saber quiénes somos.
          let res = await fetch('http://localhost:8000/api/auth/me/', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Si el servidor dice "Tu llave principal caducó (Error 401)", pero tenemos una llave de repuesto (refresh)...
          if (res.status === 401 && refreshToken) {
            // Vamos con el cerrajero del servidor y pedimos una llave nueva.
            const refreshRes = await fetch('http://localhost:8000/api/auth/refresh/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh: refreshToken }),
            });

            // Si el cerrajero nos da llaves nuevas...
            if (refreshRes.ok) {
              const newTokens = await refreshRes.json();
              const newAccessToken = String(newTokens.access); // Sacamos la llave nueva
              token = newAccessToken; // Actualizamos nuestra llave en uso
              localStorage.setItem('access_token', newAccessToken); // La guardamos en el navegador
              
              // Y volvemos a tocar la puerta para pedir nuestros datos, ahora con la llave nueva.
              res = await fetch('http://localhost:8000/api/auth/me/', {
                headers: { Authorization: `Bearer ${token}` }
              });
            }
          }

          // Si el servidor nos reconoce y nos abre...
          if (res.ok) {
            const data = await res.json();
            setUser(data); // ¡Guardamos los datos del usuario! Ya está dentro.
          } else {
            // Si nos rechaza de todas formas, botamos las llaves a la basura.
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        } catch (error) {
          console.error("Error validando la sesión:", error);
        }
      }
      // Ya terminamos de revisar, así que apagamos la pantalla de "cargando".
      setIsLoading(false);
    };

    checkAuth();
  }, []); // El '[]' vacío significa: "Haz esto SOLO UNA VEZ cuando cargues la página".

  // Esta es la función que se ejecuta cuando el usuario presiona "Entrar" en el Login.tsx
  const login = async (datos: LoginFormData) => {
    try {
      // Mandamos el correo y contraseña al servidor de Django.
      const res = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // SimpleJWT por defecto pide username y password, así que mandamos el email como si fuera el username.
        body: JSON.stringify({ username: datos.email.trim(), password: datos.password.trim() }),
      });

      // Si el servidor no nos abre...
      if (!res.ok) {
        throw new Error('Credenciales inválidas'); // ¡Lanzamos un error!
      }

      // Si sí nos abrió, nos da nuestras nuevas llaves mágicas (tokens).
      const tokens = await res.json();
      
      // Guardamos esas llaves en el navegador para que no se pierdan si cerramos la pestaña.
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);

      // Ahora que tenemos llaves, le decimos al servidor: "Dime quién soy".
      const meRes = await fetch('http://localhost:8000/api/auth/me/', {
        headers: {
          Authorization: `Bearer ${tokens.access}`
        }
      });

      // Guardamos la información que nos regresa.
      if (meRes.ok) {
        const userData = await meRes.json();
        setUser(userData); // ¡Listo! El usuario ya tiene su brazalete VIP.
      }
    } catch (error) {
      console.error(error);
      throw error; // Lanzamos el error para que Login.tsx pueda pintar la alerta roja.
    }
  };

  // Esta función es para cuando apretamos el botón de "Salir"
  const logout = () => {
    // Tiramos las llaves a la basura.
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Le quitamos el brazalete VIP al usuario (lo ponemos en null).
    setUser(null);
  };

  return (
    // Esto es lo que "abraza" a la app y le da acceso a las funciones y estado del usuario.
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Esta es una herramienta rápida (Hook) para que cualquier componente (como App.tsx o Dashboard)
// pueda decir: "Oye, dame la información del usuario" escribiendo solo const { user } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

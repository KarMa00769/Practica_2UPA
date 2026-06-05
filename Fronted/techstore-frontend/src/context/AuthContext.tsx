import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { LoginFormData } from '../types/login';

interface User {
  id: number;
  email: string;
  username: string;
  is_staff: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (datos: LoginFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Revisa si hay un token válido al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (token) {
        try {
          let res = await fetch('http://localhost:8000/api/auth/me/', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Si el Access Token expiró pero tenemos un Refresh Token, intentamos renovarlo
          if (res.status === 401 && refreshToken) {
            const refreshRes = await fetch('http://localhost:8000/api/auth/refresh/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh: refreshToken }),
            });

            if (refreshRes.ok) {
              const newTokens = await refreshRes.json();
              const newAccessToken = String(newTokens.access); // El nuevo token
              token = newAccessToken;
              localStorage.setItem('access_token', newAccessToken);
              
              // Reintentamos obtener el perfil con el nuevo token
              res = await fetch('http://localhost:8000/api/auth/me/', {
                headers: { Authorization: `Bearer ${token}` }
              });
            }
          }

          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        } catch (error) {
          console.error("Error validando la sesión:", error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (datos: LoginFormData) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // En SimpleJWT por defecto se espera username y password. 
        // Si no has configurado el email como campo de inicio de sesión, debes pasar el email como username.
        body: JSON.stringify({ username: datos.email.trim(), password: datos.password.trim() }),
      });

      if (!res.ok) {
        throw new Error('Credenciales inválidas');
      }

      const tokens = await res.json();
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);

      // Ahora que tenemos token, obtenemos el perfil del usuario
      const meRes = await fetch('http://localhost:8000/api/auth/me/', {
        headers: {
          Authorization: `Bearer ${tokens.access}`
        }
      });

      if (meRes.ok) {
        const userData = await meRes.json();
        setUser(userData);
      }
    } catch (error) {
      console.error(error);
      throw error; // Para que el componente Login pueda mostrar el error
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

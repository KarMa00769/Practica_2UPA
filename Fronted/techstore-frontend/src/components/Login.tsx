/**
 * Componente Login.
 * Esta es la pantalla donde el usuario pone su correo y contraseña.
 * Piensa en este componente como el "Guardia de la Puerta".
 */
// Importamos herramientas de React. 'useState' es para recordar cosas, 'useEffect' es para hacer cosas cuando algo cambia.
import { useState, useEffect } from 'react';

// Importamos 'useForm', que es un ayudante mágico que maneja formularios sin que tengamos que escribir tanto código.
import { useForm } from 'react-hook-form';

// Importamos 'zodResolver', que conecta nuestro "manual de reglas" (zod) con nuestro ayudante (useForm).
import { zodResolver } from '@hookform/resolvers/zod';

// Importamos los ladrillos de diseño de Material UI (Cajas, Textos, Botones, etc.)
import { TextField, Button, Box, Typography, Paper, Container, Alert } from '@mui/material';

// Importamos las reglas que creamos en login.ts
import { loginSchema } from '../types/login';
import type { LoginFormData } from '../types/login';

// Aquí definimos qué cosas (props) necesita este componente para funcionar.
interface LoginProps {
  title?: string;       // El título principal (ej: "Iniciar Sesión")
  subtitle?: string;    // Un texto más pequeñito debajo del título
  onSubmit: (datos: LoginFormData) => Promise<void> | void; // ¡La acción que pasa cuando apretamos "Entrar"!
}

/**
 * Muestra un modal/pantalla de autenticación.
 */
export const Login = ({ title = "Iniciar Sesión", subtitle = "Ingresa tus credenciales", onSubmit }: LoginProps) => {
  // 'errorMsg' es la memoria donde guardamos si hubo un error (ej. "Contraseña incorrecta").
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Configuramos nuestro ayudante de formularios diciéndole: "Usa las reglas de loginSchema".
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 'useEffect' está "vigilando". Si el usuario empieza a escribir de nuevo, borramos el mensaje de error rojo.
  useEffect(() => {
    const subscription = watch(() => {
      if (errorMsg) setErrorMsg(null);
    });
    return () => subscription.unsubscribe();
  }, [watch, errorMsg]);

  // Esta función se activa cuando el formulario pasa todas las reglas y le damos al botón "Entrar".
  const handleFormSubmit = async (datos: LoginFormData) => {
    setErrorMsg(null); // Limpiamos errores anteriores.
    try {
      // Intentamos iniciar sesión (onSubmit es una función que viene desde fuera, desde AuthContext).
      await onSubmit(datos);
    } catch {
      // Si la contraseña o correo están mal, mostramos este mensaje.
      setErrorMsg('Credenciales inválidas. Verifica tu correo y contraseña.');
    }
  };

  // Estos son solo estilos para que los cuadros de texto se vean bonitos y cambien de color.
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'var(--bg-body)',
      color: 'var(--text-body)',
      '& fieldset': { borderColor: 'var(--border-table)' },
      '&:hover fieldset': { borderColor: 'var(--btn-primary-hover)' },
      '&.Mui-focused fieldset': { borderColor: 'var(--btn-primary)' }
    },
    '& .MuiInputLabel-root': { color: 'var(--text-body)', opacity: 0.8 },
    '& .MuiInputLabel-root.Mui-focused': { color: 'var(--btn-primary)' },
  };

  return (
    // 'Container' centra todo en el medio de la pantalla.
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      {/* 'Paper' es un cuadro blanco (u oscuro) con sombra y bordes redondeados */}
      <Paper elevation={6} sx={{ padding: 5, borderRadius: 3, width: '100%', backgroundColor: 'var(--bg-card)', color: 'var(--text-body)', backdropFilter: 'blur(10px)' }}>
        
        {/* Aquí va el Título y Subtítulo */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Typography component="h1" variant="h4" sx={{ color: 'var(--text-body)', fontWeight: 'bold', mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--text-body)', opacity: 0.8 }}>
            {subtitle}
          </Typography>
        </Box>

        {/* 'Box' que actúa como formulario. Cuando lo enviamos, ejecuta nuestra función 'handleFormSubmit' */}
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ display: 'grid', gap: 2.5 }}>
          
          {/* Cuadro de texto para el Correo */}
          <TextField
            label="Correo Electrónico"
            variant="outlined"
            type="email"
            fullWidth
            autoComplete="email"
            autoFocus
            // '{...register}' conecta este input con nuestro ayudante mágico de formularios
            {...register('email')}
            // Si el ayudante detecta un error, el cuadro se pone rojo
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={textFieldStyles}
          />

          {/* Cuadro de texto para la Contraseña */}
          <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            autoComplete="current-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={textFieldStyles}
          />

          {/* Si tenemos un mensaje de error (ej: contraseña mala), mostramos una Alerta roja */}
          {errorMsg && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          {/* Botón de Entrar */}
          <Button 
            type="submit" 
            variant="contained" 
            // Si el formulario se está enviando, apagamos el botón para que no hagan doble clic
            disabled={isSubmitting}
            fullWidth
            sx={{ 
              mt: 2, mb: 2, 
              backgroundColor: 'var(--btn-primary)', 
              padding: '12px', fontSize: '1rem', fontWeight: 'bold', textTransform: 'none', borderRadius: 2,
              boxShadow: '0 4px 14px 0 rgba(141, 106, 59, 0.39)',
              '&:hover': { backgroundColor: 'var(--btn-primary-hover)', boxShadow: '0 6px 20px rgba(141, 106, 59, 0.23)' } 
            }}
          >
            {/* Si está cargando dice 'Iniciando...', si no, dice 'Entrar' */}
            {isSubmitting ? 'Iniciando...' : 'Entrar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export type { LoginFormData };

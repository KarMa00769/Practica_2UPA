import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Typography, Paper, Container } from '@mui/material';
import { loginSchema } from '../types/login';
import type { LoginFormData } from '../types/login';

interface LoginProps {
  title?: string;
  subtitle?: string;
  onSubmit: (datos: LoginFormData) => Promise<void> | void;
}

export const Login = ({ title = "Iniciar Sesión", subtitle = "Ingresa tus credenciales", onSubmit }: LoginProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'var(--bg-body)',
      color: 'var(--text-body)',
      '& fieldset': {
        borderColor: 'var(--border-table)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--btn-primary-hover)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--btn-primary)',
      }
    },
    '& .MuiInputLabel-root': {
      color: 'var(--text-body)',
      opacity: 0.8,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'var(--btn-primary)',
    },
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Paper elevation={6} sx={{ padding: 5, borderRadius: 3, width: '100%', backgroundColor: 'var(--bg-card)', color: 'var(--text-body)', backdropFilter: 'blur(10px)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Typography component="h1" variant="h4" sx={{ color: 'var(--text-body)', fontWeight: 'bold', mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--text-body)', opacity: 0.8 }}>
            {subtitle}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2.5 }}>
          <TextField
            label="Correo Electrónico"
            variant="outlined"
            type="email"
            fullWidth
            autoComplete="email"
            autoFocus
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={textFieldStyles}
          />

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

          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
            fullWidth
            sx={{ 
              mt: 2, 
              mb: 2, 
              backgroundColor: 'var(--btn-primary)', 
              padding: '12px', 
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 4px 14px 0 rgba(141, 106, 59, 0.39)',
              '&:hover': { 
                backgroundColor: 'var(--btn-primary-hover)',
                boxShadow: '0 6px 20px rgba(141, 106, 59, 0.23)'
              } 
            }}
          >
            {isSubmitting ? 'Iniciando...' : 'Entrar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export type { LoginFormData };

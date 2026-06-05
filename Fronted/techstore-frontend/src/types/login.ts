/**
 * Módulo de Tipos de Login.
 * Piensa en este archivo como el guardia de seguridad que revisa
 * que tu correo tenga una "@" y tu contraseña sea suficientemente larga
 * antes de dejarte tocar el botón de "Entrar".
 */
// Importamos 'zod', una herramienta que nos ayuda a crear reglas estrictas.
import * as z from 'zod';

/**
 * Creamos las "Reglas de inicio de sesión".
 */
export const loginSchema = z.object({
  // Regla 1: El correo (email) debe ser un texto (string), no puede estar vacío (min 1), y debe tener formato de correo válido.
  email: z.string().min(1, { message: 'El correo electrónico es obligatorio' }).email({ message: 'Debe ser un correo válido' }),
  
  // Regla 2: La contraseña debe ser texto (string) y tener por lo menos 6 letras/números de largo.
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

/**
 * TypeScript mira nuestras reglas de arriba y automáticamente crea una etiqueta llamada 'LoginFormData'.
 * Esto nos sirve para que el código no nos deje compilar si se nos olvida mandar la contraseña.
 */
export type LoginFormData = z.infer<typeof loginSchema>;

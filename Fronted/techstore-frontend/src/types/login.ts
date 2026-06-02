import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, { message: 'El correo electrónico es obligatorio' }).email({ message: 'Debe ser un correo válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

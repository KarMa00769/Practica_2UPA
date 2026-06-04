import * as z from 'zod';

// Esquema de validación con Zod
export const productoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  categoria: z.string().min(1, 'La categoría es obligatoria'),
  precio: z.number({ message: 'El precio debe ser un número' }).positive('El precio debe ser mayor a 0'),
  stock: z.number({ message: 'El stock debe ser un número' }).int().nonnegative('El stock no puede ser negativo'),
  proveedor: z.string().optional(),
  fechaRegistro: z.string().optional(),
  estado: z.string().optional(),
});

// Tipo de TypeScript inferido de Zod
export type ProductoFormData = z.infer<typeof productoSchema>;

// Tipo para el producto que ya viene con ID desde el Backend
export interface Producto extends ProductoFormData {
  id: number;
}
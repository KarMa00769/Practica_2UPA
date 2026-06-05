/**
 * Módulo de Tipos de Producto.
 * Este archivo contiene las "Reglas de Producto". Como si fuera un manual
 * que nos dice exactamente qué características TIENE que tener un producto
 * para poder guardarlo en el inventario.
 */
// Importamos 'zod', la herramienta para poner reglas.
import * as z from 'zod';

/**
 * Creamos el esquema (las reglas) para registrar un nuevo producto.
 */
export const productoSchema = z.object({
  // El nombre debe ser texto y no puede estar vacío.
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  
  // La categoría debe ser texto y no puede estar vacía.
  categoria: z.string().min(1, 'La categoría es obligatoria'),
  
  // El precio DEBE ser un número. 'positive' significa que no puede ser 0 ni negativo (no regalamos cosas ni damos dinero por llevárselas).
  precio: z.number({ message: 'El precio debe ser un número' }).positive('El precio debe ser mayor a 0'),
  
  // El stock (inventario) DEBE ser un número entero (int) y no puede ser negativo (nonnegative).
  stock: z.number({ message: 'El stock debe ser un número' }).int().nonnegative('El stock no puede ser negativo'),
  
  // El proveedor es 'optional' (opcional), significa que podemos dejarlo en blanco.
  proveedor: z.string().optional(),
  
  // La fecha también es opcional.
  fechaRegistro: z.string().optional(),
  
  // El estado (ej: 'Activo') es opcional.
  estado: z.string().optional(),
});

/**
 * Tipo inferido: Le decimos a TypeScript que anote todas las reglas de arriba y las llame 'ProductoFormData'.
 * Así, cuando llenemos el formulario, la computadora sabrá qué esperar.
 */
export type ProductoFormData = z.infer<typeof productoSchema>;

/**
 * Cuando pedimos un producto ya guardado, la base de datos (PostgreSQL)
 * le asigna un número único de identificación (ID).
 * Aquí le decimos: "Toma todo lo de ProductoFormData y añádele un 'id' numérico".
 */
export interface Producto extends ProductoFormData {
  id: number;
}
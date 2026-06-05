/**
 * Componente FormProducto.
 * Este es el formulario mágico para agregar productos nuevos al inventario.
 * Se encarga de revisar que todos los datos estén bien antes de enviarlos a Django.
 */
// Importamos nuestros ayudantes mágicos para crear formularios sin sufrir.
import { useForm, Controller } from 'react-hook-form';

// Importamos el puente que conecta nuestro "manual de reglas" (Zod) con el formulario.
import { zodResolver } from '@hookform/resolvers/zod';

// Importamos cajas de texto, botones, y un "Autocomplete" (una cajita inteligente que te sugiere palabras).
import { TextField, Button, Box, Typography, Paper, Autocomplete } from '@mui/material';

// Importamos las reglas que debe cumplir un producto nuevo (ej. que el precio sea mayor a 0).
import { productoSchema, type ProductoFormData } from '../types/producto';

// Definimos qué información necesita este componente desde afuera.
interface FormProductoProps {
  onProductoGuardado: () => void; // Función que hace "¡Ring Ring! ¡Papá App, ya guardé un producto!"
  categoriasExistentes: string[]; // Lista de categorías para que la cajita inteligente nos sugiera.
}

export const FormProducto = ({ onProductoGuardado, categoriasExistentes }: FormProductoProps) => {
  // Aquí configuramos nuestro ayudante de formularios:
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema), // "Usa las reglas de productoSchema"
    defaultValues: {
      categoria: '' // Empezamos con la categoría vacía
    }
  });

  // Esta función se ejecuta solo si TODAS las reglas pasaron y apretamos "Guardar".
  const onSubmit = async (data: ProductoFormData) => {
    try {
      // Mandamos un mensajero (fetch) a nuestra base de datos en el backend (Django).
      await fetch("http://localhost:8000/api/productos/", {
        method: "POST", // "POST" significa "Te envío esto para que lo crees/guardes"
        headers: {
          "Content-Type": "application/json" // Le decimos: "Oye, te voy a enviar esto en formato JSON"
        },
        body: JSON.stringify(data) // Convertimos nuestros datos a texto JSON para enviarlos.
      });

      // Si todo sale bien...
      alert("Producto registrado correctamente");
      reset(); // Limpia todos los cuadros de texto del formulario para dejarlo como nuevo.
      onProductoGuardado(); // Avisamos a App.tsx para que recargue la lista de productos.
    } catch (error) {
      // Si el internet falla o el servidor está apagado...
      console.error("Error al registrar producto:", error);
      alert("Hubo un error al conectar con el servidor");
    }
  };

  // Solo estilos de colores para que se vea bonito.
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
    // 'Paper' es una tarjeta con sombrita en los bordes.
    <Paper elevation={3} sx={{ padding: 4, marginBottom: 4, borderRadius: 2, bgcolor: 'var(--bg-card)', color: 'var(--text-body)' }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, color: 'var(--text-body)', fontWeight: 'bold' }}>
        Registrar Producto
      </Typography>

      {/* Cuando se envía el formulario, llama a handleSubmit, que revisa las reglas y si pasa, llama a onSubmit */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2 }}>
        
        {/* Campo: Nombre del producto */}
        <TextField
          label="Nombre del producto"
          variant="outlined"
          fullWidth
          {...register('nombre')} // Lo conectamos con el ayudante
          error={!!errors.nombre} // Si hay error, se pone rojo
          helperText={errors.nombre?.message} // Muestra el mensaje: "El nombre es obligatorio"
          sx={textFieldStyles}
        />

        {/* Campo Inteligente: Categoría. Sugiere categorías que ya existen. */}
        <Controller
          name="categoria"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Autocomplete
              freeSolo // 'freeSolo' significa que si la categoría no existe, igual puedes escribirla.
              options={categoriasExistentes}
              value={value}
              onInputChange={(_, newValue) => onChange(newValue)}
              onChange={(_, newValue) => onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Categoría"
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  sx={textFieldStyles}
                />
              )}
            />
          )}
        />

        {/* Campo: Precio (Solo acepta números) */}
        <TextField
          label="Precio"
          type="number"
          variant="outlined"
          fullWidth
          {...register('precio', { valueAsNumber: true })} // Le decimos que guarde el valor como número, no como texto
          error={!!errors.precio}
          helperText={errors.precio?.message}
          sx={textFieldStyles}
        />

        {/* Campo: Stock (Cuántos hay) */}
        <TextField
          label="Stock"
          type="number"
          variant="outlined"
          fullWidth
          {...register('stock', { valueAsNumber: true })}
          error={!!errors.stock}
          helperText={errors.stock?.message}
          sx={textFieldStyles}
        />

        {/* Campo: Proveedor (Es opcional) */}
        <TextField
          label="Proveedor"
          variant="outlined"
          fullWidth
          {...register('proveedor')}
          error={!!errors.proveedor}
          helperText={errors.proveedor?.message}
          sx={textFieldStyles}
        />

        {/* Botón Guardar */}
        <Button 
          type="submit" 
          variant="contained" 
          disabled={isSubmitting} // Si se está enviando, no dejes que hagan clic otra vez
          sx={{ backgroundColor: 'var(--btn-primary)', padding: '12px', '&:hover': { backgroundColor: 'var(--btn-primary-hover)' } }}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </Box>
    </Paper>
  );
};
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { productoSchema, type ProductoFormData } from '../types/producto';

interface FormProductoProps {
  onProductoGuardado: () => void;
}

export const FormProducto = ({ onProductoGuardado }: FormProductoProps) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
  });

  const onSubmit = async (data: ProductoFormData) => {
    try {
      // La misma URL y lógica que tenías en tu app.js
      await fetch("http://localhost:3000/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      alert("Producto registrado correctamente");
      reset(); // Limpia el formulario
      onProductoGuardado(); // Le avisa al componente padre que actualice la tabla
    } catch (error) {
      console.error("Error al registrar producto:", error);
      alert("Hubo un error al conectar con el servidor");
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, marginBottom: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, color: '#1e3a5f', fontWeight: 'bold' }}>
        Registrar Producto
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2 }}>
        <TextField
          label="Nombre del producto"
          variant="outlined"
          fullWidth
          {...register('nombre')}
          error={!!errors.nombre}
          helperText={errors.nombre?.message}
        />

        <TextField
          label="Categoría"
          variant="outlined"
          fullWidth
          {...register('categoria')}
          error={!!errors.categoria}
          helperText={errors.categoria?.message}
        />

        <TextField
          label="Precio"
          type="number"
          variant="outlined"
          fullWidth
          {...register('precio', { valueAsNumber: true })}
          error={!!errors.precio}
          helperText={errors.precio?.message}
        />

        <TextField
          label="Stock"
          type="number"
          variant="outlined"
          fullWidth
          {...register('stock', { valueAsNumber: true })}
          error={!!errors.stock}
          helperText={errors.stock?.message}
        />

        <Button 
          type="submit" 
          variant="contained" 
          disabled={isSubmitting}
          sx={{ backgroundColor: '#1e3a5f', padding: '12px', '&:hover': { backgroundColor: '#2f5f91' } }}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </Box>
    </Paper>
  );
};
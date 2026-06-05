/**
 * Componente Dashboard.
 * Este es el "Tablero Principal". Imagina que es la pantalla gigante
 * que ve el gerente de la tienda al entrar, con números grandes y gráficas.
 */
// Importamos cajas, papeles (tarjetas blancas) y textos de Material UI.
import { Box, Paper, Typography, Grid } from '@mui/material';

// Importamos las herramientas para dibujar la gráfica de barras.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Importamos nuestro molde de Producto.
import type { Producto } from '../types/producto';

// Le decimos qué datos necesita este componente. Necesita la lista completa de productos.
interface DashboardProps {
  productos: Producto[];
}

export const Dashboard = ({ productos }: DashboardProps) => {
  // --- Calculando los KPIs (Números Importantes) ---
  
  // 1. Total de Productos: Simplemente contamos cuántos productos hay en la lista.
  const totalProductos = productos.length;
  
  // 2. Valor del Inventario: Sumamos (precio * stock) de todos los productos.
  // Es como decir: "Si vendo todo hoy mismo, ¿cuánto dinero gano?".
  const valorInventario = productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);
  
  // 3. Alertas de Stock Bajo: Contamos cuántos productos tienen menos de 5 cosas en la bodega.
  const productosStockBajo = productos.filter(p => p.stock < 5).length;

  // --- Preparando los datos para la gráfica ---
  // Agrupamos los productos por categoría. 
  // Ej: { "Electrónica": 10, "Muebles": 5 }
  const categoriaCount = productos.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convertimos ese grupo en una lista que la gráfica pueda leer.
  // Ej: [{ categoria: "Electrónica", cantidad: 10 }, { categoria: "Muebles", cantidad: 5 }]
  const chartData = Object.keys(categoriaCount).map(key => ({
    categoria: key,
    cantidad: categoriaCount[key]
  }));

  // --- Lo que se dibuja en la pantalla ---
  return (
    <Box sx={{ mb: 4 }}>
      {/* Título de la página */}
      <Typography variant="h5" component="h2" sx={{ mb: 3, color: 'var(--text-body)', fontWeight: 'bold' }}>
        Resumen de Inventario
      </Typography>
      
      {/* Grid es como una cuadrícula para acomodar las tarjetas lado a lado */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Tarjeta 1: Total de Productos */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: 'var(--bg-card)', color: 'var(--text-body)' }}>
            <Typography variant="subtitle1" sx={{ color: 'var(--text-body)', opacity: 0.8 }}>Total Productos</Typography>
            <Typography variant="h4" sx={{ color: 'var(--btn-primary)', fontWeight: 'bold' }}>{totalProductos}</Typography>
          </Paper>
        </Grid>
        
        {/* Tarjeta 2: Valor del Inventario */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: 'var(--bg-card)', color: 'var(--text-body)' }}>
            <Typography variant="subtitle1" sx={{ color: 'var(--text-body)', opacity: 0.8 }}>Valor del Inventario</Typography>
            {/* toLocaleString le pone las comas de miles y el punto decimal */}
            <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              ${valorInventario.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Tarjeta 3: Alertas de Stock Bajo (Color Rojo) */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: 'var(--bg-card)', color: 'var(--text-body)' }}>
            <Typography variant="subtitle1" color="error">Alertas (Stock Bajo &lt; 5)</Typography>
            <Typography variant="h4" color="error" sx={{ fontWeight: 'bold' }}>{productosStockBajo}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Aquí empieza la gráfica de barras */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 400, bgcolor: 'var(--bg-card)', color: 'var(--text-body)' }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: 'var(--text-body)' }}>
          Distribución de Productos por Categoría
        </Typography>
        
        {/* 'ResponsiveContainer' hace que la gráfica se encoja o estire si achicas la ventana */}
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            {/* Eje X (Abajo) pone el nombre de las categorías */}
            <XAxis dataKey="categoria" stroke="var(--text-body)" />
            {/* Eje Y (Lado izquierdo) pone los números */}
            <YAxis stroke="var(--text-body)" />
            {/* Tooltip es el cuadrito que aparece cuando pasas el mouse por encima */}
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-body)' }} />
            <Legend />
            {/* Y aquí pintamos las barras (Bar) */}
            <Bar dataKey="cantidad" fill="#8d6a3b" name="Cant. de Productos" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

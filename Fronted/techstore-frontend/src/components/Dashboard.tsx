import { Box, Paper, Typography, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Producto } from '../types/producto';

interface DashboardProps {
  productos: Producto[];
}

export const Dashboard = ({ productos }: DashboardProps) => {
  // KPIs
  const totalProductos = productos.length;
  
  const valorInventario = productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);
  
  const productosStockBajo = productos.filter(p => p.stock < 5).length;

  // Transform data for chart: group by category
  const categoriaCount = productos.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(categoriaCount).map(key => ({
    categoria: key,
    cantidad: categoriaCount[key]
  }));

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, color: '#1e3a5f', fontWeight: 'bold' }}>
        Resumen de Inventario
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#f5f7fa' }}>
            <Typography variant="subtitle1" color="textSecondary">Total Productos</Typography>
            <Typography variant="h4" sx={{ color: '#1e3a5f', fontWeight: 'bold' }}>{totalProductos}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#f5f7fa' }}>
            <Typography variant="subtitle1" color="textSecondary">Valor del Inventario</Typography>
            <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              ${valorInventario.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#fff0f0' }}>
            <Typography variant="subtitle1" color="error">Alertas (Stock Bajo &lt; 5)</Typography>
            <Typography variant="h4" color="error" sx={{ fontWeight: 'bold' }}>{productosStockBajo}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 400 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#1e3a5f' }}>
          Distribución de Productos por Categoría
        </Typography>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#1e3a5f" name="Cant. de Productos" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

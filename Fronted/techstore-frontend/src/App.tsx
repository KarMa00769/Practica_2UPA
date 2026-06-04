import { useEffect, useState } from 'react';
import { FormProducto } from './components/FormProducto';
import { Dashboard } from './components/Dashboard';
import type { Producto } from './types/producto';
import { Login } from './components/Login';
import { useAuth } from './context/AuthContext';

// MUI Components
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, 
  Divider, IconButton, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Button, CssBaseline,
  TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment
} from '@mui/material';

// MUI Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const drawerWidth = 240;
const collapsedDrawerWidth = 65;
const API_URL = "http://localhost:8000/api/productos/";

function App() {
  const { user, isLoading, login, logout } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'inventario' | 'registro'>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true); // Controla si el sidebar está expandido en PC
  
  // Búsqueda y Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('Todas');
  
  const categoriasUnicas = ['Todas', ...Array.from(new Set(productos.map(p => p.categoria)))];
  
  const productosFiltrados = productos.filter(p => {
    const textToSearch = `${p.nombre} ${p.proveedor || ''}`.toLowerCase();
    const matchesSearch = textToSearch.includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === 'Todas' || p.categoria === filterCategoria;
    return matchesSearch && matchesCategoria;
  });

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('themeMode') === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.body.className = themeMode;
    window.localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const toggleTheme = () => setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleDesktopToggle = () => setDesktopOpen(!desktopOpen);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch(API_URL);
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const eliminarProducto = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await fetch(`${API_URL}${id}/`, { method: "DELETE" });
        alert("Producto eliminado");
        obtenerProductos();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(productosFiltrados.map(p => ({
      ID: p.id,
      Nombre: p.nombre,
      Categoría: p.categoria,
      Precio: p.precio,
      Stock: p.stock,
      Proveedor: p.proveedor || 'N/A',
      'Fecha Registro': p.fechaRegistro || 'N/A',
      Estado: p.estado || 'N/A'
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventario");
    XLSX.writeFile(wb, "Reporte_Inventario_TechStore.xlsx");
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Inventario - TechStore", 14, 15);
    
    const tableData = productosFiltrados.map(p => [
      p.id,
      p.nombre,
      p.categoria,
      `$${p.precio}`,
      p.stock,
      p.proveedor || 'N/A',
      p.estado || 'N/A'
    ]);

    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Proveedor', 'Estado']],
      body: tableData,
    });
    
    doc.save("Reporte_Inventario_TechStore.pdf");
  };

  useEffect(() => {
    if (user) obtenerProductos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><h2>Cargando sesión...</h2></div>;

  if (!user) {
    return (
      <Box sx={{ position: 'relative' }}>
        <IconButton onClick={toggleTheme} sx={{ position: 'absolute', right: 16, top: 16, zIndex: 1000, color: 'var(--text-body)' }}>
          {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        <Login title="TechStore" subtitle="Ingresa a tu cuenta para administrar el inventario" onSubmit={login} />
      </Box>
    );
  }

  const currentDrawerWidth = desktopOpen ? drawerWidth : collapsedDrawerWidth;

  const getDrawer = (isExpanded: boolean) => (
    <div>
      <Toolbar disableGutters sx={{ display: 'flex', alignItems: 'center', justifyContent: isExpanded ? 'flex-start' : 'center', px: isExpanded ? 2 : 0.5 }}>
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'var(--text-nav)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            width: '100%',
            overflow: 'hidden'
          }}
        >
          <span>T</span>
          <span style={{ 
            display: 'inline-block',
            maxWidth: isExpanded ? '50px' : '0px', 
            opacity: isExpanded ? 1 : 0, 
            overflow: 'hidden', 
            transition: 'max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
            whiteSpace: 'nowrap'
          }}>
            ech
          </span>
          <span>S</span>
          <span style={{ 
            display: 'inline-block',
            maxWidth: isExpanded ? '50px' : '0px', 
            opacity: isExpanded ? 1 : 0, 
            overflow: 'hidden', 
            transition: 'max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
            whiteSpace: 'nowrap'
          }}>
            tore
          </span>
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton 
            onClick={() => { setCurrentView('dashboard'); setMobileOpen(false); }} 
            selected={currentView === 'dashboard'}
            sx={{ minHeight: 48, justifyContent: isExpanded ? 'initial' : 'center', px: 2.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isExpanded ? 3 : 'auto', justifyContent: 'center' }}>
              <DashboardIcon />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Resumen" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton 
            onClick={() => { setCurrentView('inventario'); setMobileOpen(false); }} 
            selected={currentView === 'inventario'}
            sx={{ minHeight: 48, justifyContent: isExpanded ? 'initial' : 'center', px: 2.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isExpanded ? 3 : 'auto', justifyContent: 'center' }}>
              <InventoryIcon />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Inventario" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton 
            onClick={() => { setCurrentView('registro'); setMobileOpen(false); }} 
            selected={currentView === 'registro'}
            sx={{ minHeight: 48, justifyContent: isExpanded ? 'initial' : 'center', px: 2.5 }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isExpanded ? 3 : 'auto', justifyContent: 'center' }}>
              <AddCircleIcon />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Registrar Producto" />}
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box className="app-container" sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--bg-body)', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      <CssBaseline />
      
      {/* AppBar (Mobile / Header) */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` }, 
          ml: { sm: `${currentDrawerWidth}px` }, 
          bgcolor: 'var(--bg-header)',
          color: 'var(--text-header)',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
        }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          
          <IconButton color="inherit" aria-label="toggle desktop drawer" edge="start" onClick={handleDesktopToggle} sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {currentView === 'dashboard' && 'Panel de Control'}
            {currentView === 'inventario' && 'Gestión de Inventario'}
            {currentView === 'registro' && 'Alta de Nuevo Producto'}
          </Typography>
          
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', md: 'block' } }}>
            {user.username || user.email}
          </Typography>
          <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>Salir</Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { sm: currentDrawerWidth }, flexShrink: { sm: 0 }, transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ 
            display: { xs: 'block', sm: 'none' }, 
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: 'var(--bg-nav)',
              color: 'var(--text-nav)',
              '& .MuiListItemIcon-root': {
                color: 'var(--text-nav)',
              },
              '& .MuiListItemText-primary': {
                color: 'var(--text-nav)',
              },
              '& .MuiListItemButton-root.Mui-selected': {
                bgcolor: 'var(--bg-nav-selected)',
                '&:hover': {
                  bgcolor: 'var(--bg-nav-selected)',
                }
              },
              '& .MuiListItemButton-root:hover': {
                bgcolor: 'var(--bg-nav-hover)',
              }
            } 
          }}
        >
          {getDrawer(true)}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ 
            display: { xs: 'none', sm: 'block' }, 
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: currentDrawerWidth, 
              bgcolor: 'var(--bg-nav)',
              color: 'var(--text-nav)',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important',
              overflowX: 'hidden',
              '& .MuiListItemIcon-root': {
                color: 'var(--text-nav)',
              },
              '& .MuiListItemText-primary': {
                color: 'var(--text-nav)',
              },
              '& .MuiListItemButton-root.Mui-selected': {
                bgcolor: 'var(--bg-nav-selected)',
                '&:hover': {
                  bgcolor: 'var(--bg-nav-selected)',
                }
              },
              '& .MuiListItemButton-root:hover': {
                bgcolor: 'var(--bg-nav-hover)',
              }
            } 
          }}
          open
        >
          {getDrawer(desktopOpen)}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, color: 'var(--text-body)', overflow: 'hidden' }}>
        <Toolbar /> {/* Spacer for AppBar */}
        
        {currentView === 'dashboard' && (
          <Dashboard productos={productos} />
        )}

        {currentView === 'registro' && (
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <FormProducto 
              categoriasExistentes={categoriasUnicas.filter(c => c !== 'Todas')}
              onProductoGuardado={() => {
                obtenerProductos();
                setCurrentView('inventario');
              }} 
            />
          </Box>
        )}

        {currentView === 'inventario' && (
          <Box sx={{ bgcolor: 'var(--bg-card)', p: 3, borderRadius: 2, boxShadow: 3, color: 'var(--text-body)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Lista de Productos</Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <TextField
                  label="Buscar producto o proveedor..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ 
                    minWidth: 250, 
                    bgcolor: 'var(--bg-body)', 
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      color: 'var(--text-body)',
                      '& fieldset': { borderColor: 'var(--border-table)' },
                      '&:hover fieldset': { borderColor: 'var(--btn-primary-hover)' },
                    },
                    '& .MuiInputLabel-root': { color: 'var(--text-body)', opacity: 0.8 }
                  }}
                />
                
                <FormControl size="small" sx={{ 
                  minWidth: 200, 
                  bgcolor: 'var(--bg-body)', 
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--text-body)',
                    '& fieldset': { borderColor: 'var(--border-table)' },
                    '&:hover fieldset': { borderColor: 'var(--btn-primary-hover)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--text-body)', opacity: 0.8 }
                }}>
                  <InputLabel sx={{ color: 'var(--text-body)' }}>Categoría</InputLabel>
                  <Select
                    value={filterCategoria}
                    label="Categoría"
                    onChange={(e) => setFilterCategoria(e.target.value)}
                    sx={{ color: 'var(--text-body)' }}
                  >
                    {categoriasUnicas.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button variant="contained" onClick={obtenerProductos} sx={{ bgcolor: 'var(--btn-primary)', height: 40, '&:hover': { bgcolor: 'var(--btn-primary-hover)' } }}>
                  Actualizar Datos
                </Button>
              </Box>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <Button 
                variant="outlined" 
                color="success" 
                startIcon={<TableViewIcon />} 
                onClick={exportarExcel}
              >
                Excel
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<PictureAsPdfIcon />} 
                onClick={exportarPDF}
              >
                PDF
              </Button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-body)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-th)', color: 'var(--text-th)', textAlign: 'left' }}>
                    <th style={{ padding: 12, color: 'var(--text-th)' }}>ID</th>
                    <th style={{ padding: 12, color: 'var(--text-th)' }}>Nombre</th>
                    <th style={{ padding: 12, color: 'var(--text-th)' }}>Categoría</th>
                    <th style={{ padding: 12, color: 'var(--text-th)' }}>Precio</th>
                    <th style={{ padding: 12, color: 'var(--text-th)' }}>Stock</th>
                    <th style={{ padding: 12, color: 'var(--text-th)' }}>Proveedor</th>
                    <th style={{ padding: 12, color: 'var(--text-th)' }}>Fecha Reg.</th>
                    <th style={{ padding: 12, color: 'var(--text-th)' }}>Estado</th>
                    <th style={{ padding: 12, color: 'var(--text-th)' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ padding: 12, textAlign: 'center' }}>No se encontraron productos con esos filtros.</td>
                    </tr>
                  ) : (
                    productosFiltrados.map((producto) => (
                      <tr key={producto.id} style={{ borderBottom: '1px solid var(--border-table)', color: 'var(--text-body)' }}>
                        <td style={{ padding: 12 }}>{producto.id}</td>
                        <td style={{ padding: 12 }}>{producto.nombre}</td>
                        <td style={{ padding: 12 }}>{producto.categoria}</td>
                        <td style={{ padding: 12 }}>${producto.precio}</td>
                        <td style={{ padding: 12 }}>{producto.stock}</td>
                        <td style={{ padding: 12 }}>{producto.proveedor || 'N/A'}</td>
                        <td style={{ padding: 12 }}>{producto.fechaRegistro || 'N/A'}</td>
                        <td style={{ padding: 12 }}>{producto.estado || 'N/A'}</td>
                        <td style={{ padding: 12 }}>
                          <Button 
                            variant="contained" 
                            color="error" 
                            size="small"
                            onClick={() => eliminarProducto(producto.id)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default App;
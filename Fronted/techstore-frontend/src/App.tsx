/**
 * Componente principal de la interfaz de usuario (App).
 * Imagina que esta es la "Carcasa del Celular" y la pantalla principal.
 * Aquí decidimos qué aplicación (componente) mostrar en la pantalla (Dashboard, Inventario, Registro).
 */
// Importamos herramientas básicas para recordar cosas (useState) y hacer cosas al inicio (useEffect).
import { useEffect, useState } from 'react';

// Importamos nuestros componentes (las otras pantallas de nuestra app).
import { FormProducto } from './components/FormProducto';
import { Dashboard } from './components/Dashboard';
import type { Producto } from './types/producto';
import { Login } from './components/Login';

// Importamos nuestro brazalete VIP (AuthContext) para saber si el usuario puede entrar.
import { useAuth } from './context/AuthContext';

// Importamos los ladrillos de construcción de Material UI (Barras, Listas, Botones, Tablas).
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, 
  Divider, IconButton, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Button, CssBaseline,
  TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

// Importamos todos los dibujitos (iconos) que usaremos en los botones.
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';

// Importamos herramientas para descargar archivos Excel y PDF.
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Tamaños del menú lateral (abierto y cerrado).
const drawerWidth = 240;
const collapsedDrawerWidth = 65;

// La dirección de nuestro servidor de productos.
const API_URL = "http://localhost:8000/api/productos/";

/**
 * Componente App:
 * Es el cerebro principal. Revisa el brazalete VIP y decide qué mostrar.
 */
function App() {
  // Sacamos nuestras herramientas del brazalete VIP (usuario actual, si está cargando, y cómo salir).
  const { user, isLoading, login, logout } = useAuth();
  
  // Memoria: Guardamos la lista de todos los productos que nos da el servidor.
  const [productos, setProductos] = useState<Producto[]>([]);
  
  // Memoria: ¿En qué pantalla estamos ahorita? (Empezamos en el 'dashboard' o resumen).
  const [currentView, setCurrentView] = useState<'dashboard' | 'inventario' | 'registro'>('dashboard');
  
  // Memoria: ¿El menú lateral está abierto en el celular?
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Memoria: ¿El menú lateral está abierto en la computadora?
  const [desktopOpen, setDesktopOpen] = useState(true); 
  
  // --- Memorias para los Filtros (Buscador) ---
  // ¿Qué palabra estamos buscando?
  const [searchTerm, setSearchTerm] = useState('');
  // ¿Qué categoría queremos ver? (Empezamos en 'Todas').
  const [filterCategoria, setFilterCategoria] = useState('Todas');
  
  // Buscamos todas las categorías que existen y armamos una lista única para el menú desplegable.
  const categoriasUnicas = ['Todas', ...Array.from(new Set(productos.map(p => p.categoria)))];
  
  // Creamos una lista "filtrada". Solo mostramos los productos que coincidan con la búsqueda.
  const productosFiltrados = productos.filter(p => {
    const textToSearch = `${p.nombre} ${p.proveedor || ''}`.toLowerCase();
    const matchesSearch = textToSearch.includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === 'Todas' || p.categoria === filterCategoria;
    return matchesSearch && matchesCategoria;
  });

  // Memoria: ¿Tema claro o tema oscuro? Leemos la memoria del navegador para recordar cómo lo dejó el usuario.
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('themeMode') === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });

  // Cada vez que cambia el tema (claro/oscuro), le decimos al cuerpo de la página (body) que cambie de ropa.
  useEffect(() => {
    document.body.className = themeMode;
    window.localStorage.setItem('themeMode', themeMode); // Y lo guardamos para mañana.
  }, [themeMode]);

  // Función para prender o apagar la luz (cambiar el tema).
  const toggleTheme = () => setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  
  // Funciones para abrir y cerrar el menú.
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleDesktopToggle = () => setDesktopOpen(!desktopOpen);

  /**
   * Función para ir a pedirle los productos al servidor.
   */
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch(API_URL); // Vamos a la tienda (API)
      const datos = await respuesta.json();   // Leemos la lista que nos dan
      setProductos(datos);                    // La guardamos en nuestra memoria
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  /**
   * Función para tirar un producto a la basura.
   * @param id El número identificador del producto.
   */
  const eliminarProducto = async (id: number) => {
    // Primero le preguntamos al usuario si está seguro.
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        // Le mandamos la orden de borrar al servidor (método DELETE).
        await fetch(`${API_URL}${id}/`, { method: "DELETE" });
        alert("Producto eliminado"); // Avisamos que ya lo borró.
        obtenerProductos(); // Volvemos a pedir la lista para que desaparezca de la pantalla.
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  /**
   * Función para descargar un archivo Excel verde bonito.
   */
  const exportarExcel = () => {
    // Convertimos nuestra lista de productos a una hoja de cálculo
    const ws = XLSX.utils.json_to_sheet(productosFiltrados.map(p => ({
      ID: p.id, Nombre: p.nombre, Categoría: p.categoria, Precio: p.precio,
      Stock: p.stock, Proveedor: p.proveedor || 'N/A',
      'Fecha Registro': p.fechaRegistro || 'N/A', Estado: p.estado || 'N/A'
    })));
    const wb = XLSX.utils.book_new(); // Creamos un libro nuevo
    XLSX.utils.book_append_sheet(wb, ws, "Inventario"); // Metemos la hoja al libro
    XLSX.writeFile(wb, "Reporte_Inventario_TechStore.xlsx"); // ¡Y lo descargamos!
  };

  /**
   * Función para descargar un archivo PDF.
   */
  const exportarPDF = () => {
    const doc = new jsPDF(); // Creamos una hoja en blanco
    doc.text("Reporte de Inventario - TechStore", 14, 15); // Escribimos el título
    
    // Acomodamos los datos en forma de tablita
    const tableData = productosFiltrados.map(p => [
      p.id, p.nombre, p.categoria, `$${p.precio}`, p.stock, p.proveedor || 'N/A', p.estado || 'N/A'
    ]);

    // Dibujamos la tabla en la hoja
    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Proveedor', 'Estado']],
      body: tableData,
    });
    
    doc.save("Reporte_Inventario_TechStore.pdf"); // ¡Y lo descargamos!
  };

  // Cuando el componente "nace" (o cuando el usuario entra), pedimos los productos de inmediato.
  useEffect(() => {
    if (user) obtenerProductos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Si la app apenas está despertando y revisando las llaves, mostramos "Cargando...".
  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><h2>Cargando sesión...</h2></div>;

  // Si no hay usuario (nadie con brazalete), le mostramos el formulario de Login de la puerta.
  if (!user) {
    return (
      <Box sx={{ position: 'relative' }}>
        {/* Botón flotante para cambiar de tema claro a oscuro incluso antes de entrar */}
        <IconButton onClick={toggleTheme} sx={{ position: 'absolute', right: 16, top: 16, zIndex: 1000, color: 'var(--text-body)' }}>
          {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        <Login title="TechStore" subtitle="Ingresa a tu cuenta para administrar el inventario" onSubmit={login} />
      </Box>
    );
  }

  // --- Si llegamos aquí, ¡Es porque el usuario sí tiene llave y ya entró a la app! ---

  // ¿De qué tamaño dibujamos el menú lateral?
  const currentDrawerWidth = desktopOpen ? drawerWidth : collapsedDrawerWidth;

  // Esta es la plantilla del Menú Lateral (Los botones de la izquierda).
  const getDrawer = (isExpanded: boolean) => (
    <div>
      {/* El logotipo ("TechStore") en la esquina superior izquierda */}
      <Toolbar disableGutters sx={{ display: 'flex', alignItems: 'center', justifyContent: isExpanded ? 'flex-start' : 'center', px: isExpanded ? 2 : 0.5 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'var(--text-nav)', display: 'flex', alignItems: 'center', justifyContent: isExpanded ? 'flex-start' : 'center', width: '100%', overflow: 'hidden' }}>
          <span>T</span>
          <span style={{ display: 'inline-block', maxWidth: isExpanded ? '50px' : '0px', opacity: isExpanded ? 1 : 0, overflow: 'hidden', transition: 'max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease', whiteSpace: 'nowrap' }}>ech</span>
          <span>S</span>
          <span style={{ display: 'inline-block', maxWidth: isExpanded ? '50px' : '0px', opacity: isExpanded ? 1 : 0, overflow: 'hidden', transition: 'max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease', whiteSpace: 'nowrap' }}>tore</span>
        </Typography>
      </Toolbar>
      <Divider />
      {/* La lista de botones del menú */}
      <List>
        {/* Botón 1: Dashboard (Resumen) */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={() => { setCurrentView('dashboard'); setMobileOpen(false); }} selected={currentView === 'dashboard'} sx={{ minHeight: 48, justifyContent: isExpanded ? 'initial' : 'center', px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 0, mr: isExpanded ? 3 : 'auto', justifyContent: 'center' }}><DashboardIcon /></ListItemIcon>
            {isExpanded && <ListItemText primary="Resumen" />}
          </ListItemButton>
        </ListItem>
        
        {/* Botón 2: Inventario (La tabla con todos los productos) */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={() => { setCurrentView('inventario'); setMobileOpen(false); }} selected={currentView === 'inventario'} sx={{ minHeight: 48, justifyContent: isExpanded ? 'initial' : 'center', px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 0, mr: isExpanded ? 3 : 'auto', justifyContent: 'center' }}><InventoryIcon /></ListItemIcon>
            {isExpanded && <ListItemText primary="Inventario" />}
          </ListItemButton>
        </ListItem>
        
        {/* Botón 3: Registrar (El formulario para añadir) */}
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={() => { setCurrentView('registro'); setMobileOpen(false); }} selected={currentView === 'registro'} sx={{ minHeight: 48, justifyContent: isExpanded ? 'initial' : 'center', px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 0, mr: isExpanded ? 3 : 'auto', justifyContent: 'center' }}><AddCircleIcon /></ListItemIcon>
            {isExpanded && <ListItemText primary="Registrar Producto" />}
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    // La caja principal que engloba a toooooda la pantalla.
    <Box className="app-container" sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--bg-body)', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      <CssBaseline />
      
      {/* Barra de arriba (El techo de nuestra app) */}
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${currentDrawerWidth}px)` }, ml: { sm: `${currentDrawerWidth}px` }, bgcolor: 'var(--bg-header)', color: 'var(--text-header)', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <Toolbar>
          {/* Botón de hamburguesa (solo se ve en celular) */}
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          
          {/* Botón de hamburguesa (solo se ve en PC para hacer el menú chico o grande) */}
          <IconButton color="inherit" aria-label="toggle desktop drawer" edge="start" onClick={handleDesktopToggle} sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}>
            <MenuIcon />
          </IconButton>

          {/* El título grande de la barra de arriba. Cambia dependiendo de dónde estemos */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {currentView === 'dashboard' && 'Panel de Control'}
            {currentView === 'inventario' && 'Gestión de Inventario'}
            {currentView === 'registro' && 'Alta de Nuevo Producto'}
          </Typography>
          
          {/* Botón de la lunita/sol para cambiar de tema oscuro a claro */}
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          
          {/* Mostramos el nombre de la persona que entró */}
          <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', md: 'block' } }}>
            {user.username || user.email}
          </Typography>
          
          {/* Botón para salir y devolver la llave */}
          <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>Salir</Button>
        </Toolbar>
      </AppBar>

      {/* Menú Lateral (Sidebar) */}
      <Box component="nav" sx={{ width: { sm: currentDrawerWidth }, flexShrink: { sm: 0 }, transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        {/* En celular, se comporta como una pestaña que se oculta sola (temporary) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ 
            display: { xs: 'block', sm: 'none' }, 
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', width: drawerWidth, bgcolor: 'var(--bg-nav)', color: 'var(--text-nav)',
              '& .MuiListItemIcon-root': { color: 'var(--text-nav)' },
              '& .MuiListItemText-primary': { color: 'var(--text-nav)' },
              '& .MuiListItemButton-root.Mui-selected': { bgcolor: 'var(--bg-nav-selected)', '&:hover': { bgcolor: 'var(--bg-nav-selected)' } },
              '& .MuiListItemButton-root:hover': { bgcolor: 'var(--bg-nav-hover)' }
            } 
          }}
        >
          {getDrawer(true)}
        </Drawer>
        
        {/* En PC, se queda fijo en la pantalla (permanent) */}
        <Drawer
          variant="permanent"
          sx={{ 
            display: { xs: 'none', sm: 'block' }, 
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', width: currentDrawerWidth, bgcolor: 'var(--bg-nav)', color: 'var(--text-nav)', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important', overflowX: 'hidden',
              '& .MuiListItemIcon-root': { color: 'var(--text-nav)' },
              '& .MuiListItemText-primary': { color: 'var(--text-nav)' },
              '& .MuiListItemButton-root.Mui-selected': { bgcolor: 'var(--bg-nav-selected)', '&:hover': { bgcolor: 'var(--bg-nav-selected)' } },
              '& .MuiListItemButton-root:hover': { bgcolor: 'var(--bg-nav-hover)' }
            } 
          }}
          open
        >
          {getDrawer(desktopOpen)}
        </Drawer>
      </Box>

      {/* Área Central (Donde se muestra el contenido real) */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, color: 'var(--text-body)', overflow: 'hidden' }}>
        <Toolbar /> {/* Un espacio invisible para que la barra de arriba no tape el texto */}
        
        {/* Si currentView es 'dashboard', pintamos el componente Dashboard */}
        {currentView === 'dashboard' && (
          <Dashboard productos={productos} />
        )}

        {/* Si currentView es 'registro', pintamos el Formulario */}
        {currentView === 'registro' && (
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <FormProducto 
              categoriasExistentes={categoriasUnicas.filter(c => c !== 'Todas')}
              onProductoGuardado={() => {
                obtenerProductos(); // Actualizamos la lista porque añadimos algo nuevo.
                setCurrentView('inventario'); // Y nos movemos automáticamente a la pantalla del inventario.
              }} 
            />
          </Box>
        )}

        {/* Si currentView es 'inventario', pintamos nuestra súper tabla con filtros */}
        {currentView === 'inventario' && (
          <Box sx={{ bgcolor: 'var(--bg-card)', p: 3, borderRadius: 2, boxShadow: 3, color: 'var(--text-body)' }}>
            
            {/* Cabecera de la tabla con los buscadores */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Lista de Productos</Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                
                {/* La lupa / Cuadro de búsqueda de texto */}
                <TextField
                  label="Buscar producto o proveedor..."
                  variant="outlined"
                  size="small"
                  value={searchTerm} // Se conecta a nuestra memoria searchTerm
                  onChange={(e) => setSearchTerm(e.target.value)} // Cuando escribimos, se actualiza la memoria
                  sx={{ 
                    minWidth: 250, bgcolor: 'var(--bg-body)', borderRadius: 1,
                    '& .MuiOutlinedInput-root': { color: 'var(--text-body)', '& fieldset': { borderColor: 'var(--border-table)' }, '&:hover fieldset': { borderColor: 'var(--btn-primary-hover)' } },
                    '& .MuiInputLabel-root': { color: 'var(--text-body)', opacity: 0.8 }
                  }}
                />
                
                {/* El botón desplegable para filtrar por categorías */}
                <FormControl size="small" sx={{ 
                  minWidth: 200, bgcolor: 'var(--bg-body)', borderRadius: 1,
                  '& .MuiOutlinedInput-root': { color: 'var(--text-body)', '& fieldset': { borderColor: 'var(--border-table)' }, '&:hover fieldset': { borderColor: 'var(--btn-primary-hover)' } },
                  '& .MuiInputLabel-root': { color: 'var(--text-body)', opacity: 0.8 }
                }}>
                  <InputLabel sx={{ color: 'var(--text-body)' }}>Categoría</InputLabel>
                  <Select
                    value={filterCategoria}
                    label="Categoría"
                    onChange={(e) => setFilterCategoria(e.target.value)}
                    sx={{ color: 'var(--text-body)' }}
                  >
                    {/* Generamos una opción por cada categoría única que encontramos */}
                    {categoriasUnicas.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Botón para forzar que descargue la lista de nuevo del servidor */}
                <Button variant="contained" onClick={obtenerProductos} sx={{ bgcolor: 'var(--btn-primary)', height: 40, '&:hover': { bgcolor: 'var(--btn-primary-hover)' } }}>
                  Actualizar Datos
                </Button>
              </Box>
            </div>
            
            {/* Botones para exportar */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <Button variant="outlined" color="success" startIcon={<TableViewIcon />} onClick={exportarExcel}>Excel</Button>
              <Button variant="outlined" color="error" startIcon={<PictureAsPdfIcon />} onClick={exportarPDF}>PDF</Button>
            </div>

            {/* La tabla como tal */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-body)' }}>
                {/* Los encabezados de la tabla */}
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
                {/* El cuerpo de la tabla */}
                <tbody>
                  {productosFiltrados.length === 0 ? (
                    // Si no hay productos (o si el buscador no encontró nada), mostramos este mensaje
                    <tr>
                      <td colSpan={9} style={{ padding: 12, textAlign: 'center' }}>No se encontraron productos con esos filtros.</td>
                    </tr>
                  ) : (
                    // Si hay productos, los recorremos (map) y por cada uno creamos una fila (tr)
                    productosFiltrados.map((producto) => (
                      <tr key={producto.id} style={{ borderBottom: '1px solid var(--border-table)', color: 'var(--text-body)' }}>
                        {/* Imprimimos los datos en celdas (td) */}
                        <td style={{ padding: 12 }}>{producto.id}</td>
                        <td style={{ padding: 12 }}>{producto.nombre}</td>
                        <td style={{ padding: 12 }}>{producto.categoria}</td>
                        <td style={{ padding: 12 }}>${producto.precio}</td>
                        <td style={{ padding: 12 }}>{producto.stock}</td>
                        <td style={{ padding: 12 }}>{producto.proveedor || 'N/A'}</td>
                        <td style={{ padding: 12 }}>{producto.fechaRegistro || 'N/A'}</td>
                        <td style={{ padding: 12 }}>{producto.estado || 'N/A'}</td>
                        <td style={{ padding: 12 }}>
                          {/* El botón rojo para borrar */}
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
import { useEffect, useState } from 'react';
import { FormProducto } from './components/FormProducto';
import type { Producto } from './types/producto';
import { Button } from '@mui/material';
import { Login } from './components/Login';
import type { LoginFormData } from './types/login';

const API_URL = "http://localhost:3000/api/productos";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('themeMode');
      return saved === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.body.className = themeMode;
    window.localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const themeToggleButton = (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      title={themeMode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
    >
      {themeMode === 'light' ? '🌙' : '☀️'}
    </button>
  );

  // Función equivalente a obtenerProductos() de tu app.js
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch(API_URL);
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // Función equivalente a eliminarProducto(id) de tu app.js
  const eliminarProducto = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await fetch(`${API_URL}/${id}`, {
          method: "DELETE"
        });
        alert("Producto eliminado");
        obtenerProductos(); // Recarga la lista
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleIniciarSesion = async (datos: LoginFormData) => {
    console.log("Intentando iniciar sesión con:", datos);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsAuthenticated(true);
    alert(`¡Hola ${datos.email}!`);
  };

  // Carga inicial de productos al autenticarse
  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      obtenerProductos();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <>
        {themeToggleButton}
        <Login 
          title="TechStore" 
          subtitle="Ingresa a tu cuenta para administrar el inventario"
          onSubmit={handleIniciarSesion} 
        />
      </>
    );
  }

  return (
    <>
      {/* Conservamos el diseño semántico del index.html */}
      <header>
        <div className="header-content">
          <div>
            <h1>TechStore</h1>
            <p>Sistema Web de Gestión de Productos (React + TS)</p>
          </div>
        </div>
      </header>
      <button type="button" className="theme-toggle" onClick={toggleTheme} title={themeMode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
        {themeMode === 'light' ? '🌙' : '☀️'}
      </button>
      <nav>
        <a href="#">Inicio</a>
        <a href="#productos">Productos</a>
        <a href="#registro">Registrar Producto</a>
      </nav>

      <main>
        <section className="hero">
          <h2>Administración de Inventario</h2>
          <p>Consulta, registra y elimina productos mediante una API REST utilizando componentes modernos.</p>
        </section>

        {/* Formulario que creamos con MUI + Zod */}
        <section id="registro">
          <FormProducto onProductoGuardado={obtenerProductos} />
        </section>

        {/* Tabla de Productos basada en tus estilos CSS nativos */}
        <section id="productos" className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2>Lista de Productos</h2>
            <Button variant="outlined" onClick={obtenerProductos} sx={{ color: '#1e3a5f', borderColor: '#1e3a5f' }}>
              Actualizar Lista
            </Button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={6}>No hay productos registrados o el servidor está apagado.</td>
                </tr>
              ) : (
                productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.categoria}</td>
                    <td>${producto.precio}</td>
                    <td>{producto.stock}</td>
                    <td>
                      <button 
                        onClick={() => eliminarProducto(producto.id)}
                        style={{ padding: '6px 12px', background: '#d32f2f', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>

      <footer>
        <p>TechStore | Práctica de Aplicaciones Web y API</p>
      </footer>
    </>
  );
}

export default App;
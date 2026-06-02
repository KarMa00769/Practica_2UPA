# TechStore 🚀

Sistema Web de Gestión de Productos, diseñado con una arquitectura moderna y dockerizada que separa el Frontend y el Backend para una mayor escalabilidad.

## 💻 Tecnologías Utilizadas

### Frontend
- **React (con Vite)**: Para una interfaz rápida e interactiva.
- **TypeScript**: Para un tipado seguro y código robusto.
- **Material-UI (MUI)**: Componentes de diseño para una estética moderna y limpia (Glassmorphism, Modo Claro).
- **React Hook Form + Zod**: Para el manejo y validación segura de formularios (ej. Inicio de sesión y registro de productos).

### Backend (API)
- **Django**: Framework de Python rápido y seguro para el desarrollo del backend.
- **Django REST Framework (DRF)**: Para construir la API que alimentará al frontend.
- **JWT**: Para una autenticación segura basada en tokens.
- **Pandas (Python)**: Preparado para la futura generación y análisis de gráficas.

### Base de Datos & Infraestructura
- **PostgreSQL**: Base de datos relacional robusta.
- **Docker & Docker Compose**: Para orquestar y ejecutar toda la infraestructura (React, Django y Postgres) de manera unificada y sin problemas de compatibilidad en cualquier computadora.

---

## 🚀 Cómo Iniciar el Proyecto

El proyecto está completamente dockerizado. Para arrancarlo, simplemente asegúrate de tener Docker instalado y ejecuta en la raíz del proyecto:

```bash
docker-compose up -d --build
```

> 📖 **Nota:** Para instrucciones más detalladas sobre cómo iniciar el proyecto por primera vez y acceder a los contenedores, revisa el archivo [GUIA_DOCKER.md](./GUIA_DOCKER.md).

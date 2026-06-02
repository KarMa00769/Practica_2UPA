# Guía de Dockerización del Proyecto TechStore

Esta guía explica cómo está estructurado el entorno Dockerizado para trabajar simultáneamente con **React (Vite)** en el Frontend, **Django (Python)** en el Backend y **PostgreSQL** como Base de Datos.

## Estructura Creada

Se han generado los siguientes archivos:
1. `docker-compose.yml` en la raíz del proyecto.
2. `Dockerfile` para el Frontend en `Fronted/techstore-frontend/Dockerfile`.
3. `Dockerfile` para el Backend en `Backend/Dockerfile`.
4. `requirements.txt` en `Backend/requirements.txt` con las dependencias necesarias.

## Servicios Configurados en `docker-compose.yml`

El archivo orquestador levanta 3 servicios de manera conjunta:

### 1. Base de Datos (`db`)
- Utiliza la imagen oficial de `postgres:15-alpine` (ligera y segura).
- Configura usuario, contraseña y nombre de base de datos predeterminados.
- Monta un volumen llamado `postgres_data` para que tus registros y tablas no se pierdan si el contenedor se apaga.
- **Puerto expuesto:** `5432`.

### 2. Backend API (`backend`)
- Utiliza Python 3.12 y descarga librerías clave como Django, DRF, JWT, Pandas y dependencias para conectarse a Postgres (`psycopg2`).
- Monta el código de tu carpeta `Backend` de modo que cualquier cambio que guardes en tu editor se reflejará inmediatamente sin tener que reconstruir la imagen.
- Está configurado para iniciar el servidor de desarrollo en el puerto `8000`.
- Tiene una medida de seguridad: Si no has ejecutado `django-admin startproject` todavía, el contenedor se mantendrá vivo en "reposo" para que puedas entrar e inicializarlo.

### 3. Frontend (`frontend`)
- Utiliza `node:20-alpine`.
- Copia e instala tus dependencias del `package.json` existente.
- Monta tus archivos locales sobre el contenedor para que Vite detecte los cambios en vivo (*Hot Module Replacement*).
- **Puerto expuesto:** `5173`.

---

## Instrucciones de Uso

Para poner en marcha todo este entorno, asegúrate de tener [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y ejecutándose, luego sigue estos pasos abriendo una terminal en la raíz de tu proyecto:

### 1. Construir e Iniciar los Contenedores
Ejecuta el siguiente comando para construir las imágenes y levantar los 3 servicios en segundo plano:

```bash
docker-compose up -d --build
```

### 2. Inicializar el Proyecto Django (Sólo la primera vez)
Como aún no hemos creado los archivos de Django, debes acceder al contenedor del backend e inicializar tu API:

```bash
# Entra a la consola interactiva del contenedor de backend
docker exec -it techstore_backend bash

# Ya dentro del contenedor, inicializa el proyecto Django (no olvides el punto al final)
django-admin startproject config .

# Sal del contenedor escribiendo "exit"
exit
```

Tras hacer esto, notarás que los archivos de Django aparecerán por arte de magia en tu carpeta `/Backend/` de tu máquina local.

### 3. Reiniciar el Backend
Como ya creaste el proyecto de Django, vamos a reiniciar el contenedor para que detecte el `manage.py` y levante el servidor correctamente:

```bash
docker-compose restart backend
```

### 4. Accesos a tu Aplicación
¡Ya tienes todo funcionando!

- **Frontend (React):** [http://localhost:5173](http://localhost:5173)
- **Backend (API Django):** [http://localhost:8000](http://localhost:8000)
- **Base de Datos (PostgreSQL):** `localhost:5432` (Con usuario: `techstore_user` y contraseña: `techstore_password`).

### 5. Apagar Todo
Cuando termines de trabajar y quieras apagar los servicios (sin perder tus datos de la base de datos), ejecuta:

```bash
docker-compose down
```

# Documentación de la Base de Datos y Orquestación

## ¿Qué es la Base de Datos en este proyecto?
Siguiendo la analogía del restaurante (donde Frontend es el Salón y Backend es la Cocina), la **Base de Datos** es la **Bodega de Ingredientes Subterránea**. Es el lugar ultraseguro y altamente organizado donde guardamos la información real (los productos de la tienda y los usuarios) para que, aunque el restaurante cierre y se apague la luz, los datos sigan ahí al día siguiente.

El proyecto utiliza **PostgreSQL**, uno de los motores de bases de datos más robustos del mundo.

---

## 1. Archivos Relacionados con la Base de Datos

### `Backend/seed_productos.py` (El Llenador Automático)
Imagina que inauguramos la tienda pero nuestros estantes están vacíos. Sería muy tedioso añadir productos de uno en uno usando el teclado. 
Este archivo soluciona eso: contiene una lista gigante con 50 productos de mentira pre-armados (laptops, teclados, impresoras). Cuando lo ejecutamos, habla con Django y llena de inmediato la bodega entera para que tengamos con qué hacer pruebas visuales rápidamente.

### `Backend/productos/models.py` (El Traductor ORM)
Normalmente, para hablar con la Bodega, tendríamos que usar su lenguaje nativo llamado SQL (ejemplo: `SELECT * FROM productos;`). 
Sin embargo, Django incluye una herramienta mágica llamada **ORM**. En este archivo escribimos clases simples en Python, y Django automáticamente sabe cómo ir a PostgreSQL a crear las tablas y cajones exactos sin que nosotros escribamos ni una sola línea de código SQL.

### Conexión en `config/settings.py`
En este archivo (dentro del backend) está la "tarjeta de acceso" a la bodega. Tiene una sección llamada `DATABASES` donde le escribimos a Django la IP de la bodega, el nombre de usuario (`techstore_user`) y la contraseña (`techstore_password`).

---

## 2. Orquestación: Docker Compose (El Director de Orquesta)

Nuestro proyecto está dividido en tres pedazos separados:
1. La Base de Datos (Postgres)
2. El Backend (Django)
3. El Frontend (React)

Para no tener que prenderlos manualmente uno por uno cada día (lo cual tomaría mucho tiempo e instalación de programas), usamos **Docker**.

### `docker-compose.yml` (La Batuta del Director)
Este es, sin lugar a dudas, uno de los archivos clave para mantener todo unido. Es el plano general del edificio que le dice a la computadora:
- "Primero, arranca el cuarto blindado de la Base de Datos (usando la plantilla `postgres:15-alpine`). Abrele la puerta 5432."
- "Además, te pido que crees un **Volumen** (`postgres_data`). Es como un disco duro mágico externo. Así, si borramos el contenedor por accidente, los datos no se destruyen, quedan a salvo en el disco mágico."
- "Una vez que la bodega esté lista, arranca la Cocina (Backend) en el puerto 8000."
- "Y finalmente, arranca el Salón Comedor (Frontend) en el puerto 5173 para que los clientes entren."

Gracias a este archivo, con escribir un solo comando (`docker-compose up`), todo el restaurante cobra vida mágicamente de forma sincronizada y todos saben cómo comunicarse con los demás.

# Tecnologías Utilizadas - TechStore 🏬

Este documento contiene un resumen detallado del **Stack Tecnológico** que estamos usando en nuestra aplicación web. Para facilitar tu estudio para el examen, cada tecnología se explica con su concepto técnico y su analogía con el **Restaurante TechStore**.

---

## 🍽️ 1. FRONTEND (El Comedor y el Menú)
*Es la parte cliente de la aplicación. Todo lo que el usuario ve en su navegador, los botones que presiona y los gráficos que consulta.*

### ⚛️ React (v19)
*   **¿Qué es?** Una biblioteca de JavaScript creada por Facebook para construir interfaces de usuario de forma interactiva y modular mediante componentes.
*   **En nuestro restaurante:** Es el **diseñador del comedor**. Se encarga de pintar y organizar las mesas (componentes) de manera inteligente. Si un cliente pide ver el catálogo, React cambia el contenido de la mesa dinámicamente sin necesidad de reconstruir todo el restaurante.

### ⚡ Vite (v8)
*   **¿Qué es?** Una herramienta moderna de desarrollo que empaqueta y sirve el código de manera extremadamente rápida.
*   **En nuestro restaurante:** Es el **electricista y repartidor rápido**. Organiza los cables de las luces y asegura que cuando el cliente abra la puerta del restaurante (cargue la web), todo esté listo y servido en milisegundos.

### 📘 TypeScript
*   **¿Qué es?** Un superconjunto de JavaScript que añade tipos estáticos (reglas estrictas para declarar variables y funciones).
*   **En nuestro restaurante:** Es el **supervisor de calidad**. Revisa las recetas y las órdenes antes de que salgan al cliente, asegurándose de que nadie pida un ingrediente que no existe (evita errores de escritura en el código).

### 🎨 Material UI (MUI v9)
*   **¿Qué es?** Una biblioteca de diseño basada en los estándares de Material Design de Google, con componentes visuales ya programados.
*   **En nuestro restaurante:** Son los **muebles y vajilla fina prefabricados**. En lugar de construir una silla o un botón desde cero con madera cruda (HTML/CSS puro), compramos muebles de diseñador ya hechos y listos para usar.

### 📋 React Hook Form y Zod
*   **¿Qué son?** Herramientas para gestionar formularios y validar que los datos que el usuario introduce sean correctos.
*   **En nuestro restaurante:** Es el **mesero estricto**. Si intentas llenar el formulario para registrar un nuevo producto y dejas el nombre vacío o pones un precio negativo, Zod te frena y dice: *"Tu orden está incompleta o mal llenada, corrígela"*.

### 📊 Recharts
*   **¿Qué es?** Una biblioteca para crear gráficos ilustrativos y responsivos utilizando React y SVG.
*   **En nuestro restaurante:** Es la **pizarra de ofertas y estadísticas**. Dibuja gráficos coloridos e interactivos para que los dueños del restaurante vean de un vistazo el inventario de la despensa.

### 📄 jsPDF y XLSX (SheetJS)
*   **¿Qué son?** Librerías de JavaScript para generar y descargar archivos en formatos PDF y Excel desde el navegador.
*   **En nuestro restaurante:** Es la **impresora de tickets**. Te permite imprimir la lista de productos en una hoja de papel (PDF) o descargar el balance general en una hoja de cálculo (Excel).

---

## 🍳 2. BACKEND (La Cocina)
*El servidor que procesa las peticiones, gestiona la lógica de negocios, aplica la seguridad y habla con la base de datos.*

### 🐍 Python
*   **¿Qué es?** Un lenguaje de programación de alto nivel, conocido por su sintaxis clara, limpia y legible.
*   **En nuestro restaurante:** Es el **idioma oficial** de la cocina. Todos los chefs y ayudantes de cocina hablan en Python para entenderse.

### 🌶️ Django (v5.0)
*   **¿Qué es?** Un framework web de Python de alto nivel que fomenta el desarrollo rápido y un diseño limpio.
*   **En nuestro restaurante:** Es la **cocina profesional equipada**. Viene con los hornos, refrigeradores y la campana extractora listos para usarse. Django nos da la estructura base para no tener que construir las tuberías ni la estufa desde cero.

### 🔌 Django REST Framework (DRF)
*   **¿Qué es?** Una extensión potente para Django que facilita la construcción de APIs RESTful.
*   **En nuestro restaurante:** Es la **ventana pasa-platos (API)**. El mesero (Frontend) deja la nota con la orden en esta ventana, y el cocinero (Backend) le regresa el plato preparado con la comida en una charola estándar. En informática, esa charola estándar se llama formato **JSON**.

### 🔑 Simple JWT
*   **¿Qué es?** Un paquete para DRF que provee autenticación basada en JSON Web Tokens (tokens de seguridad).
*   **En nuestro restaurante:** Es la máquina que imprime los **brazaletes VIP**. Cuando inicias sesión con tu usuario y contraseña, la cocina te da un brazalete (token). A partir de ahí, cada vez que le pidas algo a la cocina (como ver productos privados), solo tienes que mostrar tu brazalete.

### 🛡️ Django CORS Headers
*   **¿Qué es?** Una aplicación de Django para manejar el Intercambio de Recursos de Origen Cruzado (CORS), permitiendo que otros servidores consuman la API.
*   **En nuestro restaurante:** Es el **policía de la puerta trasera**. Permite que el comedor (React, que vive en el puerto 5173) y la cocina (Django, que vive en el puerto 8000) se comuniquen de forma segura sin que el navegador bloquee la conexión.

### 🐼 Pandas
*   **¿Qué es?** Una biblioteca de análisis y manipulación de datos muy popular en la ciencia de datos.
*   **En nuestro restaurante:** Es un **asistente de cocina experto en matemáticas**. Ayuda a ordenar y procesar rápidamente listas de productos cuando se suben archivos masivos.

---

## 📦 3. BASE DE DATOS (La Despensa Subterránea)
*Donde guardamos toda la información valiosa de manera permanente.*

### 🐘 PostgreSQL
*   **¿Qué es?** Un sistema de gestión de bases de datos relacionales potente, robusto y de código abierto.
*   **En nuestro restaurante:** Es la **despensa subterránea bajo llave**. Toda la información de productos (nombre, precio, cantidad) y de usuarios se guarda ahí en cajones perfectamente etiquetados y ordenados (tablas).

### 🔌 Psycopg2
*   **¿Qué es?** El adaptador de base de datos PostgreSQL más popular para el lenguaje de programación Python.
*   **En nuestro restaurante:** Es el **elevador de carga**. Permite subir ingredientes de la despensa (base de datos) a la cocina (Django) y volver a bajar los platos limpios o las sobras.

---

## 🎼 4. ORQUESTACIÓN Y CONTENEDORES (El Director)
*Herramientas para empaquetar la aplicación y asegurar que funcione en cualquier computadora.*

### 🐳 Docker
*   **¿Qué es?** Una plataforma que permite empaquetar una aplicación con todas sus dependencias en una unidad estandarizada llamada "contenedor".
*   **En nuestro restaurante:** Son **cajas térmicas de envío idénticas**. Guardamos la cocina (Backend) en una caja, el comedor (Frontend) en otra y la despensa (Base de Datos) en otra. No importa si tu profesor usa Mac, Windows o Linux; al abrir estas cajas, el restaurante funcionará exactamente igual sin configurar nada en la computadora del profesor.

### 🐙 Docker Compose
*   **¿Qué es?** Una herramienta para definir y ejecutar aplicaciones Docker de múltiples contenedores de forma coordinada.
*   **En nuestro restaurante:** Es el **manual de apertura maestro / director de la orquesta**. Con un solo comando, lee las instrucciones y le dice a Docker: *"Primero enciende la despensa (PostgreSQL), espera a que esté lista, luego enciende la cocina (Django) y finalmente abre el comedor (React)"*.

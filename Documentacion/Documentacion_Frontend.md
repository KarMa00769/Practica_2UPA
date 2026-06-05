# Documentación del Frontend (React + Vite)

## ¿Qué es el Frontend en este proyecto?
Siguiendo la analogía del restaurante, el **Frontend** es **El Salón Comedor y el Menú**. Es la parte que el usuario final realmente ve, toca e interactúa. No sabe cómo se preparan los datos, solo sabe cómo mostrarlos bonitos en la pantalla y cómo avisarle a los meseros cuando el usuario hace clic en un botón.

Está construido utilizando **React** (una librería para crear interfaces web), impulsado por **Vite** (un motor ultra rápido para armar el código) y escrito en **TypeScript** (JavaScript con reglas estrictas).

---

## 1. El Esqueleto Inicial

### `index.html` (El Cascarón Vacío)
Es literalmente el lienzo en blanco. Es el único archivo HTML de todo el proyecto. Adentro tiene un contenedor vacío llamado `<div id="root">`. React buscará este contenedor para inyectar y pintar toda la aplicación adentro de él.

### `src/main.tsx` (La Semilla)
Es el archivo que arranca todo. Su único trabajo es agarrar toda nuestra aplicación de React (App.tsx) y "plantarla" dentro del cascarón vacío del `index.html`. 

### `src/App.tsx` (El Enrutador de Caminos)
Es el corazón de las pantallas. Este archivo decide qué componente se muestra dependiendo de la URL en la que esté el usuario:
- Si no está logueado, lo manda a la pantalla de `<Login />`.
- Si está logueado, lo manda al `<Dashboard />` (donde están los productos).
También envuelve toda la app en los colores y temas de Material UI (MUI).

---

## 2. Los Componentes Visuales (Carpeta `src/components/`)
Aquí están las piezas de Lego con las que armamos las pantallas.

### `Login.tsx` (La Puerta del Cadenero)
Es el formulario donde el usuario pone su email y contraseña. Cuando presiona "Entrar", este componente le pide al Backend que valide los datos. Si son correctos, el Backend nos da un "Brazalete VIP" (Token JWT). 

### `Dashboard.tsx` (La Tabla de Control)
Es la pantalla principal. Tan pronto como el usuario entra, este componente "llama al mesero" (hace un fetch al backend) para pedir la lista de productos y los dibuja en una tabla muy bonita y estilizada. También tiene los botones para borrar y editar productos.

### `FormProducto.tsx` (La Hoja de Registro)
Es un formulario emergente (Modal) inteligente. 
- Si lo abrimos para agregar, sus cajas de texto están vacías.
- Si lo abrimos para editar un producto, automáticamente se rellena con los datos existentes.
Utiliza reglas estrictas (con una librería llamada Zod) para asegurar que no mandemos textos vacíos o precios en negativo al Backend.

---

## 3. Estado y Contexto (Carpeta `src/context/`)

### `AuthContext.tsx` (La Memoria del Brazalete VIP)
Es un almacén global. Si guardáramos el estado de "el usuario inició sesión" en un solo botón, las demás pantallas no se enterarían. Este Contexto funciona como una nube en nuestra página: guarda el "Brazalete VIP" (Token JWT) en la memoria de la computadora local (Local Storage). Así, si recargamos la página mañana, la aplicación recuerda que ya estábamos adentro y no nos vuelve a pedir la contraseña.

---

## 4. Tipos de Datos (Carpeta `src/types/`)

### `producto.ts` y `login.ts`
Son los "Moldes" pero en la versión de React. Le dicen a nuestro editor de código: "Oye, recuerda que un producto siempre debe tener un `precio` numérico y un `nombre` en texto. Si intento ponerle letras al precio, márcame un error en rojo de inmediato". Previenen errores humanos antes de guardar el archivo.

---

## 5. Archivos de Configuración y Estilo

### `src/index.css` (La Paleta de Pinturas)
Es el archivo de diseño global. Aunque usamos Material UI para los botones y tablas, en este archivo definimos variables maestras como los colores exactos para el "Modo Claro" (tonos café) y el "Modo Oscuro" (tonos casi negros). 

### `vite.config.ts` (El Motor Vite)
Le dice al empaquetador de la página cómo debe comportarse para entender correctamente el código de React.

### `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` (Los Manuales de Reglas)
Son los archivos que leen TypeScript para saber qué tan estricto debe ser con nosotros cuando programamos. Vigilan que no dejemos variables sin usar y que traduzcamos el código a un JavaScript moderno que Chrome y Safari puedan entender perfectamente.

### `Fronted/techstore-frontend/Dockerfile`
La "Receta de Cocina" de React. Instala Node.js, descarga todas nuestras librerías y arranca el entorno en modo desarrollo en el puerto 5173 para que lo veamos funcionando.

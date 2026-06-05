# 🎓 Guía de Preguntas para el Examen: Práctica 2

Esta guía está diseñada **específicamente** basándose en los puntos exactos de la rúbrica de tu "Práctica 2: Análisis y Desarrollo de una Aplicación Web con API". Aquí tienes las preguntas que muy probablemente te hará tu profesor y cómo responderlas de forma sencilla.

---

## 📚 Parte 1: Conceptos y Clasificación

**1. ¿Cuál es la diferencia entre una Página Web, un Sitio Web y un Sistema Web?**
*   **Página Web:** Es un solo documento electrónico (como un volante de papel). No interactúas con ella, solo lees. *Ejemplo: Una página de Wikipedia.*
*   **Sitio Web:** Es un conjunto de páginas web conectadas entre sí (como un libro completo). *Ejemplo: El blog de una empresa.*
*   **Sistema Web (o Aplicación Web):** Es un programa completo donde el usuario interactúa, modifica datos, inicia sesión y hace procesos complejos. *Ejemplo: Facebook, Netflix, o nuestro proyecto TechStore.*

**2. ¿Qué es una API y para qué sirve en este proyecto?**
*   **Respuesta:** API significa Interfaz de Programación de Aplicaciones. Es el "mesero" o el "puente" que permite que dos programas diferentes hablen entre sí. En nuestro proyecto, la API permite que el Frontend (React/Comedor) se comunique con el Backend (Django/Cocina) para pedirle la lista de productos o registrar uno nuevo.

**3. Explícame el Modelo Cliente-Servidor.**
*   **Respuesta:** Es una arquitectura donde hay dos partes:
    *   **El Cliente:** Quien pide la información (el navegador del usuario usando nuestro Frontend en React).
    *   **El Servidor:** Quien tiene la información y la procesa (nuestro Backend en Django).
    *   **El Flujo:** El cliente manda una petición (pide el menú), el servidor la procesa y manda una respuesta (entrega los datos).

**4. ¿Qué es el Modelo de Tres Capas? ¿Cómo se aplica en TechStore?**
*   **Capa de Presentación:** Lo que ve el usuario (Nuestro Frontend en React/HTML/CSS).
*   **Capa de Negocio:** La lógica y las reglas (Nuestro Backend en Django, que decide si un producto se puede guardar).
*   **Capa de Datos:** Donde se guarda todo (Nuestra base de datos PostgreSQL).

**5. ¿Qué es la arquitectura MVC (Modelo-Vista-Controlador)?**
*   **Modelo:** Representa los datos (La estructura del producto en nuestra base de datos).
*   **Vista:** Lo que ve el usuario (Las pantallas de React).
*   **Controlador:** El cerebro que recibe la orden de la Vista, consulta al Modelo, y devuelve la respuesta. (En Django, esto lo hacen las "Views" de la API).

**6. Menciona los tipos de APIs que investigaste.**
*   **API de Acceso a Datos:** Para consultar bases de datos externas.
*   **API Cliente-Servidor:** (La que usamos) El cliente pide, el servidor responde.
*   **API Punto a Punto (P2P):** Las computadoras se conectan directamente entre sí sin un servidor central (ej. Torrents).
*   **API en Tiempo Real:** Usan WebSockets para mantener una conexión abierta siempre (ej. chats de WhatsApp).

---

## 🏗️ Parte 2: Arquitectura del Proyecto

**7. Si te pido dibujar o explicar el Diagrama de Arquitectura de tu proyecto, ¿cuál es el flujo?**
*   **Respuesta:** El flujo es lineal: El **Cliente Web** (Navegador/React) hace una petición a través de internet hacia nuestra **API REST** (Django). La API procesa la petición y va a buscar o guardar la información a la **Base de Datos** (PostgreSQL). Luego la API devuelve la respuesta al Cliente.

---

## 💻 Parte 3: Desarrollo Backend y Endpoints

**8. La rúbrica permitía Node.js, Flask, FastAPI o Spring Boot. ¿Por qué eligieron Django (Python)?**
*   **Respuesta:** *(El profesor preguntará esto porque la rúbrica pide justificar si se usa otra tecnología).* Elegimos Python con **Django y Django REST Framework** porque es una tecnología extremadamente robusta y segura. A diferencia de usar solo listas en memoria (como sugería la práctica para empezar), Django nos permitió conectarnos fácilmente a una base de datos real (PostgreSQL) y crear la API REST de manera mucho más profesional y escalable para el futuro de TechStore.

**9. ¿Qué estructura JSON tiene el producto que están guardando?**
*   **Respuesta:** Tiene `id`, `nombre`, `precio` y `categoria`. Por ejemplo:
    ```json
    {
      "id": 1,
      "nombre": "Laptop",
      "precio": 15000,
      "categoria": "Electrónica"
    }
    ```

**10. Explícame qué son los métodos GET, POST y DELETE que usaron en sus endpoints.**
*   **GET `/api/productos`:** Sirve para **leer** o pedir información. Lo usamos para traer la lista de todos los productos o consultar uno específico por su ID.
*   **POST `/api/productos`:** Sirve para **crear** o enviar información nueva. Lo usamos cuando registramos un teclado o un mouse nuevo.
*   **DELETE `/api/productos/1`:** Sirve para **eliminar** información. Lo usamos para borrar el producto con el ID número 1.

**11. La rúbrica dice que podían guardar en "arreglos o listas" en memoria. ¿Ustedes qué hicieron?**
*   **Respuesta:** Nosotros fuimos un paso más allá. En lugar de usar listas temporales (que se borran si se apaga el servidor), implementamos una base de datos real con **PostgreSQL**. Esto hace que nuestro sistema sea persistente y esté verdaderamente listo para una empresa como TechStore.

---

## 🧪 Parte 4: Pruebas de la API

**12. ¿Cómo probaron que la API funcionaba antes de conectarla al Frontend?**
*   **Respuesta:** Usamos herramientas de consumo de API (como Postman o Thunder Client). Ahí simulamos ser el cliente, pusimos la URL de nuestro servidor (`http://localhost:8000/api/productos`), seleccionamos el método (GET, POST o DELETE), enviamos la petición y verificamos que el servidor nos devolviera un código de éxito (como `200 OK` o `201 Created`) junto con los datos en formato JSON.

---

### 💡 Consejo Final para el Examen:
Si el profesor te pregunta cualquier cosa sobre **"cómo funciona"**, recuerda siempre la analogía: **El Cliente (Comedor) hace una orden al Mesero (API), quien la lleva a la Cocina (Backend), la cual busca los ingredientes en la Despensa (Base de Datos) y devuelve el plato listo.**

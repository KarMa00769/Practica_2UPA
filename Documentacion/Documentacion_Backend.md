# Documentación del Backend (Django REST Framework)

## ¿Qué es el Backend en este proyecto?
Imagina que nuestra aplicación es un restaurante. El **Backend** es la **Cocina**. Los clientes (el frontend) nunca entran a la cocina, pero envían sus pedidos a través de los meseros (la red). La cocina se encarga de revisar que la orden sea correcta, preparar los datos (cocinar) y enviar el platillo terminado de vuelta al cliente.

En nuestro caso, la "cocina" está construida con **Django**, un poderoso programa escrito en el lenguaje de programación Python.

---

## 1. El Núcleo de la Cocina (Carpeta `config/`)
Aquí es donde están las reglas de oro y el plano general del restaurante.

### `config/settings.py` (El Cerebro Central)
Es el archivo más grande e importante de configuración. Aquí le decimos a Django:
- Qué bases de datos usar (dónde están las bodegas de comida).
- Qué "apps" o sub-secciones existen en el proyecto.
- Quién tiene permiso de hablar con la cocina (configuración de CORS).
- Cómo vamos a proteger la información (Contraseñas, JWT, Idioma).

### `config/urls.py` (El Recepcionista Principal)
Cuando alguien hace una petición de internet a nuestra aplicación (por ejemplo, "quiero ver los productos"), este archivo es el primero que la recibe. Su único trabajo es mirar la dirección web y decir: *"Ah, buscas productos, tienes que hablar con el guía de la sección de productos"*.

### `config/wsgi.py` y `config/asgi.py` (Las Puertas de Entrada)
Son los porteros del servidor de internet. 
- **WSGI** es la puerta clásica y síncrona.
- **ASGI** es una puerta giratoria moderna para recibir múltiples conexiones ultra-rápidas a la vez.

---

## 2. La Aplicación Específica (Carpeta `productos/`)
Django divide el código en "Apps". Esta app maneja específicamente el inventario de nuestra tienda TechStore.

### `productos/models.py` (El Molde de Galletas)
Aquí diseñamos cómo es un "Producto". Le decimos a la base de datos exactamente qué campos necesita guardar: nombre (texto), precio (números con decimales), stock (números enteros), categoría, etc. Si un dato no cabe en este molde, Django no permite que se guarde.

### `productos/serializers.py` (El Traductor Oficial)
Django habla "Python", pero el Frontend y el Internet hablan "JSON" (un formato de texto universal). El trabajo del Serializador es tomar la información compleja de Python que sale del Molde de Galletas y traducirla a texto plano para que el Frontend la entienda, y viceversa.

### `productos/views.py` (El Cajero o Despachador)
Aquí está la "Lógica de Negocios". Las vistas deciden qué pasa cuando alguien pide algo.
- Si alguien manda un `GET`, la vista busca la lista de productos en la bodega y se los manda al traductor.
- Si alguien manda un `POST`, la vista toma los datos nuevos, revisa que estén bien formados, y los guarda en la base de datos.
Aquí también se verifica si el cliente tiene su "Gafete VIP" (Token JWT) antes de dejarlo guardar cosas.

### `productos/urls.py` (El Guía de la Sección)
Es un recepcionista más pequeño que trabaja solo para la sección de productos. Conecta las direcciones específicas (como `/productos/1/`) directamente con la función correcta del Cajero (`views.py`).

### `productos/admin.py`
Le avisa a Django que queremos poder modificar nuestros Productos desde el Panel de Control Secreto de Administradores (una página web especial que Django nos regala gratis).

### `productos/tests.py`
Aquí viven los "robots probadores". Son scripts que escribimos para que simulen ser usuarios presionando botones y verificando que el código no se rompa cuando hagamos actualizaciones en el futuro.

---

## 3. Archivos de Soporte

### `manage.py` (El Volante del Coche)
Es la herramienta de consola. Nos permite ejecutar comandos importantes escribiendo en la terminal, como arrancar el servidor (`python manage.py runserver`), crear administradores o empujar los moldes a la base de datos.

### `Backend/Dockerfile` (La Receta de Construcción)
Es el archivo que Docker lee para saber cómo crear una "Computadora Virtual" nueva y limpia, instalarle Python, copiar nuestro código de Django adentro, e iniciar la cocina automáticamente para que no tengamos que instalar todo manualmente en cada computadora.

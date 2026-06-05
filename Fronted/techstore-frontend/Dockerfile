# Archivo: Fronted/techstore-frontend/Dockerfile
# Esta es la "Receta de Cocina" para preparar la computadora que va a correr React.

# Paso 1: Elegimos una compu ligerita que ya venga con Node.js (la herramienta que usa React/Vite para funcionar).
FROM node:20-alpine

# Paso 2: Creamos y entramos a la carpeta '/app' adentro de la nueva compu.
WORKDIR /app

# Paso 3: Copiamos la lista de compras de Node.js (los packages).
# El asterisco (*) significa "trae también el archivo package-lock.json si existe".
COPY package.json package-lock.json* ./

# Paso 4: Le pedimos a Node que instale absolutamente todas las dependencias.
RUN npm install

# Paso 5: Copiamos TODO nuestro código fuente de la página web adentro de la compu.
COPY . .

# Paso 6: Le avisamos a los demás contenedores que nuestro React estará transmitiendo en el puerto 5173.
EXPOSE 5173

# Paso 7: El botón de encendido. Arrancamos Vite en modo desarrollo y le decimos "--host 0.0.0.0" 
# para que nos deje ver la página desde nuestra computadora real, fuera del contenedor.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

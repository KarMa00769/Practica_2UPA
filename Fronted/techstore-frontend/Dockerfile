# Etapa de desarrollo para React/Vite
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Comando para iniciar en modo desarrollo exponiendo la red
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Archivo: Backend/Dockerfile
# Imagina que esto es una "Receta de Cocina" para preparar una computadora
# vacía y dejarla lista para correr nuestro servidor de Django.

# Paso 1: Elegimos nuestro ingrediente base. Una compu ligerita que ya tiene Python 3.12.
FROM python:3.12-slim

# Paso 2: Ajustes de la compu. 
# Le decimos a Python que no ensucie la carpeta con archivos basura (.pyc)
ENV PYTHONDONTWRITEBYTECODE=1
# Y le decimos que todo lo que imprima (errores, print) nos lo muestre inmediatamente en la pantalla sin retraso.
ENV PYTHONUNBUFFERED=1

# Paso 3: Creamos una carpeta llamada '/app' dentro de la compu nueva y entramos ahí.
WORKDIR /app

# Paso 4: Instalamos herramientas del sistema operativo que necesita PostgreSQL para funcionar bien.
# "apt-get" es como la tienda de apps de Linux.
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/* # Al final borramos la basura para ahorrar espacio.

# Paso 5: Copiamos nuestra lista de compras (librerías que usa Django).
COPY requirements.txt .

# Paso 6: Le decimos a Python que vaya a internet a descargar y preparar todas las librerías.
RUN pip install --no-cache-dir -r requirements.txt

# Paso 7: Copiamos TODO nuestro código del proyecto adentro de la carpeta /app.
COPY . .

# Paso 8: Le avisamos al mundo exterior: "¡Oigan, escuchen por el puerto 8000!".
EXPOSE 8000

# Paso 9: Este es el botón de encendido. Cuando la compu esté lista, arrancará automáticamente el servidor.
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Dockerfile para Django
FROM python:3.12-slim

# Evitar que Python escriba archivos .pyc y forzar logs directos sin buffer
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias del sistema necesarias para PostgreSQL y otras herramientas
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar el archivo de dependencias e instalarlas
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del proyecto backend
COPY . .

# Exponer el puerto de desarrollo de Django
EXPOSE 8000

# Comando por defecto (asumimos que el proyecto se llamará "backend")
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

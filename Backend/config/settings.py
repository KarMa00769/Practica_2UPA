"""
Archivo: settings.py
Piensa en este archivo como el "Cerebro Central de Reglas".
Aquí guardamos todas las contraseñas secretas, le decimos a Django qué 
bases de datos usar, qué idiomas hablar y qué "mini-aplicaciones" tiene activadas.
"""
# Importamos herramientas para manejar las rutas (carpetas) de la compu.
from pathlib import Path
import os

# Buscamos en qué carpeta estamos trabajando para que todo lo demás sea relativo a esto.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- Reglas de Seguridad ---

# ¡Esta es una llave súper secreta! Django la usa para asegurar contraseñas.
# En la vida real (producción), esto debe estar oculto.
SECRET_KEY = 'django-insecure-jgsg-l%@_d6gfmt2xpfa&nimc2xc#pkam5mr&q!e%!7wb@ck*s'

# MODO DEPURACIÓN: 'True' significa que si hay un error, nos va a decir exactamente qué falló.
# ¡Nunca lo dejes en True cuando lo subas a internet de verdad!
DEBUG = True

# ¿Quiénes pueden visitar nuestro servidor? Si está vacío, cualquiera en nuestra red local.
ALLOWED_HOSTS = []


# --- Definición de la Aplicación ---

# Lista de todas las "herramientas" que instalamos en nuestro proyecto.
INSTALLED_APPS = [
    'django.contrib.admin',         # El panel de administración
    'django.contrib.auth',          # Manejo de usuarios y contraseñas
    'django.contrib.contenttypes',  # Tipos de contenido
    'django.contrib.sessions',      # Las "sesiones" (para que no te pida contraseña en cada clic)
    'django.contrib.messages',      # Para mostrar notificaciones
    'django.contrib.staticfiles',   # Para manejar archivos estáticos (imágenes, CSS)
    
    # Herramientas de terceros que le agregamos:
    'rest_framework',               # Django REST Framework (Para hacer la API)
    'rest_framework_simplejwt',     # Herramienta para crear las "llaves" o Tokens (JWT)
    'corsheaders',                  # Herramienta para que React pueda pedir datos a Django sin que se bloquee.
    
    # Nuestras propias herramientas:
    'productos',                    # ¡La carpeta donde hicimos nuestra app de inventario!
]

# El "Middleware" son como guardias de seguridad en un pasillo.
# Cada vez que alguien hace una petición a internet, pasa por todos estos guardias uno por uno.
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # El guardia que deja pasar a React
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Le decimos dónde está el "Recepcionista principal" de las URLs.
ROOT_URLCONF = 'config.urls'

# Reglas para pintar cosas en pantalla (Aunque aquí casi no lo usamos porque usamos React)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Nuestra "Puerta Normal" para subir esto a producción.
WSGI_APPLICATION = 'config.wsgi.application'


# --- Base de Datos ---
# Aquí le decimos dónde guardar toda la información (Productos, Usuarios, etc).

# Primero, ponemos una de juguete o local (SQLite3) por si no hay nada más.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# PERO, si encendemos Docker, revisamos si nos pasaron datos secretos del entorno (environ).
if os.environ.get('POSTGRES_DB'):
    # Si sí, entonces cambiamos de base de datos a PostgreSQL (La base de datos seria/profesional).
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB'),            # Nombre de la BD
        'USER': os.environ.get('POSTGRES_USER'),          # Usuario
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),  # Contraseña secreta
        'HOST': os.environ.get('POSTGRES_HOST', 'db'),    # Dónde está alojada (nombre de la compu/contenedor)
        'PORT': os.environ.get('POSTGRES_PORT', 5432),    # Puerta de entrada a la BD
    }

# --- Configuraciones Especiales ---

# Le decimos al guardia de CORS: "Deja pasar las peticiones de cualquier página" (True).
# Ideal para que nuestro React (en puerto 5173) se pueda conectar sin problemas.
CORS_ALLOW_ALL_ORIGINS = True

# Configuramos la API (REST_FRAMEWORK):
REST_FRAMEWORK = {
    # Le decimos: "Para saber quién es un usuario, pídele siempre su Token JWT".
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}


# --- Reglas para crear Contraseñas ---
# Son los revisores que dicen: "Tu contraseña es muy corta" o "Esa contraseña es muy común".
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# --- Idioma y Hora ---

# Idioma de los mensajes de error.
LANGUAGE_CODE = 'en-us'

# Zona horaria (UTC = Universal).
TIME_ZONE = 'UTC'

# Habilitar traducciones y zonas horarias automáticas.
USE_I18N = True
USE_TZ = True


# --- Archivos Estáticos (Fotos, CSS) ---

# Dónde encontrar las imágenes o estilos de las páginas creadas en Django (como el admin).
STATIC_URL = 'static/'

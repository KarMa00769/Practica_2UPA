"""
Archivo: asgi.py
ASGI significa "Asynchronous Server Gateway Interface".
Imagina que es una "puerta giratoria" muy rápida para el servidor.
Sirve para cuando tu aplicación es muy grande y necesitas que muchas
personas se conecten al mismo tiempo sin hacer filas (como en un chat en vivo).
Por ahora, casi no lo usaremos en este proyecto básico, pero Django lo crea por si acaso.
"""

# Importamos herramientas del sistema
import os

# Importamos el "portero" de la puerta giratoria
from django.core.asgi import get_asgi_application

# Le decimos al portero dónde están las reglas del edificio (config.settings)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Creamos la aplicación (la puerta giratoria en sí) para que el servidor de internet la use.
application = get_asgi_application()

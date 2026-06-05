"""
Archivo: wsgi.py
WSGI significa "Web Server Gateway Interface".
Imagina que es la "puerta normal" de nuestro servidor.
Sirve para que nuestro código de Python (Django) pueda platicar con los
servidores de internet de verdad (como Apache o Nginx) cuando ya
subimos nuestra página a internet para que todo el mundo la vea.
"""

# Importamos herramientas del sistema
import os

# Importamos al "portero" de la puerta normal
from django.core.wsgi import get_wsgi_application

# Le decimos al portero dónde están las reglas de nuestro edificio (config.settings)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Creamos la aplicación (la puerta en sí) lista para que la usen en producción.
application = get_wsgi_application()

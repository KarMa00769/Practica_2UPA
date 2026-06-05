#!/usr/bin/env python
"""
Archivo: manage.py
Piensa en este archivo como el "Volante del Coche".
Es la herramienta principal que usamos en la consola para arrancar el servidor, 
hacer migraciones (crear las tablas en la base de datos) o crear usuarios.
"""
# Importamos herramientas del sistema operativo.
import os
import sys

# Esta es la función principal que hace que todo funcione.
def main():
    """Ejecuta las tareas administrativas de Django."""
    
    # Le decimos a Python: "Oye, las reglas y configuraciones del proyecto están en 'config.settings'".
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        # Intentamos traer la herramienta maestra de Django que lee nuestros comandos.
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # Si no la encuentra, lanza un error gigante diciendo "¡No tienes Django instalado!".
        raise ImportError(
            "No se pudo importar Django. ¿Estás seguro de que está instalado y "
            "disponible? ¿Olvidaste activar tu entorno virtual?"
        ) from exc
    
    # Si todo está bien, toma las palabras que escribimos en la consola (sys.argv) y las ejecuta.
    # Ej: 'python manage.py runserver' -> toma 'runserver' y arranca el servidor.
    execute_from_command_line(sys.argv)

# Este pedacito de código solo revisa si estamos corriendo este archivo directamente.
# Si es así, manda llamar a la función main() de arriba.
if __name__ == '__main__':
    main()

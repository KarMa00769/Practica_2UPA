"""
Archivo: apps.py
Esta es la "credencial" de presentación de nuestra aplicación 'productos'.
Le dice a Django: "¡Hola! Existo, y este es mi nombre."
"""
from django.apps import AppConfig

# Creamos la credencial
class ProductosConfig(AppConfig):
    # Le ponemos el nombre exacto de la carpeta
    name = 'productos'

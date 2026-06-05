"""
Módulo de enrutamiento de la aplicación 'productos'.
Mapea las URLs solicitadas por el cliente a las vistas correspondientes.
"""
# Importamos las herramientas de Django para crear las rutas de internet.
from django.urls import path, include

# Importamos el 'DefaultRouter'. ¡Es como un cartero automático!
# Nos ahorra tener que escribir cada ruta (GET, POST, DELETE) una por una.
from rest_framework.routers import DefaultRouter

# Importamos la vista que creamos, la que sabe qué hacer con los productos.
from .views import ProductoViewSet

# Creamos al cartero automático.
router = DefaultRouter()

# Le decimos al cartero: "Cuando alguien vaya a la ruta base (''), mándalo a ProductoViewSet".
# 'basename' es solo un apodo interno que usa Django.
router.register(r'', ProductoViewSet, basename='producto')

# urlpatterns es la lista oficial de rutas que Django leerá.
urlpatterns = [
    # Incluimos todas las rutas que el cartero automático (router) creó por nosotros.
    path('', include(router.urls)),
]

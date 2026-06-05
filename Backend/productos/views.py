"""
Módulo de vistas de la aplicación 'productos'.
Define la lógica de negocio y cómo se responden las peticiones HTTP (Capa de Negocio).
"""
# Importamos 'viewsets' que nos ayuda a crear las acciones (Ver, Crear, Borrar) automáticamente.
from rest_framework import viewsets

# Importamos 'AllowAny' para decirle a la app: "Cualquiera puede entrar aquí sin iniciar sesión".
from rest_framework.permissions import AllowAny

# Importamos nuestro molde Producto (la base de datos).
from .models import Producto

# Importamos nuestro traductor ProductoSerializer (para convertir a JSON).
from .serializers import ProductoSerializer

# Creamos nuestra "Vista" o "Controlador". Esta clase manejará qué hacer cuando alguien pida información.
class ProductoViewSet(viewsets.ModelViewSet):
    # 'queryset' es la lista de datos que esta vista va a usar.
    # Le decimos: "Ve a la base de datos (Producto.objects) y trae TODOS (.all()), ordenados por ID".
    queryset = Producto.objects.all().order_by('id')
    
    # 'serializer_class' es el traductor que usará esta vista.
    # Le decimos: "Usa ProductoSerializer para convertir los datos a JSON antes de enviarlos".
    serializer_class = ProductoSerializer
    
    # 'permission_classes' define quién tiene permiso para entrar.
    # [AllowAny] significa que está abierto para todos (público), ideal para probar fácilmente.
    permission_classes = [AllowAny]

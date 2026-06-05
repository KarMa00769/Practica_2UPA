"""
URL configuration for config project.

Este archivo es el punto de entrada principal para el enrutamiento de Django.
Piensa en este archivo como el recepcionista principal del edificio.
Define las rutas principales del proyecto y delega otras rutas a las aplicaciones (como productos).
"""
# Importamos el panel de administración de Django.
from django.contrib import admin
# Importamos las herramientas para crear rutas ('path') y para conectar otras carpetas ('include').
from django.urls import path, include

# Importamos las vistas prefabricadas para manejar el inicio de sesión con tokens (JWT).
# TokenObtainPairView: Para iniciar sesión y que te den tu "llave" (token).
# TokenRefreshView: Para pedir una llave nueva cuando la anterior caduque.
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Herramientas para proteger nuestras vistas y asegurarnos de que el usuario esté iniciado.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Esta es una pequeña vista (función) para ver quién soy yo (el usuario que inició sesión).
# @api_view(['GET']) significa que solo acepta peticiones tipo GET.
@api_view(['GET'])
# @permission_classes([IsAuthenticated]) es el "cadenero", solo deja pasar a los que tienen llave.
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Vista funcional que retorna la información básica del usuario autenticado.
    Requiere que la petición tenga un token JWT válido (IsAuthenticated).
    """
    # Sacamos al usuario de la petición.
    user = request.user
    
    # Respondemos con un JSON (como un diccionario) con los datos del usuario.
    return Response({
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'is_staff': user.is_staff # Si es un administrador
    })

# Lista de todas las direcciones de internet (URLs) de nuestro proyecto central.
urlpatterns = [
    # Si vas a 'tusitio.com/admin/', te mandará al panel de administración de Django.
    path('admin/', admin.site.urls),
    
    # Rutas para el Login.
    # 'api/auth/login/' es donde pones tu usuario y contraseña.
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # 'api/auth/refresh/' es donde vas por un token nuevo.
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # 'api/auth/me/' te dirá tu información si ya iniciaste sesión.
    path('api/auth/me/', get_user_profile, name='user_profile'),
    
    # Si alguien va a 'api/productos/...', delega el trabajo al archivo 'urls.py' de la carpeta 'productos'.
    path('api/productos/', include('productos.urls')),
]

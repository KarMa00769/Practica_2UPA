from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Producto
from .serializers import ProductoSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    """
    Este ViewSet genera automáticamente las siguientes rutas:
    GET /api/productos/ - Lista todos los productos
    POST /api/productos/ - Crea un nuevo producto
    GET /api/productos/{id}/ - Obtiene un producto por ID
    PUT /api/productos/{id}/ - Actualiza un producto por ID
    DELETE /api/productos/{id}/ - Elimina un producto por ID
    """
    queryset = Producto.objects.all().order_by('id')
    serializer_class = ProductoSerializer
    
    # Hemos habilitado AllowAny para que estos endpoints sean públicos
    # y puedan ser probados fácilmente en Postman o en el Frontend sin token.
    permission_classes = [AllowAny]

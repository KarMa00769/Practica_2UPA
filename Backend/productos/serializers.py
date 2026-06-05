"""
Módulo de serializadores de la aplicación 'productos'.
Se encarga de convertir datos complejos (como instancias de modelos)
en tipos de datos nativos de Python que pueden renderizarse fácilmente a JSON.
"""
# Importamos la herramienta 'serializers' de Django REST Framework.
# Esto es como un "traductor" mágico.
from rest_framework import serializers

# Importamos nuestro molde Producto que hicimos en models.py.
from .models import Producto

# Creamos una clase que será nuestro traductor oficial de Productos.
class ProductoSerializer(serializers.ModelSerializer):
    # La clase Meta (metadatos) sirve para darle las instrucciones al traductor.
    class Meta:
        # Le decimos: "Oye traductor, vas a traducir este modelo (Producto)".
        model = Producto
        # Y le decimos: "Quiero que traduzcas TODOS ('__all__') los campos de ese producto a JSON".
        fields = '__all__'

"""
Módulo de modelos de la aplicación 'productos'.
Define la estructura de la base de datos para los recursos de la API.
"""
# Importamos la herramienta 'models' que Django nos da para crear bases de datos fácilmente.
from django.db import models

# Importamos 'timezone' para poder usar la fecha y hora actual automáticamente.
from django.utils import timezone

# Creamos una "clase" llamada Producto. Piensa en esto como un molde para crear productos.
# Al poner (models.Model) le decimos a Django: "¡Oye, convierte este molde en una tabla de PostgreSQL!".
class Producto(models.Model):
    # Campo para el nombre del producto. Es texto corto, máximo 200 caracteres (letras).
    nombre = models.CharField(max_length=200)
    
    # Campo para el precio. Es un número decimal (con punto). 
    # 'max_digits=10' significa que puede tener hasta 10 números en total, 
    # y 'decimal_places=2' que 2 de esos números son para los centavos.
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Campo para la categoría del producto (ej. "Electrónica"). Texto corto, máximo 100 letras.
    categoria = models.CharField(max_length=100)
    
    # Campo para el stock (cuántos productos hay). Es un número entero (sin punto decimal).
    # 'default=0' significa que si no decimos cuánto hay, por defecto será 0.
    stock = models.IntegerField(default=0)
    
    # Campo para el proveedor (quién lo vende). Texto corto. Por defecto será 'No asignado'.
    proveedor = models.CharField(max_length=200, default='No asignado')
    
    # Campo para guardar la fecha en que se registró. 
    # 'default=timezone.now' hace que se ponga la fecha de hoy automáticamente.
    fechaRegistro = models.DateField(default=timezone.now)
    
    # Campo para el estado del producto (ej. "Activo", "Agotado"). Por defecto es 'Activo'.
    estado = models.CharField(max_length=50, default='Activo')
    
    # Esta es una función especial que le dice a Python cómo mostrar este producto cuando se imprima en pantalla.
    def __str__(self):
        # En lugar de mostrar un código raro, mostrará el nombre del producto (ej. "Laptop Dell").
        return self.nombre

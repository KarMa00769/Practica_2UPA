from django.db import models

from django.utils import timezone

class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.CharField(max_length=100)
    stock = models.IntegerField(default=0)  # Añadido para cuadrar con el frontend
    proveedor = models.CharField(max_length=200, default='No asignado')
    fechaRegistro = models.DateField(default=timezone.now)
    estado = models.CharField(max_length=50, default='Activo')
    
    def __str__(self):
        return self.nombre

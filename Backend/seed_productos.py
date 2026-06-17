# Archivo: seed_productos.py
# Imagina que esto es un "Llenador Automático de Estantes".
# Si la tienda está vacía, este programa mete productos falsos (de prueba)
# para que no tengamos que escribirlos uno por uno a mano.

import os
import django
from django.utils import timezone

# Le decimos a Python dónde buscar las reglas de nuestro proyecto
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup() # Arrancamos los motores de Django

# Traemos el "Molde" de los productos
from productos.models import Producto

# Esta es nuestra lista gigante de "productos de mentira"
productos_data = [
    {"nombre": "Laptop HP 15", "categoria": "Electrónica", "precio": 14500.00, "stock": 8, "proveedor": "HP México"},
    {"nombre": "Laptop Lenovo IdeaPad", "categoria": "Electrónica", "precio": 13200.00, "stock": 6, "proveedor": "Lenovo México"},
    {"nombre": "Mouse Logitech M170", "categoria": "Accesorios", "precio": 250.00, "stock": 35, "proveedor": "Logitech"},
    {"nombre": "Teclado Mecánico Redragon", "categoria": "Accesorios", "precio": 850.00, "stock": 20, "proveedor": "Redragon"},
    {"nombre": "Monitor Samsung 24 pulgadas", "categoria": "Electrónica", "precio": 3200.00, "stock": 10, "proveedor": "Samsung"},
    {"nombre": "Memoria USB Kingston 64GB", "categoria": "Almacenamiento", "precio": 180.00, "stock": 50, "proveedor": "Kingston"},
    {"nombre": "Disco Duro Externo 1TB", "categoria": "Almacenamiento", "precio": 1250.00, "stock": 15, "proveedor": "Seagate"},
    {"nombre": "SSD Kingston 480GB", "categoria": "Almacenamiento", "precio": 750.00, "stock": 18, "proveedor": "Kingston"},
    {"nombre": "Impresora Epson L3250", "categoria": "Impresión", "precio": 4200.00, "stock": 7, "proveedor": "Epson"},
    {"nombre": "Tinta Epson Negra", "categoria": "Impresión", "precio": 220.00, "stock": 30, "proveedor": "Epson"},
    {"nombre": "Silla Gamer", "categoria": "Oficina", "precio": 3500.00, "stock": 5, "proveedor": "GameFactor"},
    {"nombre": "Escritorio Ejecutivo", "categoria": "Oficina", "precio": 2800.00, "stock": 4, "proveedor": "Muebles MX"},
    {"nombre": "Audífonos JBL", "categoria": "Audio", "precio": 950.00, "stock": 16, "proveedor": "JBL"},
    {"nombre": "Bocina Bluetooth Sony", "categoria": "Audio", "precio": 1350.00, "stock": 12, "proveedor": "Sony"},
    {"nombre": "Cámara Web Logitech C920", "categoria": "Accesorios", "precio": 1600.00, "stock": 9, "proveedor": "Logitech"},
    {"nombre": "Router TP-Link", "categoria": "Redes", "precio": 850.00, "stock": 14, "proveedor": "TP-Link"},
    {"nombre": "Switch de Red 8 Puertos", "categoria": "Redes", "precio": 650.00, "stock": 11, "proveedor": "TP-Link"},
    {"nombre": "Cable HDMI 2m", "categoria": "Accesorios", "precio": 120.00, "stock": 60, "proveedor": "Genérico"},
    {"nombre": "Cable Ethernet 5m", "categoria": "Redes", "precio": 95.00, "stock": 45, "proveedor": "Genérico"},
    {"nombre": "No Break Koblenz", "categoria": "Energía", "precio": 1850.00, "stock": 8, "proveedor": "Koblenz"},
    {"nombre": "Regulador de Voltaje", "categoria": "Energía", "precio": 450.00, "stock": 20, "proveedor": "Koblenz"},
    {"nombre": "Tablet Samsung Galaxy Tab", "categoria": "Electrónica", "precio": 6200.00, "stock": 6, "proveedor": "Samsung"},
    {"nombre": "Celular Motorola G54", "categoria": "Telefonía", "precio": 4800.00, "stock": 9, "proveedor": "Motorola"},
    {"nombre": "Funda para Laptop", "categoria": "Accesorios", "precio": 350.00, "stock": 25, "proveedor": "TechStore"},
    {"nombre": "Base Enfriadora Laptop", "categoria": "Accesorios", "precio": 420.00, "stock": 13, "proveedor": "Acteck"},
    {"nombre": "Micrófono USB", "categoria": "Audio", "precio": 1100.00, "stock": 10, "proveedor": "Fifine"},
    {"nombre": "Proyector Epson", "categoria": "Electrónica", "precio": 9200.00, "stock": 3, "proveedor": "Epson"},
    {"nombre": "Lector de Código de Barras", "categoria": "Comercial", "precio": 1350.00, "stock": 7, "proveedor": "Vorago"},
    {"nombre": "Terminal Punto de Venta", "categoria": "Comercial", "precio": 5800.00, "stock": 4, "proveedor": "Clip"},
    {"nombre": "Paquete Office 365", "categoria": "Software", "precio": 1800.00, "stock": 20, "proveedor": "Microsoft"},
    {"nombre": "Antivirus Kaspersky 1 año", "categoria": "Software", "precio": 650.00, "stock": 18, "proveedor": "Kaspersky"},
    {"nombre": "Licencia Windows 11 Pro", "categoria": "Software", "precio": 2500.00, "stock": 12, "proveedor": "Microsoft"},
    {"nombre": "Memoria RAM DDR4 8GB", "categoria": "Componentes", "precio": 620.00, "stock": 22, "proveedor": "Kingston"},
    {"nombre": "Memoria RAM DDR4 16GB", "categoria": "Componentes", "precio": 1150.00, "stock": 15, "proveedor": "Kingston"},
    {"nombre": "Tarjeta Madre ASUS Prime", "categoria": "Componentes", "precio": 2450.00, "stock": 6, "proveedor": "ASUS"},
    {"nombre": "Procesador AMD Ryzen 5", "categoria": "Componentes", "precio": 3200.00, "stock": 5, "proveedor": "AMD"},
    {"nombre": "Fuente de Poder 600W", "categoria": "Componentes", "precio": 980.00, "stock": 9, "proveedor": "EVGA"},
    {"nombre": "Gabinete Gamer RGB", "categoria": "Componentes", "precio": 1450.00, "stock": 7, "proveedor": "Yeyian"},
    {"nombre": "Mousepad XL", "categoria": "Accesorios", "precio": 220.00, "stock": 28, "proveedor": "TechStore"},
    {"nombre": "Adaptador USB-C a HDMI", "categoria": "Accesorios", "precio": 380.00, "stock": 17, "proveedor": "UGREEN"},
    {"nombre": "Cargador Universal Laptop", "categoria": "Energía", "precio": 750.00, "stock": 11, "proveedor": "Vorago"},
    {"nombre": "Power Bank 10000mAh", "categoria": "Energía", "precio": 650.00, "stock": 14, "proveedor": "Xiaomi"},
    {"nombre": "Cámara de Seguridad WiFi", "categoria": "Seguridad", "precio": 1250.00, "stock": 10, "proveedor": "TP-Link"},
    {"nombre": "Kit Cámaras CCTV 4 Canales", "categoria": "Seguridad", "precio": 5200.00, "stock": 3, "proveedor": "Hikvision"},
    {"nombre": "Control de Acceso Biométrico", "categoria": "Seguridad", "precio": 3100.00, "stock": 4, "proveedor": "ZKTeco"},
    {"nombre": "Etiquetadora Brother", "categoria": "Oficina", "precio": 1650.00, "stock": 6, "proveedor": "Brother"},
    {"nombre": "Calculadora Científica Casio", "categoria": "Oficina", "precio": 480.00, "stock": 20, "proveedor": "Casio"},
    {"nombre": "Tóner HP 85A", "categoria": "Impresión", "precio": 1350.00, "stock": 8, "proveedor": "HP México"},
    {"nombre": "Cartucho Canon Color", "categoria": "Impresión", "precio": 690.00, "stock": 13, "proveedor": "Canon"},
    {"nombre": "Mini PC Intel NUC", "categoria": "Electrónica", "precio": 8900.00, "stock": 4, "proveedor": "Intel"}
]

# Función principal
def poblar_db():
    # Si la base de datos ya tiene cosas, simplemente saltamos la carga para no borrar los cambios que haya hecho el usuario.
    if Producto.objects.count() > 0:
        print("La base de datos ya tiene productos. Omitiendo la inserción inicial.")
        return
        
    print(f"Insertando {len(productos_data)} productos...")
    
    productos_creados = []
    fecha = timezone.now() # Vemos la hora actual
    
    # Recorremos la lista gigante
    for item in productos_data:
        # Usamos el molde para hacer un producto nuevo
        prod = Producto(
            nombre=item['nombre'],
            categoria=item['categoria'],
            precio=item['precio'],
            stock=item['stock'],
            proveedor=item['proveedor'],
            estado='Activo',
            fechaRegistro=fecha
        )
        productos_creados.append(prod) # Lo metemos a una caja temporal
        
    # Guardamos toda la caja de golpe en la base de datos (es más rápido así)
    Producto.objects.bulk_create(productos_creados)
    print("¡Base de datos de productos poblada exitosamente!")

def poblar_usuarios():
    from django.contrib.auth.models import User
    email = "admin@techstore.com"
    password = "techstore123"
    
    if not User.objects.filter(username=email).exists():
        User.objects.create_superuser(username=email, email=email, password=password)
        print(f"¡Superusuario '{email}' creado exitosamente!")
    else:
        print(f"El superusuario '{email}' ya existe. Omitiendo creación.")

# Si ejecutamos este archivo directamente, arrancamos las funciones
if __name__ == '__main__':
    poblar_db()
    poblar_usuarios()

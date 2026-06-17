#!/bin/sh
# Archivo: Backend/entrypoint.sh
# Este script es el "guardia" que arranca antes que todo.
# Su trabajo: esperar a que Postgres esté completamente listo
# ANTES de intentar correr las migraciones y el servidor.

set -e  # Si algo falla, para todo de inmediato.

echo "⏳ Esperando a que la base de datos esté lista..."

# Intentamos conectarnos a Postgres en un bucle hasta que responda.
until python -c "
import psycopg2, os, sys
try:
    conn = psycopg2.connect(
        dbname=os.environ.get('POSTGRES_DB', 'techstore'),
        user=os.environ.get('POSTGRES_USER', 'techstore_user'),
        password=os.environ.get('POSTGRES_PASSWORD', 'techstore_password'),
        host=os.environ.get('POSTGRES_HOST', 'db'),
        port=os.environ.get('POSTGRES_PORT', '5432'),
    )
    conn.close()
    print('✅ ¡Base de datos lista!')
except Exception as e:
    print(f'🔴 Postgres no está listo aún: {e}')
    sys.exit(1)
"; do
    echo "   Reintentando en 2 segundos..."
    sleep 2
done

echo "🔄 Aplicando migraciones..."
python manage.py migrate --noinput

echo "🌱 Ejecutando seed (usuarios y productos iniciales)..."
python seed_productos.py

echo "🚀 ¡Arrancando el servidor Django!"
exec python manage.py runserver 0.0.0.0:8000

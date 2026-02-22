#!/bin/sh
# Espera a que la base de datos esté lista antes de ejecutar la migración

DB_HOST="medication-management-db"
DB_PORT="5432"
MAX_TRIES=30
TRIES=0

until nc -z "$DB_HOST" "$DB_PORT"; do
  TRIES=$((TRIES+1))
  if [ $TRIES -ge $MAX_TRIES ]; then
    echo "La base de datos no está lista después de $MAX_TRIES intentos. Abortando."
    exit 1
  fi
  echo "Esperando a que la base de datos esté lista... ($TRIES/$MAX_TRIES)"
  sleep 2
done

echo "La base de datos está lista. Ejecutando migración..."

bash migrate-db.sh "$1"

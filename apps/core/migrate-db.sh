#!/bin/bash
ENV_FILE="../../.env"

TARGET_DB=${1:-test}

eval $(./node_modules/.bin/dotenv -e $ENV_FILE -- printenv | grep '^DB_')

if [ ! -f "/.dockerenv" ]; then
  DB_HOST="localhost"
fi

if [ "$TARGET_DB" = "prod" ]; then
  DB_NAME_TO_USE="$DB_NAME"
  if [ -z "$DB_NAME_TO_USE" ]; then
    echo "Falta la variable DB_NAME (producción) en $ENV_FILE"
    exit 1
  fi
  echo "Migrando base de datos de PRODUCCIÓN: $DB_NAME_TO_USE"
else
  DB_NAME_TO_USE="$DB_NAME_TEST"
  if [ -z "$DB_NAME_TO_USE" ]; then
    echo "Falta la variable DB_NAME_TEST (test) en $ENV_FILE"
    exit 1
  fi
  echo "Migrando base de datos de TEST: $DB_NAME_TO_USE"
fi

if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ]; then
  echo "Faltan variables de entorno DB_USER, DB_PASSWORD, DB_HOST o DB_PORT en $ENV_FILE"
  exit 1
fi

export DATABASE_URL="postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME_TO_USE"

./node_modules/.bin/dotenv -e $ENV_FILE -- ./node_modules/.bin/node-pg-migrate up -m migrations

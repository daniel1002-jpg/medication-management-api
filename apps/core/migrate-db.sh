#!/bin/bash
ENV_FILE="../../.env"
DB_URL_VAR=$1

if [ -z "$DB_URL_VAR" ]; then
  echo "Uso: ./migrate-db.sh DATABASE_URL_VAR"
  exit 1
fi

DB_URL=$(./node_modules/.bin/dotenv -e $ENV_FILE -- printenv $DB_URL_VAR)
if [ -z "$DB_URL" ]; then
  echo "La variable $DB_URL_VAR no está definida en $ENV_FILE"
  exit 1
fi

export DATABASE_URL="$DB_URL"

./node_modules/.bin/dotenv -e $ENV_FILE -- ./node_modules/.bin/node-pg-migrate up -m migrations

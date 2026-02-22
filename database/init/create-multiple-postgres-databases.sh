#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    SELECT 'CREATE DATABASE clinical_cases_db'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'clinical_cases_db')
    \gexec
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    SELECT 'CREATE DATABASE clinical_cases_test_db'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'clinical_cases_test_db')
    \gexec
EOSQL
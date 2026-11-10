#!/bin/sh
set -e
echo "Waiting for the database at ${DB_HOST:-db}:${DB_PORT:-5432}..."
until nc -z "${DB_HOST:-db}" "${DB_PORT:-5432}"; do
  sleep 1
done
echo "Database ready. Running seed..."
node dist/seed.js || echo "(seed failed or already completed; continuing)"
echo "Starting application..."
node dist/main.js

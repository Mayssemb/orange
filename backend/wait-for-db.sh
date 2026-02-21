#!/bin/sh
# wait for Postgres to be ready
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
  echo "Waiting for Postgres..."
  sleep 2
done

# start the app
npm run start:dev

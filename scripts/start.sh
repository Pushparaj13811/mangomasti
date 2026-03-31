#!/bin/sh
set -e

echo "Running database migrations..."
bun scripts/migrate.ts

echo "Starting application..."
exec bun server.js

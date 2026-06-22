#!/bin/sh
set -e

# Optimize configuration and route loading in production environment
if [ "${APP_ENV}" = "production" ]; then
    echo "Caching configurations, routes, and views for production..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Run migrations automatically in production
echo "Running database migrations..."
php artisan migrate --force

# Execute the main container CMD (starts the web server)
exec "$@"

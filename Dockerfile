# Stage 1: Build React/Vite assets
FROM node:20-alpine AS asset-builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Production PHP Apache Runner (Fully compatible with Render sandbox)
FROM php:8.3-apache AS runner

# Install system dependencies and PHP extensions required by Laravel, Spatie MediaLibrary, and PhpSpreadsheet
RUN apt-get update && apt-get install -y \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libicu-dev \
    libxml2-dev \
    libpq-dev \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd \
        zip \
        intl \
        bcmath \
        xml \
        opcache \
        pdo_mysql \
        pdo_pgsql

# Enable Apache rewrite module (crucial for Laravel routing)
RUN a2enmod rewrite

# Configure Apache Document Root to point to Laravel's public directory
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Set up PHP configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Configure PHP settings (max upload limits matching application specs)
RUN echo "upload_max_filesize=15M\npost_max_size=20M\nmemory_limit=256M" > $PHP_INI_DIR/conf.d/laravel.ini

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy PHP dependencies first for layer caching
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --ignore-platform-reqs

# Copy application source code
COPY . .

# Copy compiled React assets from the builder stage
COPY --from=asset-builder /app/public/build ./public/build

# Finish autoloader optimization
RUN composer dump-autoload --no-dev --optimize --no-scripts --ignore-platform-reqs

# Ensure correct permissions for Laravel directories (Apache runs as www-data)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Reset Entrypoint, run caching and migrations on boot, normalize permissions, and start Apache
ENTRYPOINT []
CMD php artisan config:clear && php artisan route:cache && php artisan view:cache && php artisan migrate --seed --force && chown -R www-data:www-data /var/www/html/database /var/www/html/storage && apache2-foreground

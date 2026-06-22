# Stage 1: Build React/Vite assets
FROM node:20-alpine AS asset-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production FrankenPHP Runner
FROM dunglas/frankenphp:1.2-php8.3-alpine AS runner

# Install system dependencies and PHP extensions required by Laravel, Spatie MediaLibrary, and PhpSpreadsheet
RUN apk add --no-cache \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    icu-dev \
    libxml2-dev \
    oniguruma-dev \
    postgresql-dev \
    bash \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd \
        zip \
        intl \
        bcmath \
        xml \
        mbstring \
        pdo_mysql \
        pdo_pgsql \
        opcache

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Set production PHP settings
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Configure PHP settings (max upload limits matching application specs)
RUN echo "upload_max_filesize=15M" > $PHP_INI_DIR/conf.d/uploads.ini \
    && echo "post_max_size=20M" >> $PHP_INI_DIR/conf.d/uploads.ini \
    && echo "memory_limit=256M" >> $PHP_INI_DIR/conf.d/uploads.ini

# Copy PHP dependencies first for layer caching
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy the application source code
COPY . .

# Copy compiled React assets from the builder stage
COPY --from=asset-builder /app/public/build ./public/build

# Finish autoloader optimization
RUN composer dump-autoload --no-dev --optimize

# Ensure correct permissions for Laravel storage and cache directories
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Copy entrypoint script and make it executable
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose standard production port
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["frankenphp", "php-server", "--port", "8080", "--public-dir", "public"]

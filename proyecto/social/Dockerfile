# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Argumentos de build para variables de entorno
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_GEMINI_API_KEY

# Exponer como variables de entorno para Vite
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Instalar dependencias del root (para que los componentes compartidos encuentren react)
COPY package*.json ./
RUN npm install

# Copiar todo el código (incluyendo components)
COPY . .

# Moverse al directorio social e instalar sus dependencias
WORKDIR /app/social
RUN npm install

# Build de la aplicación con Vite
RUN npm run build

# Production stage - usar nginx para servir archivos estáticos
FROM nginx:alpine-slim

# Copiar build de Vite al directorio de nginx
COPY --from=builder /app/social/dist /usr/share/nginx/html

# Copiar configuración de nginx para SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Nginx se inicia automáticamente
CMD ["nginx", "-g", "daemon off;"]
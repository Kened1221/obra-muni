#!/bin/bash

# Paso 1: Obtener la IP local
IP_LOCAL=$(hostname -I | awk '{print $1}')
echo "IP local detectada: $IP_LOCAL"

# Paso 2: Pedir el puerto para exponer la aplicación
read -p "Introduce el puerto para exponer la aplicación (por ejemplo, 443): " PUERTO
if ! [[ $PUERTO =~ ^[0-9]+$ ]]; then
    echo "Error: El puerto debe ser un número válido."
    exit 1
fi
echo "El puerto de exposición será: $PUERTO"

# Paso 3: Verificar si el archivo .env existe
if [[ ! -f ".env" ]]; then
    echo "Error: El archivo .env no está presente en el directorio actual."
    exit 1
fi

# Paso 4: Escribir la configuración de Nginx (solo HTTP)
cat <<EOF > nginx.conf
events {
    worker_connections 1024;  # Número máximo de conexiones por worker
}

http {
    client_max_body_size 30M;  # Permitir archivos grandes
    server {
        listen $PUERTO;
        server_name $IP_LOCAL;

        location / {
            proxy_pass http://localhost:3000;
            proxy_set_header Host \$http_host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
            proxy_set_header X-Forwarded-Port \$server_port;
        }
    }
}
EOF

echo "Archivo nginx.conf generado para el servidor con la IP: $IP_LOCAL y el puerto: $PUERTO"

# Paso 5: Crear el Dockerfile
cat <<EOF > Dockerfile
# Dockerfile

# 1. Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar los archivos necesarios
COPY prisma ./prisma
COPY package*.json ./ 
COPY .env .env
RUN npm install -g prisma && npm install --legacy-peer-deps
COPY . .

RUN npm run build

# 2. Etapa de producción
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache nginx nano
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./ 

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE $PUERTO

CMD ["sh", "-c", "nginx && npm start"]
EOF

echo "Dockerfile generado con el puerto $PUERTO"

# Paso 6: Crear la imagen Docker
docker build -t obras-app-$PUERTO .

# Paso 7: Verificar si el contenedor ya existe
EXISTING_CONTAINER=$(docker ps -aq -f name=obras-app-$PUERTO)
if [ -n "$EXISTING_CONTAINER" ]; then
    echo "El contenedor existente será detenido y eliminado."
    docker stop $EXISTING_CONTAINER
    docker rm $EXISTING_CONTAINER
fi

# Paso 8: Levantar el contenedor Docker usando el archivo .env ya existente
docker run -d -p $PUERTO:$PUERTO --name obras-app-$PUERTO --env-file .env obras-app-$PUERTO

if [[ $? -eq 0 ]]; then
    echo "Contenedor Docker levantado correctamente en el puerto $PUERTO"
else
    echo "Error al levantar el contenedor Docker."
    exit 1
fi

# Paso 9: Reiniciar el contenedor para aplicar la configuración de Nginx
docker restart obras-app-$PUERTO

echo "El contenedor ha sido reiniciado con la configuración de HTTP y el puerto $PUERTO"

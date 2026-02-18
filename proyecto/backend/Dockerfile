FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

ENV PORT=4000

EXPOSE 4000

# Con el volumen montado (./backend:/usr/src/app), node_modules puede quedar vacío.
# Ejecutar npm install al arrancar asegura que las dependencias estén instaladas.
CMD ["sh", "-c", "npm install && node src/index.js"]




FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

ENV PORT=4000

EXPOSE 4000

CMD ["node", "src/index.js"]




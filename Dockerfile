FROM node:latest

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

COPY .env .

RUN npx prisma generate

RUN npm run build

EXPOSE 8080

 CMD ["node", "dist/src/main"]
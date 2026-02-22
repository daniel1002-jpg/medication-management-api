FROM node:25-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --include=dev
RUN apk add --no-cache bash

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
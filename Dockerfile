# Construction step
FROM node:alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3232

CMD ["npm", "run", "start"]

#command to build the image
# docker build -t my-store-api-fastify .

#command to run the container
#docker run -d --name my-store-api-fastify --env-file .env -p 3232:3232 -d my-store-api-fastify

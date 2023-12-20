# Construction step
FROM node:alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3232

CMD ["npm", "run", "start"]

#command to build the image
# docker build -t my-store .

#command to run the container
#docker run -d --name my-store --env-file .env -p 3000:3000 -d my-store

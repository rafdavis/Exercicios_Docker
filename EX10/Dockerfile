FROM node:lts-alpine3.21
RUN addgroup dev && adduser -S -G dev docker
USER docker
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]
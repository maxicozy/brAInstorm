FROM node:lts-alpine

RUN npm install npm@latest

# install simple http server for serving static content
RUN npm i -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm i

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build

# Network / reverse proxy config
LABEL traefik.http.routers.brainstorm.rule="Host(`brainstorm.ds.ava.hfg.design`)"

EXPOSE 8080
CMD [ "http-server", "build" ]
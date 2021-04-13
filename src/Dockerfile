FROM node:lts-alpine as build

# install simple http server for serving static content
RUN npm install -g serve

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# add env variable
ARG VUE_APP_SERVER
ENV VUE_APP_SERVER $VUE_APP_SERVER

# build app for production with minification
RUN npm run build

#production stage

FROM node:lts-alpine as production
WORKDIR /app
COPY package*.json ./

# install simple http server for serving static content
RUN npm install -g serve

# install project dependencies minified for production
RUN npm install --production

COPY --from=build /app/dist ./dist

EXPOSE 5000
CMD [ "serve", "-s", "dist" ]

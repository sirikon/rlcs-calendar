FROM node:12.13-alpine
WORKDIR /app
ADD package.json .
ADD package-lock.json .
RUN npm i --production
ADD src src/
RUN mkdir -p ./data
CMD node src/main.js

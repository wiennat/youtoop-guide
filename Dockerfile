FROM node:10.7-alpine AS client

WORKDIR /app/client

COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:10.7-alpine

WORKDIR /app/youtoop-guide
COPY package.json .
COPY package-lock.json .
COPY --from=client /app/client/dist .
RUN npm install --only=production
EXPOSE 3000
CMD [ "node", "server.js" ]

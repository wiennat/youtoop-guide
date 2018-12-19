FROM node:10
COPY package.json /app/backend/
WORKDIR /app/backend
RUN npm install

COPY bin/* bin/
COPY src src/
COPY .babelrc .
RUN npm run build
CMD ["npm", "run", "serve"]

FROM node:10
WORKDIR /app/frontend

COPY package*.json /app/frontend/
RUN npm install

COPY . /app/frontend
RUN npm run build

FROM nginx:mainline
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/frontend/dist/* /usr/share/nginx/html/
RUN rm /usr/share/nginx/html/index.html
EXPOSE 80


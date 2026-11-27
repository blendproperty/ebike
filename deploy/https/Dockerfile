FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY next.config.js ./
COPY app ./app
COPY public ./public
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM nginx:stable-alpine
COPY deploy/https/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/out /usr/share/nginx/html

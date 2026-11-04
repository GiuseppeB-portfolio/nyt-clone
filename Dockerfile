# syntax=docker/dockerfile:1
# Front end: build con Node, poi file statici serviti da nginx (immagine finale ~50 MB, senza Node).

# --- Stage 1: build ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Variabili pubbliche di build (finiscono nel bundle: qui non vanno mai segreti)
ARG VITE_APP_ENV=development
ARG VITE_SENTRY_DSN=
ARG VITE_APP_RELEASE=
ENV VITE_APP_ENV=$VITE_APP_ENV \
    VITE_SENTRY_DSN=$VITE_SENTRY_DSN \
    VITE_APP_RELEASE=$VITE_APP_RELEASE

RUN npm run build

# --- Stage 2: runtime ---
FROM nginx:1.29-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

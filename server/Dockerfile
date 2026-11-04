# syntax=docker/dockerfile:1
# Back end: proxy Express verso le API del New York Times.
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY index.js nytProxy.js ./

# Non serve essere root per ascoltare sulla 3001
USER node
EXPOSE 3001
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/api/health >/dev/null || exit 1

CMD ["node", "index.js"]

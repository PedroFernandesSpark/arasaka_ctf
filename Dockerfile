# ---------- build do frontend ----------
FROM node:20-alpine AS fe
WORKDIR /fe
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---------- build do backend ----------
FROM node:20-alpine AS be
WORKDIR /be
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# ---------- runtime ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache netcat-openbsd
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY --from=be /be/dist ./dist
COPY backend/src/evidence ./dist/evidence
COPY --from=fe /fe/dist ./client
COPY backend/entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh
EXPOSE 3000
CMD ["./entrypoint.sh"]

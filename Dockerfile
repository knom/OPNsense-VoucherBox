# -------------------------------
# 1. Build stage
# -------------------------------
FROM node:26-alpine AS builder

ENV BASEPATH=/wifi/

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Copy all source
COPY . . 

RUN npm install --frozen-lockfile

WORKDIR /app/frontend/
RUN npm install --frozen-lockfile 

WORKDIR /app/backend/
RUN npm install --frozen-lockfile 

WORKDIR /app/
RUN npm run build
RUN find . -name "*.js.map" -delete

# -------------------------------
# 2. Production stage
# -------------------------------
FROM node:26-alpine AS runner

WORKDIR /app

# Copy only needed files
COPY backend/package*.json ./dist/backend/

WORKDIR /app/dist/frontend/

WORKDIR /app/dist/backend/
RUN npm install --omit=dev --frozen-lockfile

WORKDIR /app/
# Copy backend dist + frontend build
COPY --from=builder /app/backend/dist ./dist/backend
COPY --from=builder /app/frontend/dist ./dist/frontend

ADD backend/emailtemplate.mjml .

# Expose port (adjust if needed)
EXPOSE 3000

ENV BASEPATH=/wifi/

HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=20s \
  CMD wget --spider -q http://localhost:3000/wifi/ || exit 1

CMD ["node", "dist/backend/server.js"]

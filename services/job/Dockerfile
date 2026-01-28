# ---------- Builder Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Install ALL dependencies (including dev) so we can run build & prisma generate
RUN npm install

COPY tsconfig.json ./ 
COPY prisma ./prisma
COPY src ./src

# Generate the client during the BUILD phase to save startup time
RUN npx prisma generate

RUN npm run build

# ---------- Final Stage ----------
FROM node:22-alpine

WORKDIR /app

# CRITICAL FIX FOR NEON DB: Install OpenSSL
RUN apk add --no-cache openssl

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled JS
COPY --from=builder /app/dist ./dist

# Copy Prisma schema
COPY --from=builder /app/prisma ./prisma

# COPY THE GENERATED CLIENT
# This prevents us from needing to run 'prisma generate' every startup
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4004

# STARTUP COMMAND
# We keep 'migrate deploy' here, but ensure your DATABASE_URL is set in docker-compose
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
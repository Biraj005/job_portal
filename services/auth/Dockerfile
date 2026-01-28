# ---------- Builder Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./ 
COPY prisma ./prisma
COPY src ./src

RUN npm run build

FROM node:22-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled JS
COPY --from=builder /app/dist ./dist

# Copy Prisma schema & migrations
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

# Generate Prisma client and run migrations at container start
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/index.js"]

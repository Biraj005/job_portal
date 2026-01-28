# ---------- Builder Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./ 
COPY src ./src

RUN npm run build

FROM node:22-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled JS
COPY --from=builder /app/dist ./dist



EXPOSE 4003

# Generate Prisma client and run migrations at container start
CMD ["sh", "-c", "node dist/index.js"]

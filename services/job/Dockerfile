FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY tsconfig.json ./

# ---- ADD THESE TWO LINES ----
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
# --------------------------------

RUN npx prisma generate

COPY src ./src
RUN npm run build

EXPOSE 4004

CMD ["node", "dist/index.js"]

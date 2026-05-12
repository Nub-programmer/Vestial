FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS dependencies
COPY package*.json ./
RUN npm install

# Build stage
FROM base AS builder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM base AS runtime
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY package*.json ./
RUN npm install --production

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]

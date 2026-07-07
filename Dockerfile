# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set build argument for Vite API URL (injected at build time)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:8001/api/v1}

# Build the project (generates .output directory)
RUN npm run build

# Stage 2: Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built server output and package config
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

# Environment variables
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Start the Nitro web server
CMD ["node", ".output/server/index.mjs"]

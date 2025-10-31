# Multi-stage build for production

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root files
COPY package*.json package-lock.json ./

# Copy backend package files
COPY packages/backend/package*.json ./packages/backend/

# Install dependencies
RUN npm ci

# Copy backend source code
COPY packages/backend ./packages/backend

# Build the application
RUN npm run build --workspace=backend

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy workspace root files
COPY package*.json package-lock.json ./

# Copy backend package files
COPY packages/backend/package*.json ./packages/backend/

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/migrations ./migrations

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]

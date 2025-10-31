# Multi-stage build for production

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root files
COPY package*.json ./

# Copy frontend package files
COPY packages/frontend/package*.json ./packages/frontend/

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY packages/frontend ./packages/frontend

# Build the application
RUN npm run build --workspace=frontend

# Stage 2: Production with nginx
FROM nginx:alpine AS production

# Copy built application from builder stage
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

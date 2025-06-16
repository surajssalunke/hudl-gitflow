# --- Stage 1: Node build ---
FROM node:22-bullseye AS node-build

WORKDIR /app

# Copy and build client
COPY client ./client
WORKDIR /app/client
RUN npm install && npm run build

# Copy and build server
WORKDIR /app
COPY server ./server
WORKDIR /app/server
RUN npm install && npm run build

# --- Stage 2: Python run ---
FROM python:3.13.5-bullseye

# Install Node.js if you need to run any JS at runtime (optional)
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# Install supervisor
RUN apt-get update && apt-get install -y supervisor

WORKDIR /app

# Copy built client and server from node-build stage
COPY --from=node-build /app/client/dist ./client
COPY --from=node-build /app/server/build ./server
COPY --from=node-build /app/server/node_modules ./server/node_modules

# Copy environment variables
COPY .env ./.env

# Copy Python source
COPY ghagent ./ghagent

# Install Python dependencies
WORKDIR /app/ghagent
RUN pip3 install -r requirements.txt

# Copy supervisor config
WORKDIR /app
COPY supervisord.conf .

# Expose ports
EXPOSE 8080

# Start both servers using supervisor
CMD ["/usr/bin/supervisord", "-c", "/app/supervisord.conf"]
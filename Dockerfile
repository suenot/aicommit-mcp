FROM node:18-alpine

WORKDIR /app

# Install basic dependencies
RUN apk add --no-cache git bash

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Install aicommit globally using npm
RUN npm install -g @suenot/aicommit

# Expose MCP server
ENTRYPOINT ["node", "index.js"] 
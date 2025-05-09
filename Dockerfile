FROM node:18-alpine

WORKDIR /app

# Install basic dependencies
RUN apk add --no-cache git bash

# Copy package files
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Install aicommit globally using npm
RUN npm install -g aicommit

# Expose MCP server
ENTRYPOINT ["node", "index.js"] 
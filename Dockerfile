FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
# Use a lightweight static server (serve) so the container can run on Render
RUN npm install -g serve@14.1.2
COPY --from=build /app/dist ./dist
ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "npx serve -s dist -l tcp:$PORT"]

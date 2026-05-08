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
# Bind explicitly to 0.0.0.0 so Render's provided host/IP isn't used as the listen address
CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:$PORT"]

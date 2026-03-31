# Stage 1: Install dependencies
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Build Next.js app
FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
ENV NODE_ENV=production
ENV DOCKER_BUILD=true
RUN bun run build

# Stage 3: Migration runner (separate lightweight image)
FROM oven/bun:1-slim AS migrator
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY drizzle ./drizzle
COPY scripts/migrate.ts ./scripts/migrate.ts
COPY scripts/seed.ts ./scripts/seed.ts
COPY src/app/db ./src/app/db
CMD ["bun", "scripts/migrate.ts"]

# Stage 4: Production app runner
FROM oven/bun:1-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["bun", "server.js"]

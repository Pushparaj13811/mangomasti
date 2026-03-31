# Stage 1: Install dependencies
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Build
FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Dummy DATABASE_URL so Next.js build doesn't fail (no DB calls at build time)
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
ENV NODE_ENV=production
RUN bun run build

# Stage 3: Production runner
FROM oven/bun:1-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Next.js standalone output (includes its own node_modules with prod deps)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Migration SQL files
COPY --from=builder /app/drizzle ./drizzle

# Scripts and DB schema (needed for migrate + seed)
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src/app/db ./src/app/db

RUN chmod +x scripts/start.sh

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["sh", "scripts/start.sh"]

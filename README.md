# MangoMasti 🥭

A Next.js application for showcasing premium mango varieties and customer reviews.

## Tech Stack

- **Framework**: Next.js 16.2 with React 19
- **Runtime**: Bun
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel + Supabase (or Docker)

## Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Set up environment**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your DATABASE_URL
   ```

3. **Run database migrations**:
   ```bash
   bun run db:migrate
   ```

4. **(Optional) Seed sample data**:
   ```bash
   bun run db:seed
   ```

5. **Start development server**:
   ```bash
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Deployment Options

### Option 1: Vercel + Supabase (Recommended)

Perfect for production deployment with zero infrastructure management.

👉 **[Complete Vercel + Supabase Deployment Guide](./DEPLOYMENT.md)**

**Quick Summary**:
1. Create Supabase project at [supabase.com](https://supabase.com)
2. Get connection string (use **Transaction pooling** mode)
3. Run migrations locally: `bun run db:migrate`
4. Push to GitHub
5. Deploy on Vercel with `DATABASE_URL` environment variable

### Option 2: Docker (Self-Hosted)

For running on your own server with PostgreSQL included.

```bash
# Set environment variables
cp .env.example .env
# Edit .env and set POSTGRES_PASSWORD

# Build and run
docker-compose up -d
```

Access at http://localhost:3000

## Database Management

```bash
# Generate new migration after schema changes
bun run db:generate

# Apply migrations
bun run db:migrate

# Seed database with sample reviews
bun run db:seed

# Open Drizzle Studio (database GUI)
bun run db:studio
```

## Project Structure

```
mangomasti/
├── src/app/          # Next.js app directory
│   ├── db/           # Database schema and client
│   └── ...           # Pages and components
├── scripts/          # Database scripts (migrate, seed)
├── drizzle/          # Database migrations
├── public/           # Static assets
└── docker-compose.yml
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

See [.env.local.example](./.env.local.example) for detailed examples.

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun run build` | Build for production |
| `bun start` | Start production server |
| `bun run db:migrate` | Run database migrations |
| `bun run db:seed` | Seed sample data |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:generate` | Generate new migration |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [Bun](https://bun.sh)
- [Supabase](https://supabase.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

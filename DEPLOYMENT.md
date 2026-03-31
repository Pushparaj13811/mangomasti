# Deploying MangoMasti to Vercel with Supabase

This guide walks you through deploying MangoMasti to Vercel with Supabase as the database.

## Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com - it's free)
- Supabase account (sign up at supabase.com - it's free)

## Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the details:
   - **Project name**: `mangomasti` (or any name you prefer)
   - **Database password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users (e.g., `ap-south-1` for India)
   - **Pricing Plan**: Free
4. Click **"Create new project"**
5. Wait 2-3 minutes for your database to be provisioned

### 1.2 Get Database Connection String

1. In your Supabase project, go to **Settings** (bottom left) → **Database**
2. Scroll down to **Connection string** section
3. Click on the **"Connection pooling"** tab (IMPORTANT: Use pooling for Vercel!)
4. Copy the **URI** connection string - it looks like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the password you created in step 1.1
6. **Save this connection string** - you'll need it for both local testing and Vercel

## Step 2: Run Migrations Locally Against Supabase

Before deploying to Vercel, let's set up your Supabase database with the schema.

### 2.1 Update Local Environment

1. Create a `.env.local` file in your project root:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and paste your Supabase connection string:
   ```
   DATABASE_URL=postgresql://postgres.xxxxx:your-password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```

### 2.2 Run Migrations

```bash
# Install dependencies if you haven't already
bun install

# Run database migrations
bun run db:migrate

# (Optional) Seed the database with sample reviews
bun run db:seed
```

You should see:
```
Running database migrations...
✓ Migrations complete
```

### 2.3 Verify in Supabase

1. Go to your Supabase project → **Table Editor** (left sidebar)
2. You should see the `reviews` table
3. If you ran the seed script, you'll see 8 sample reviews

## Step 3: Push to GitHub

Vercel deploys from GitHub, so push your code:

```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "feat: add Supabase and Vercel deployment support"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/your-username/mangomasti.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

### 4.1 Import Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository (you may need to authorize Vercel to access your GitHub)
4. Select the `mangomasti` repository

### 4.2 Configure Project

Vercel will auto-detect Next.js. Configure these settings:

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `bun run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)

### 4.3 Add Environment Variables

**IMPORTANT**: Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Supabase connection string from Step 1.2 |

**Example**:
```
DATABASE_URL=postgresql://postgres.xxxxx:your-password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Once deployed, Vercel will show you the URL (e.g., `mangomasti.vercel.app`)

## Step 5: Verify Deployment

1. Visit your Vercel URL
2. Your app should load with the reviews from the database
3. Check the Vercel deployment logs if there are any issues

## Local Development

To run locally with Supabase:

```bash
# Make sure .env.local has your Supabase DATABASE_URL
bun install
bun run dev
```

Visit http://localhost:3000

## Troubleshooting

### Build fails with "DATABASE_URL not found"

- Make sure you added `DATABASE_URL` to Vercel environment variables
- Redeploy after adding the variable

### "Connection refused" or timeout errors

- Double-check you're using the **connection pooling** URL (port 6543), not the direct connection
- Verify your database password is correct
- Make sure your Supabase project is active (free tier doesn't pause)

### Migrations haven't run

- Migrations must be run **manually** before deploying (Step 2.2)
- Vercel doesn't run migrations automatically
- To re-run migrations: `bun run db:migrate` locally

### Database schema changes

When you update your schema:

1. Generate new migration: `bun run db:generate`
2. Apply migration: `bun run db:migrate`
3. Commit the new migration files
4. Vercel will automatically redeploy on git push

## Supabase Free Tier Limits

- **Database size**: 500MB
- **Bandwidth**: 2GB/month (resets monthly)
- **No pausing**: Projects don't pause on free tier
- **Backups**: Daily backups for 7 days

Perfect for small to medium apps!

## Next Steps

- **Custom domain**: Add your domain in Vercel → Project Settings → Domains
- **Analytics**: Enable Vercel Analytics in your project settings
- **Monitoring**: Check Supabase dashboard for database usage
- **Scaling**: Upgrade Supabase or Vercel plans as needed

## Support

- Vercel docs: https://vercel.com/docs
- Supabase docs: https://supabase.com/docs
- Drizzle ORM docs: https://orm.drizzle.team

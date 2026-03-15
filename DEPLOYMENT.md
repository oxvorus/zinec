# Deployment Guide - Zinec Digital

This guide covers deploying Zinec Digital to Netlify with Supabase backend.

## Prerequisites

- Supabase account (https://supabase.com)
- Netlify account (https://netlify.com)
- Stripe account (https://stripe.com) - optional for payments
- Git repository (GitHub, GitLab, or Gitea)

## Step 1: Setup Supabase

### 1.1 Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details:
   - Name: `zinec-digital`
   - Database Password: Create a strong password
   - Region: Select closest to your users
4. Wait for project to be created (2-3 minutes)

### 1.2 Run Database Migrations

1. In Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Copy and paste the entire content from `scripts/001_init_schema.sql`
4. Click "Run"
5. Wait for success message

### 1.3 Get API Keys

1. Go to Settings → API
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (scroll down) → `SUPABASE_SERVICE_KEY`

### 1.4 Enable Email Authentication

1. Go to Authentication → Providers
2. Make sure "Email" is enabled (should be by default)
3. Go to Email Templates and customize if needed

## Step 2: Setup Stripe (Optional)

1. Go to https://stripe.com and sign up
2. In Dashboard, click "Developers" → "API Keys"
3. Copy these values:
   - Publishable Key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret Key → `STRIPE_SECRET_KEY`

## Step 3: Prepare for Netlify

### 3.1 Push to Git Repository

```bash
cd zinec-digital
git init
git add .
git commit -m "Initial Zinec Digital setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zinec-digital.git
git push -u origin main
```

### 3.2 Verify Build Locally

```bash
npm run build
# Should complete without errors
```

## Step 4: Deploy to Netlify

### 4.1 Connect Repository

1. Go to https://netlify.com and sign in
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub, etc.)
4. Select your `zinec-digital` repository
5. Click "Deploy site"

### 4.2 Configure Environment Variables

1. In Netlify dashboard, go to Site settings → Build & deploy → Environment
2. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
   SUPABASE_SERVICE_KEY = your_supabase_service_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = your_stripe_key (if using Stripe)
   STRIPE_SECRET_KEY = your_stripe_secret (if using Stripe)
   NEXT_PUBLIC_APP_URL = https://your-site.netlify.app
   NODE_ENV = production
   ```

### 4.3 Configure Build Settings

1. Go to Site settings → Build & deploy → Build settings
2. Set:
   - Build command: `npm run build`
   - Publish directory: `.next`

### 4.4 Trigger Deploy

1. Click "Trigger deploy" → "Deploy site"
2. Wait for deployment to complete (5-10 minutes)
3. Visit your site at the provided URL

## Step 5: Post-Deployment Setup

### 5.1 Test Authentication

1. Visit your site
2. Click "Daftar" to create an account
3. Check your email for confirmation
4. Complete registration

### 5.2 Create Test Data

1. As a seller, create test services
2. As a buyer, browse and test ordering
3. Test the checkout flow

### 5.3 Enable Custom Domain (Optional)

1. In Netlify, go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow domain connection instructions

### 5.4 Enable HTTPS

1. Netlify enables HTTPS automatically
2. Go to Domain management to verify certificate

## Environment Variables Reference

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...

# Stripe Configuration (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## Database Backup

### Automatic Backups

Supabase automatically backs up your database:
- Daily backups retained for 7 days
- Weekly backups retained for 4 weeks

### Manual Backup

1. Go to Supabase Dashboard → Backups
2. Click "Request backup"
3. Download when ready

## Monitoring & Support

### Monitor Supabase

1. Dashboard → Database → Database Health
2. Check for alerts and usage

### Monitor Netlify

1. Site analytics available in Netlify dashboard
2. Check function logs if issues occur

### Common Issues

**Build fails:**
- Check environment variables are set
- Verify build command is `npm run build`
- Check for TypeScript errors: `npm run lint`

**Database connection errors:**
- Verify Supabase URL and keys are correct
- Check Supabase project is running
- Verify RLS policies if data not showing

**Email not sending:**
- Check Supabase email template settings
- Verify sender email is configured

## Scaling Considerations

1. **Database**: Supabase handles scaling automatically
2. **Storage**: Upload files to Supabase Storage
3. **Functions**: Netlify Functions available for backend tasks
4. **CDN**: Netlify CDN caches assets automatically

## Security Checklist

- [ ] Environment variables set in Netlify
- [ ] Supabase RLS policies enabled
- [ ] Custom domain configured
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] API keys rotated regularly
- [ ] Two-factor authentication enabled on accounts

## Rollback Procedure

If something goes wrong:

1. In Netlify, go to Deploys
2. Find previous working deployment
3. Click "Publish deploy"
4. Revert environment variables if needed

## Next Steps

1. Set up error monitoring (Sentry)
2. Configure email service for transactional emails
3. Setup analytics
4. Create admin dashboard
5. Configure payment webhooks
6. Setup automated backups
7. Create support ticket system

## Support & Resources

- Supabase Docs: https://supabase.com/docs
- Netlify Docs: https://docs.netlify.com
- Next.js Docs: https://nextjs.org/docs
- Stripe Docs: https://stripe.com/docs

---

**Last Updated**: March 2024

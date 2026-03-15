# Zinec Digital - Quick Start Guide

Get Zinec Digital up and running in minutes!

## 5-Minute Setup

### 1. Clone & Install (1 min)

```bash
# Clone the repository
git clone https://github.com/yourusername/zinec-digital.git
cd zinec-digital

# Install dependencies
npm install
```

### 2. Setup Supabase (2 min)

1. Go to https://supabase.com and create a new project
2. Once created, go to Settings → API
3. Copy your `Project URL` and `anon key`
4. Create `.env.local` file in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Create Database (1 min)

1. In Supabase dashboard, go to SQL Editor
2. Create a new query
3. Copy entire contents of `scripts/001_init_schema.sql`
4. Paste and run the query
5. Wait for completion

### 4. Run Development Server (1 min)

```bash
npm run dev
```

Visit http://localhost:3000 - you should see the homepage!

## First Steps

### Test Registration

1. Click "Daftar" button
2. Choose role (Pembeli or Penyedia Jasa)
3. Fill in details
4. Sign up

### As a Buyer

1. Click "Jelajahi Jasa" to browse services
2. Search for services
3. Click a service to see details
4. Try creating an order

### As a Seller

1. Go to Dashboard
2. Click "Tambah Layanan"
3. Fill in service details
4. Save service
5. View in browse page as buyer

## Common Issues & Solutions

### Issue: "Supabase connection failed"
**Solution**: 
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Make sure Supabase project is running

### Issue: "Table does not exist"
**Solution**:
- Re-run the SQL migration in Supabase SQL Editor
- Verify no errors during migration

### Issue: "Port 3000 already in use"
**Solution**:
```bash
npm run dev -- -p 3001  # Use different port
```

### Issue: TypeScript errors
**Solution**:
```bash
npm run lint
npm run build
# Fix any errors shown
```

## Project Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Check code style
npm run type-check      # TypeScript type checking

# Database
# Copy SQL from scripts/001_init_schema.sql
# Run in Supabase SQL Editor
```

## File Structure Quick Reference

```
Key Folders:
├── app/page.tsx           ← Homepage
├── app/auth/              ← Login/Signup
├── app/browse/            ← Service browsing
├── app/dashboard/         ← Seller dashboard
├── app/api/              ← Backend endpoints
├── components/           ← React components
├── lib/                  ← Helper functions
└── types/               ← Type definitions
```

## Important Files

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (keep secret) |
| `next.config.js` | Next.js configuration |
| `tailwind.config.js` | Tailwind CSS config |
| `middleware.ts` | Route protection |
| `scripts/001_init_schema.sql` | Database setup |

## Environment Variables Explained

```
NEXT_PUBLIC_SUPABASE_URL
  → Your Supabase project URL (public, OK to share)

NEXT_PUBLIC_SUPABASE_ANON_KEY
  → Anonymous key for client-side (public, OK to share)

SUPABASE_SERVICE_KEY
  → Server-side key (NEVER share this!)

NEXT_PUBLIC_APP_URL
  → Your app's URL (e.g., http://localhost:3000)
```

## User Roles Explained

### Pembeli (Buyer)
- Browse services
- Create orders
- Chat with sellers
- Leave reviews

### Penyedia Jasa (Seller)
- Create services
- View incoming orders
- Chat with buyers
- Track earnings

## Database Quick Reference

### Main Tables
- `users` - All users
- `sellers` - Seller info
- `services` - Available services
- `orders` - Customer orders
- `messages` - Chat messages

### Access Rules (RLS)
- Users can only see their own data
- Sellers can see their orders
- Buyers can see their orders
- Services are public

## Next Steps After Setup

1. **Customize Settings**
   - Edit homepage text
   - Add your logo
   - Change colors in `tailwind.config.js`

2. **Add Test Data**
   - Create seller account
   - Add test services
   - Create test orders

3. **Deploy** (optional)
   - Push to GitHub
   - Connect to Netlify
   - Add environment variables
   - Deploy

4. **Add Features**
   - Payment integration
   - Email notifications
   - File uploads
   - Advanced search

## Deployment in 5 Minutes

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial setup"
git push origin main
```

2. **Connect to Netlify**
   - Go to netlify.com
   - Click "Import from Git"
   - Select your repository
   - Configure build settings (already in netlify.toml)

3. **Add Environment Variables**
   - In Netlify, go to Site settings → Environment
   - Add all variables from `.env.local`

4. **Deploy**
   - Click "Deploy"
   - Wait 5-10 minutes
   - Your site is live!

## Testing Checklist

- [ ] Homepage loads
- [ ] Can signup as buyer
- [ ] Can signup as seller
- [ ] Can browse services (empty list OK)
- [ ] Can create service (as seller)
- [ ] Service appears in browse
- [ ] Can view service details
- [ ] Can create order
- [ ] Checkout page loads

## Performance Tips

1. Images load fast - use small sizes
2. Lazy load data - pages load progressively
3. Responsive design - works on all devices
4. Database indexed - queries are fast

## Security Reminder

- Never commit `.env.local` to Git
- Never share `SUPABASE_SERVICE_KEY`
- Keep dependencies updated: `npm update`
- Review database RLS policies regularly

## Getting Help

### Documentation
- `README.md` - Full documentation
- `PROJECT_SUMMARY.md` - Project overview
- `DEPLOYMENT.md` - Deployment guide
- Code comments throughout project

### Resources
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

### Debugging
1. Check browser console (F12)
2. Check terminal for errors
3. Check Supabase logs (dashboard)
4. Search error message online

## Common Customizations

### Change Primary Color
Edit `app/globals.css`:
```css
--color-primary: #YOUR-COLOR;
```

### Change Site Name
Edit `app/layout.tsx`:
```tsx
title: 'Your Site Name'
```

### Change Homepage Text
Edit `app/page.tsx`:
- Update hero section text
- Change section descriptions
- Modify CTA buttons

### Add Categories
Edit `app/browse/page.tsx`:
```tsx
const categories = [
  'Your Category 1',
  'Your Category 2',
  // ...
];
```

## Troubleshooting Checklist

```
□ Is Node.js installed? npm --version
□ Is .env.local created? ls -la .env.local
□ Is Supabase project created? Check supabase.com
□ Is database migrated? Check Supabase SQL Editor
□ Is port 3000 free? lsof -i :3000
□ Do env vars have correct values? cat .env.local
□ Did npm install run? ls node_modules
```

## What's Next?

### Immediate (Today)
- Get it running locally ✓
- Create test accounts ✓
- Test basic flow ✓

### Short Term (This Week)
- Deploy to Netlify
- Setup custom domain
- Add test data

### Medium Term (This Month)
- Add payment integration
- Email notifications
- User profile pages
- Advanced search

### Long Term (Future)
- Admin dashboard
- Analytics
- Mobile app
- International support

---

**You're ready to go!** Start with `npm run dev` and explore the application. 

Have fun building Zinec Digital! 🚀

For detailed information, see the full documentation in README.md and PROJECT_SUMMARY.md.

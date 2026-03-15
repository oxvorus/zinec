# Zinec Digital - Marketplace Jasa Akademik

Platform terpercaya yang menghubungkan mahasiswa dengan asisten profesional untuk bantuan akademik.

## Fitur

- **Authentication Real**: Sistem login/signup dengan Supabase
- **Browse Services**: Jelajahi berbagai layanan akademik
- **Order Management**: Kelola pesanan dan komunikasi
- **Seller Dashboard**: Dashboard untuk penyedia jasa
- **Real-time Messaging**: Chat terintegrasi
- **Payment Integration**: Integrasi pembayaran Stripe
- **Modern UI**: Desain modern dengan Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **Payments**: Stripe
- **Hosting**: Netlify

## Setup Instructions

### 1. Environment Variables

Buat file `.env.local` di root project:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Database Setup

1. Buat project di [Supabase](https://supabase.com)
2. Jalankan SQL migration:
   - Copy konten dari `scripts/001_init_schema.sql`
   - Jalankan di Supabase SQL Editor

### 3. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 4. Run Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── browse/            # Browse services page
│   ├── dashboard/         # Seller dashboard
│   ├── orders/            # User orders
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/                   # Utilities
│   ├── supabase-client.ts
│   └── supabase-server.ts
├── types/                 # TypeScript types
│   └── index.ts
├── scripts/               # Database migrations
│   └── 001_init_schema.sql
├── middleware.ts          # Route protection
├── next.config.js         # Next.js config
├── tailwind.config.js     # Tailwind config
└── package.json
```

## Database Schema

### Tables

1. **users** - Profil pengguna (pembeli & penyedia)
2. **sellers** - Informasi tambahan penyedia jasa
3. **services** - Layanan yang ditawarkan
4. **orders** - Pesanan dari pembeli
5. **messages** - Chat antara pembeli dan penyedia
6. **transactions** - Catatan transaksi/earnings
7. **reviews** - Review dan rating

## Authentication Flow

1. User mendaftar dengan email/password atau Google
2. Email di-verify oleh Supabase
3. User dipandu untuk melengkapi profil
4. Pembeli dapat browse dan order services
5. Penyedia dapat membuat services dan menerima orders

## Features to Implement

- [x] Project Setup
- [x] Database Schema
- [x] Authentication Pages
- [x] Home Page
- [x] Browse Services
- [ ] Service Detail Page
- [ ] Checkout & Payments
- [ ] Seller Dashboard
- [ ] Order Management
- [ ] Real-time Messaging
- [ ] User Profile
- [ ] Review System

## Deployment

### Netlify

1. Connect repository ke Netlify
2. Set environment variables di Netlify dashboard
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Deploy

## Security Notes

- Password hashing dengan bcrypt (Supabase Auth)
- Row Level Security (RLS) policies
- Secure session management
- SQL injection prevention

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT

## Support

Email: support@zinec.id

---

**Created with Next.js & Supabase**

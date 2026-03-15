# Analytics Setup Checklist

Panduan lengkap untuk mengaktifkan dan menggunakan sistem location tracking.

## Quick Setup (5 menit)

### Step 1: Run Database Migration

1. Buka Supabase Dashboard → SQL Editor
2. Buat query baru
3. Copy & paste semua kode dari `scripts/002_location_analytics.sql`
4. Klik "RUN" untuk menjalankan migration

**Tables yang akan dibuat:**
- ✅ `location_analytics` - Menyimpan data lokasi dari setiap pengunjung
- ✅ `daily_location_stats` (view) - Statistik harian
- ✅ `location_summary` (view) - Ringkasan lokasi

### Step 2: Set Environment Variable

1. Buka project settings di Vercel atau aplikasi Anda
2. Tambahkan variable baru:
   ```
   IP_HASH_SALT=your-random-secret-here
   ```
3. Generate salt dengan:
   ```bash
   openssl rand -base64 32
   ```

### Step 3: Redeploy

Push changes ke repository atau redeploy aplikasi untuk mengaktifkan:
```bash
git push origin main
```

## Verification

### Cek apakah tracking berfungsi:

1. **Di Browser:**
   - Buka aplikasi Zinec Digital
   - Buka DevTools (F12) → Console
   - Jangan ada error yang muncul
   - Cek Network tab → POST `/api/analytics/track`

2. **Di Database:**
   ```sql
   -- Run di Supabase SQL Editor
   SELECT COUNT(*) FROM location_analytics;
   
   -- Harus menampilkan jumlah > 0 setelah beberapa kunjungan
   ```

3. **Di Dashboard:**
   - Buka `/admin/analytics`
   - Jika tabel kosong, tunggu beberapa menit untuk aggregation

## Accessing Analytics

### Admin Dashboard

**URL:** `https://yourapp.com/admin`

Dashboard menampilkan:
- Shortcut ke Analytics Marketing
- Manajemen Pengguna (placeholder)
- Pengaturan Platform (placeholder)

### Analytics Dashboard

**URL:** `https://yourapp.com/admin/analytics`

Fitur lengkap:
- **Overview Stats:** Total visits, unique visitors, orders, conversion rate
- **Location Heatmap:** Visualisasi intensitas kunjungan per daerah
- **Detailed Stats:** Ranked list dengan metrics per lokasi
- **Filters:** 
  - Date range: Hari Ini, Minggu Ini, Bulan Ini, Semua Waktu
  - Province: Filter by specific province

### Key Metrics

Untuk setiap lokasi (province + city):

| Metric | Arti |
|--------|------|
| Kunjungan | Total page views dari lokasi ini |
| Pengunjung Unik | Unique IP addresses |
| Pengguna Terdaftar | Registered users |
| Pembeli/Penjual | Breakdown by user type |
| Order | Total orders created |
| Konversi | Percentage (orders / visits) |
| Layanan Dilihat | Total service views |

## Data Collection

### Apa yang dikumpulkan?

✅ **Dikumpulkan:**
- Province dan city
- Jumlah kunjungan
- Konversi per region
- User type (pembeli/penjual)
- Timestamp kunjungan

❌ **TIDAK dikumpulkan:**
- IP address (hanya hash)
- Nama pengguna
- Email address
- Personal information
- Browsing history

### Tracking Events

Automatic tracking:
- `page_view` - Setiap kunjungan ke halaman
- `service_viewed` - Ketika user melihat service detail
- `order_created` - Ketika order berhasil dibuat

Custom tracking untuk developers:

```typescript
import { useLocationTracking } from '@/hooks/useLocationTracking';

export default function MyComponent() {
  const { trackEvent } = useLocationTracking();
  
  const handleAction = () => {
    trackEvent({
      event_type: 'custom_event',
      service_id: 'service123',
    });
  };
  
  return <button onClick={handleAction}>Action</button>;
}
```

## Usage Examples

### 1. Find Best Performing Region

```sql
SELECT 
  province, 
  city,
  total_visits,
  conversion_rate,
  total_orders
FROM location_summary
ORDER BY conversion_rate DESC
LIMIT 10;
```

**Output:** Top 10 regions by conversion rate

### 2. Compare Provinces

```sql
SELECT 
  province,
  SUM(total_visits) as total_visits,
  SUM(total_orders) as total_orders,
  AVG(conversion_rate) as avg_conversion
FROM location_summary
GROUP BY province
ORDER BY total_visits DESC;
```

**Output:** Province-level aggregation

### 3. Track Growth Over Time

```sql
SELECT
  DATE(visit_date) as date,
  province,
  SUM(visit_count) as daily_visits,
  SUM(orders_created) as daily_orders
FROM daily_location_stats
WHERE visit_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(visit_date), province
ORDER BY date DESC;
```

**Output:** Daily trends by province

## Marketing Optimization Tips

### For Regional Campaigns

1. **Identify Top Regions:**
   - Go to `/admin/analytics`
   - Sort by "Konversi" (conversion rate)
   - Focus ads on top 5 regions

2. **Budget Allocation:**
   - Allocate 60% budget → Top 3 regions
   - Allocate 30% budget → Middle tier regions
   - Allocate 10% budget → Testing new regions

3. **Audience Targeting:**
   - Use "Pembeli/Penjual" split to tailor messaging
   - Regions with more sellers → Target buyers there
   - Regions with more buyers → Target sellers there

### Monitoring Performance

**Check Weekly:**
- New high-performing regions
- Declining regions (investigate why)
- Seasonal patterns
- Mobile vs Desktop distribution

**Check Monthly:**
- ROI by region
- Growth trends
- Market saturation indicators
- New market opportunities

## Troubleshooting

### Issue: No data in analytics

**Solution:**
1. Verify migration ran successfully: `SELECT * FROM location_analytics LIMIT 1`
2. Check IP_HASH_SALT env var is set
3. Wait 5 minutes for first data to appear
4. Check browser console for errors
5. Verify tracking API endpoint is accessible

### Issue: Wrong locations detected

**Possible causes:**
- IP geolocation API accuracy (±50km for free tier)
- VPN/Proxy masking real location
- Shared office networks

**Solution:**
- Add manual city mappings in `lib/geolocation.ts`
- Use premium geolocation service (MaxMind)
- Implement user location hints (optional)

### Issue: High CPU usage

**Possible causes:**
- Too many requests to geolocation API
- Database queries are slow

**Solution:**
- Implement Redis caching for IP→Location
- Use local MaxMind database
- Add database indexes (already included)
- Batch processing for aggregations

## Security Notes

### Data Protection

- IPs are hashed with SHA256
- No plaintext IPs stored in database
- RLS prevents unauthorized access
- Audit trail available in Supabase

### GDPR/Privacy Compliance

- ✅ No personal data collected
- ✅ IP hashing provides anonymity
- ✅ No third-party tracking
- ✅ No cookies required
- ✅ Data retention manageable

### Access Control

- Only admin users can view analytics
- Regular users cannot access data
- Add more admins in Supabase Auth

## Next Steps

1. ✅ Run the migration
2. ✅ Set IP_HASH_SALT
3. ✅ Deploy changes
4. ✅ Visit `/admin/analytics` after 5 minutes
5. ✅ Start planning regional campaigns

## Support & Documentation

- **Full Guide:** See `LOCATION_TRACKING.md`
- **API Reference:** See `app/api/analytics/track/route.ts`
- **Components:** See `components/analytics/`
- **Database:** See `scripts/002_location_analytics.sql`

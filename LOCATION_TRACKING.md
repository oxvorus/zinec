# Location Tracking & Marketing Analytics

Sistem tracking lokasi otomatis untuk mengidentifikasi daerah optimal untuk pemasaran.

## Overview

Fitur ini mengumpulkan data lokasi dari setiap pengunjung platform untuk membantu Anda:
- Mengidentifikasi daerah dengan traffic tertinggi
- Melihat konversi per province/city
- Mengoptimalkan strategi iklan berdasarkan performa regional
- Memahami distribusi pembeli dan penjual

## Setup Instructions

### 1. Database Migration

Jalankan SQL migration untuk membuat tabel location analytics:

```bash
# The migration file already exists at:
# /scripts/002_location_analytics.sql

# Execute it in your Supabase dashboard:
# 1. Go to SQL Editor in Supabase Dashboard
# 2. Create new query
# 3. Copy content from 002_location_analytics.sql
# 4. Run the query
```

Tables created:
- `location_analytics` - Raw tracking data
- `daily_location_stats` (view) - Daily aggregated statistics
- `location_summary` (view) - Overall statistics by location

### 2. Environment Variables

Add to your `.env.local`:

```env
# Already in .env.example, add actual values:
IP_HASH_SALT=your-secret-salt-here
```

The `IP_HASH_SALT` is used to hash IP addresses. Use a strong random string:

```bash
# Generate a secure salt:
openssl rand -base64 32
```

### 3. Geolocation Service

The system uses a free geolocation API (`ipapi.co`) to convert IP addresses to locations.

**Note**: In production with high traffic, consider:
- Caching results with Redis
- Using MaxMind GeoLite2 database locally
- Implementing rate limiting

### 4. API Deployment

The tracking API is already set up at `/api/analytics/track`. It:
- Extracts client IP from request headers
- Converts IP to location (province + city)
- Hashes IP for privacy
- Stores tracking data in database
- Returns location data to client

## Implementation Details

### Files Created

**Database:**
- `scripts/002_location_analytics.sql` - Database schema and views

**Backend:**
- `lib/geolocation.ts` - IP-to-location utilities
- `app/api/analytics/track/route.ts` - Tracking API endpoint
- `hooks/useLocationTracking.ts` - Client-side tracking hook

**Frontend:**
- `components/analytics/LocationStatsCard.tsx` - Location stats card component
- `components/analytics/LocationHeatmap.tsx` - Location heatmap visualization
- `app/admin/page.tsx` - Admin dashboard
- `app/admin/analytics/page.tsx` - Full analytics dashboard
- `app/admin/users/page.tsx` - User management (placeholder)
- `app/admin/settings/page.tsx` - Settings (placeholder)

**Modified:**
- `app/layout.tsx` - Added useLocationTracking hook

### Data Structure

Each tracking record stores:

```typescript
{
  ip_address_hash: string;        // SHA256 hash of IP
  country_code: string;            // Always "ID" for Indonesia
  province: string;                // Province name
  city: string;                    // City name
  latitude: number;                // Approximate coordinates
  longitude: number;               // Approximate coordinates
  user_id: uuid;                   // Null for anonymous
  is_seller: boolean;              // User type
  user_type: string;               // "authenticated" or "anonymous"
  page_visited: string;            // Current page path
  event_type: string;              // page_view, service_viewed, order_created
  service_id: uuid;                // If applicable
  order_id: uuid;                  // If applicable
  visited_at: timestamp;           // When the visit occurred
  created_at: timestamp;           // Record creation time
}
```

### Views

**`daily_location_stats`** - Daily aggregation:
```sql
SELECT
  visit_date,
  province,
  city,
  user_type,
  visit_count,
  unique_visitors,
  registered_users,
  orders_created,
  services_viewed
FROM daily_location_stats
```

**`location_summary`** - Overall statistics:
```sql
SELECT
  province,
  city,
  total_visits,
  unique_ips,
  registered_users,
  sellers,
  buyers,
  total_orders,
  service_views,
  conversion_rate,
  last_activity
FROM location_summary
```

## Usage

### Access Analytics Dashboard

Navigate to: `/admin/analytics`

The dashboard displays:
1. **Overview Stats** - Total visits, unique visitors, orders, conversion rate
2. **Heatmap** - Visual intensity map of visits by province/city
3. **Detailed Cards** - Ranked list of locations with detailed metrics
4. **Filters** - By date range and province

### Tracking on Custom Pages

To track custom events on specific pages:

```typescript
'use client';

import { useLocationTracking } from '@/hooks/useLocationTracking';

export default function MyPage() {
  const { trackEvent } = useLocationTracking();

  const handleServiceView = (serviceId: string) => {
    trackEvent({
      event_type: 'service_viewed',
      service_id: serviceId,
    });
  };

  return (
    // Your component
  );
}
```

### Query Raw Data

Access raw tracking data directly:

```typescript
const { data } = await supabase
  .from('location_analytics')
  .select('*')
  .eq('event_type', 'order_created')
  .gte('visited_at', new Date('2024-01-01').toISOString());
```

## Privacy & Security

### IP Hashing

- IPs are hashed using SHA256 with a salt
- Original IPs are never stored
- Hashed IPs cannot be reverse-engineered
- Complies with privacy requirements

### No User Consent Required

Per your requirements, this implementation:
- Does not require cookie consent banners
- Does not store personally identifiable information
- Does not track user behavior beyond location
- Does not use third-party trackers

### Row Level Security

- Only admin accounts can view analytics data
- Regular users cannot access location_analytics table
- Data is isolated and protected

## Optimization Tips

### For High Traffic

1. **Cache Location Lookups** (Redis):
```typescript
// Cache IP-to-location mappings for 24 hours
```

2. **Use Local GeoIP Database**:
   - Download MaxMind GeoLite2
   - Store locally in `/lib/geoip/`
   - No API calls needed

3. **Batch Processing**:
   - Aggregate data asynchronously
   - Archive old records to cold storage

### For Better Accuracy

1. **Improve City Detection**:
   - Add more Indonesian city mappings in `INDONESIA_REGIONS`
   - Use more reliable geolocation provider

2. **Reduce Tracking Overhead**:
   - Implement client-side caching
   - Batch multiple events before sending

3. **Add Fallback Logic**:
   - If geolocation fails, use browser language
   - Store default province for retries

## Troubleshooting

### No data appearing

1. Check that migration has been run
2. Verify Supabase environment variables are set
3. Check browser console for tracking errors
4. Ensure `/api/analytics/track` endpoint is accessible

### Inaccurate locations

1. The free `ipapi.co` service may not be precise
2. Consider using MaxMind GeoLite2 for better accuracy
3. Add more city mappings to `INDONESIA_REGIONS`

### Missing data

1. Verify RLS policies allow writes to `location_analytics`
2. Check that `IP_HASH_SALT` environment variable is set
3. Ensure tracking hook is called on pages

## Future Enhancements

- Export analytics as PDF/CSV
- Schedule automated reports
- Integration with advertising platforms
- Real-time notifications for high-traffic areas
- Predictive analytics for traffic patterns
- Integration with Google Ads/Facebook Ads API
- A/B testing by region
- Competitor analysis by location

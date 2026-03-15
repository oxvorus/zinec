import { NextRequest, NextResponse } from 'next/server';
import { getClientIP, hashIPAddress, getLocationFromIP } from '@/lib/geolocation';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface TrackingPayload {
  page_visited?: string;
  event_type?: string;
  service_id?: string;
  order_id?: string;
  user_id?: string;
  is_seller?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackingPayload = await request.json();

    // Extract client IP
    const clientIP = getClientIP(request);
    const ipHash = hashIPAddress(clientIP);

    // Get location from IP
    const location = await getLocationFromIP(clientIP);

    // Insert tracking data into database
    const { error } = await supabase
      .from('location_analytics')
      .insert([
        {
          ip_address_hash: ipHash,
          country_code: location.country_code,
          province: location.province,
          city: location.city,
          latitude: location.latitude,
          longitude: location.longitude,
          user_id: body.user_id || null,
          is_seller: body.is_seller || false,
          user_type: body.user_id ? 'authenticated' : 'anonymous',
          page_visited: body.page_visited || 'unknown',
          event_type: body.event_type || 'page_view',
          service_id: body.service_id || null,
          order_id: body.order_id || null,
          visited_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('[Tracking] Error inserting location data:', error);
      // Don't fail the request - tracking is non-critical
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 200 } // Return 200 to not break client
      );
    }

    return NextResponse.json(
      { success: true, location },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Tracking] Error in track endpoint:', error);
    // Return success anyway - tracking should never break the app
    return NextResponse.json(
      { success: false },
      { status: 200 }
    );
  }
}

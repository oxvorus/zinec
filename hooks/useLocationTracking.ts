'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

interface TrackingOptions {
  page_visited?: string;
  event_type?: string;
  service_id?: string;
  order_id?: string;
}

export function useLocationTracking(options?: TrackingOptions) {
  const session = useSession();
  const hasTracked = useRef(false);

  const trackEvent = useCallback(async (trackingOptions?: TrackingOptions) => {
    try {
      const payload = {
        page_visited: trackingOptions?.page_visited || options?.page_visited || typeof window !== 'undefined' ? window.location.pathname : 'unknown',
        event_type: trackingOptions?.event_type || options?.event_type || 'page_view',
        service_id: trackingOptions?.service_id || options?.service_id,
        order_id: trackingOptions?.order_id || options?.order_id,
        user_id: session?.user?.id,
        is_seller: false, // Will be populated from user profile
      };

      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('[Tracking] Error tracking event:', error);
      // Silently fail - don't break the app
    }
  }, [session, options]);

  useEffect(() => {
    // Track initial page view only once
    if (!hasTracked.current) {
      hasTracked.current = true;
      trackEvent();
    }
  }, [trackEvent]);

  return { trackEvent };
}

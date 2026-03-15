-- Location Analytics Table for Marketing Data
-- Tracks user visits by province and city for advertising optimization

CREATE TABLE IF NOT EXISTS location_analytics (
  id BIGSERIAL PRIMARY KEY,
  -- IP Information
  ip_address_hash TEXT NOT NULL, -- hashed IP for privacy
  -- Location Data
  country_code VARCHAR(2) DEFAULT 'ID', -- Indonesia focus
  province VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  -- User Type
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_seller BOOLEAN DEFAULT FALSE,
  user_type VARCHAR(20), -- 'authenticated' or 'anonymous'
  -- Page/Event Tracking
  page_visited VARCHAR(255),
  event_type VARCHAR(50), -- 'page_view', 'service_viewed', 'order_created', etc
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  -- Timestamp
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for fast queries
  INDEX idx_province (province),
  INDEX idx_city (city),
  INDEX idx_visited_at (visited_at DESC),
  INDEX idx_event_type (event_type),
  INDEX idx_user_type (user_type)
);

-- Create aggregated view for daily statistics by province
CREATE OR REPLACE VIEW daily_location_stats AS
SELECT
  DATE(visited_at) as visit_date,
  province,
  city,
  user_type,
  COUNT(*) as visit_count,
  COUNT(DISTINCT ip_address_hash) as unique_visitors,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) as registered_users,
  COUNT(CASE WHEN event_type = 'order_created' THEN 1 END) as orders_created,
  COUNT(CASE WHEN event_type = 'service_viewed' THEN 1 END) as services_viewed
FROM location_analytics
GROUP BY DATE(visited_at), province, city, user_type;

-- Create aggregated view for overall statistics
CREATE OR REPLACE VIEW location_summary AS
SELECT
  province,
  city,
  COUNT(*) as total_visits,
  COUNT(DISTINCT ip_address_hash) as unique_ips,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) as registered_users,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL AND is_seller = TRUE) as sellers,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL AND is_seller = FALSE) as buyers,
  COUNT(CASE WHEN event_type = 'order_created' THEN 1 END) as total_orders,
  COUNT(CASE WHEN event_type = 'service_viewed' THEN 1 END) as service_views,
  ROUND(
    COUNT(CASE WHEN event_type = 'order_created' THEN 1 END)::NUMERIC / 
    NULLIF(COUNT(*), 0) * 100, 2
  ) as conversion_rate,
  MAX(visited_at) as last_activity
FROM location_analytics
GROUP BY province, city
ORDER BY total_visits DESC;

-- Enable RLS (no restrictions - admin can see all data)
ALTER TABLE location_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_can_read_location_analytics" ON location_analytics
  FOR SELECT USING (auth.jwt() ->> 'email' = ANY(ARRAY['admin@zinec.id']));

CREATE POLICY "service_can_insert_location_analytics" ON location_analytics
  FOR INSERT WITH CHECK (TRUE); -- API can insert

-- Grant permissions
GRANT SELECT ON location_analytics TO anon, authenticated;
GRANT SELECT ON daily_location_stats TO anon, authenticated;
GRANT SELECT ON location_summary TO anon, authenticated;
GRANT INSERT ON location_analytics TO anon, authenticated;

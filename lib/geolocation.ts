// Geolocation utilities for IP-based location detection
// Uses IP geolocation data to identify province and city
import crypto from 'crypto';

interface LocationData {
  province: string;
  city: string;
  latitude?: number;
  longitude?: number;
  country_code: string;
}

// Indonesian provinces and their major cities with approximate coordinates
const INDONESIA_REGIONS: Record<string, { cities: Record<string, { lat: number; lon: number }>; lat: number; lon: number }> = {
  'Jawa Barat': {
    cities: {
      'Bandung': { lat: -6.9175, lon: 107.6191 },
      'Bekasi': { lat: -6.2349, lon: 107.0055 },
      'Bogor': { lat: -6.5971, lon: 106.7910 },
      'Depok': { lat: -6.4029, lon: 106.8218 },
      'Cirebon': { lat: -6.7004, lon: 108.3518 },
    },
    lat: -6.9547,
    lon: 107.0215,
  },
  'Jawa Tengah': {
    cities: {
      'Semarang': { lat: -6.9667, lon: 110.4167 },
      'Solo': { lat: -7.5500, lon: 110.8167 },
      'Yogyakarta': { lat: -7.7956, lon: 110.3695 },
      'Surakarta': { lat: -7.5533, lon: 110.8243 },
    },
    lat: -7.1504,
    lon: 110.1498,
  },
  'Jawa Timur': {
    cities: {
      'Surabaya': { lat: -7.2506, lon: 112.7508 },
      'Malang': { lat: -7.9829, lon: 112.6325 },
      'Sidoarjo': { lat: -7.4425, lon: 112.7381 },
      'Gresik': { lat: -7.1711, lon: 112.6553 },
      'Pasuruan': { lat: -7.6500, lon: 112.9042 },
    },
    lat: -7.5598,
    lon: 112.7521,
  },
  'DKI Jakarta': {
    cities: {
      'Jakarta Pusat': { lat: -6.1752, lon: 106.8272 },
      'Jakarta Selatan': { lat: -6.2753, lon: 106.7964 },
      'Jakarta Barat': { lat: -6.1410, lon: 106.7610 },
      'Jakarta Utara': { lat: -6.1397, lon: 106.8338 },
      'Jakarta Timur': { lat: -6.2349, lon: 107.0055 },
    },
    lat: -6.2088,
    lon: 106.8456,
  },
  'Sumatera Utara': {
    cities: {
      'Medan': { lat: 2.1955, lon: 99.1142 },
      'Binjai': { lat: 2.1081, lon: 99.6664 },
      'Deli Serdang': { lat: 2.7224, lon: 99.5968 },
    },
    lat: 2.7709,
    lon: 98.6722,
  },
  'Sumatera Barat': {
    cities: {
      'Padang': { lat: -0.9547, lon: 100.3164 },
      'Bukittinggi': { lat: -0.3021, lon: 101.4381 },
      'Pariaman': { lat: -0.6331, lon: 99.7619 },
    },
    lat: -0.1888,
    lon: 100.3692,
  },
  'Riau': {
    cities: {
      'Pekanbaru': { lat: 0.5071, lon: 101.4472 },
      'Dumai': { lat: 1.6664, lon: 101.4311 },
    },
    lat: 0.2708,
    lon: 101.4447,
  },
  'Kalimantan': {
    cities: {
      'Banjarmasin': { lat: -3.3277, lon: 114.5898 },
      'Samarinda': { lat: -0.4948, lon: 117.1726 },
      'Pontianak': { lat: -0.0263, lon: 109.3425 },
    },
    lat: -1.0000,
    lon: 113.3333,
  },
  'Sulawesi': {
    cities: {
      'Makassar': { lat: -5.1477, lon: 119.4327 },
      'Manado': { lat: 1.4748, lon: 124.8309 },
    },
    lat: -2.4833,
    lon: 120.0167,
  },
  'Bali': {
    cities: {
      'Denpasar': { lat: -8.6705, lon: 115.2126 },
      'Ubud': { lat: -8.5069, lon: 115.2625 },
    },
    lat: -8.6705,
    lon: 115.2126,
  },
  'Nusa Tenggara': {
    cities: {
      'Mataram': { lat: -8.5865, lon: 116.1230 },
      'Kupang': { lat: -10.1772, lon: 123.6110 },
    },
    lat: -9.1667,
    lon: 120.0000,
  },
};

/**
 * Hash IP address for privacy protection
 */
export function hashIPAddress(ip: string): string {
  return crypto.createHash('sha256').update(ip + process.env.IP_HASH_SALT || 'default-salt').digest('hex');
}

/**
 * Extract IP address from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

/**
 * Detect location based on IP address (simplified version)
 * In production, you'd integrate with MaxMind GeoLite2 or similar service
 * For now, we'll use a simple heuristic based on common Indonesian ISPs
 */
export async function getLocationFromIP(ipAddress: string): Promise<LocationData> {
  try {
    // Call a free geolocation API (ip-api.com) with non-commercial license
    // Or use MaxMind GeoLite2 with database file
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'force-cache', // Use cache aggressively
    });

    if (!response.ok) {
      return getDefaultLocation();
    }

    const data = await response.json();

    // Map response to our format
    const province = mapCityToProvince(data.region);
    const city = data.city || data.region || 'Unknown';

    return {
      province: province || 'Indonesia',
      city: city,
      latitude: data.latitude ? parseFloat(data.latitude) : undefined,
      longitude: data.longitude ? parseFloat(data.longitude) : undefined,
      country_code: data.country_code || 'ID',
    };
  } catch (error) {
    console.error('[Location] Error detecting location from IP:', error);
    return getDefaultLocation();
  }
}

/**
 * Map city to Indonesian province
 */
function mapCityToProvince(city: string | undefined): string {
  if (!city) return 'Indonesia';

  const cityLower = city.toLowerCase();

  // Check direct matches first
  for (const [province, data] of Object.entries(INDONESIA_REGIONS)) {
    for (const regionCity of Object.keys(data.cities)) {
      if (cityLower.includes(regionCity.toLowerCase())) {
        return province;
      }
    }
  }

  // Fallback mappings
  const cityMappings: Record<string, string> = {
    'jakarta': 'DKI Jakarta',
    'bandung': 'Jawa Barat',
    'surabaya': 'Jawa Timur',
    'medan': 'Sumatera Utara',
    'semarang': 'Jawa Tengah',
    'makassar': 'Sulawesi',
    'denpasar': 'Bali',
  };

  for (const [key, province] of Object.entries(cityMappings)) {
    if (cityLower.includes(key)) {
      return province;
    }
  }

  return 'Indonesia';
}

/**
 * Get default location (Indonesia-wide)
 */
export function getDefaultLocation(): LocationData {
  return {
    province: 'Indonesia',
    city: 'Unknown',
    latitude: -0.7893,
    longitude: 113.9213,
    country_code: 'ID',
  };
}

/**
 * Get coordinates for a province/city combination
 */
export function getCoordinates(province: string, city: string): { lat: number; lon: number } {
  const provinceData = INDONESIA_REGIONS[province];

  if (provinceData && city && provinceData.cities[city]) {
    return provinceData.cities[city];
  }

  if (provinceData) {
    return { lat: provinceData.lat, lon: provinceData.lon };
  }

  // Indonesia center
  return { lat: -0.7893, lon: 113.9213 };
}

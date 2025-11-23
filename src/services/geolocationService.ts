// IP Geolocation Service
// Uses ip-api.com (free, no API key required, 45 requests/minute)

export interface LocationData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
}

/**
 * Get user's location from their IP address
 * Uses ip-api.com free API
 */
export async function getUserLocation(): Promise<LocationData | null> {
  try {
    const response = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,timezone,query', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Geolocation API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.status === 'fail') {
      console.error('Geolocation failed:', data.message);
      return null;
    }

    return {
      ip: data.query || 'Unknown',
      country: data.country || 'Unknown',
      countryCode: data.countryCode || 'XX',
      region: data.regionName || 'Unknown',
      city: data.city || 'Unknown',
      timezone: data.timezone || 'Unknown',
    };
  } catch (error) {
    console.error('Error fetching user location:', error);
    return null;
  }
}

/**
 * Get location display string for UI
 */
export function getLocationDisplay(location: Partial<LocationData>): string {
  if (!location.city && !location.country) {
    return 'Unknown Location';
  }

  const parts: string[] = [];
  
  if (location.city && location.city !== 'Unknown') {
    parts.push(location.city);
  }
  
  if (location.region && location.region !== 'Unknown' && location.region !== location.city) {
    parts.push(location.region);
  }
  
  if (location.country && location.country !== 'Unknown') {
    parts.push(location.country);
  }

  return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
}

/**
 * Get country flag emoji from country code
 */
export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode === 'XX' || countryCode.length !== 2) {
    return '🌍';
  }

  // Convert country code to flag emoji
  // Flag emojis are created by combining regional indicator symbols
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}

import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { STORE_ORIGIN } from '@/config/business';
import type { Address } from '@/types';

/**
 * Pickup & delivery radius validation.
 *
 * 1. Use coordinates already on the address (from a Places autocomplete, for example).
 * 2. Otherwise geocode on-device with expo-location (iOS/Android).
 * 3. Fall back to ZIP-code centroids for the San Fernando / San Gabriel valleys.
 *
 * In production, swap step 2 for Google Places / Mapbox and re-validate on the
 * server when the order is created.
 */

const ZIP_CENTROIDS: Record<string, [number, number]> = {
  // Burbank
  '91501': [34.2013, -118.2967], '91502': [34.1756, -118.3051], '91504': [34.2065, -118.3268],
  '91505': [34.1737, -118.3445], '91506': [34.1716, -118.3238], '91521': [34.157, -118.3254],
  '91523': [34.1528, -118.3359],
  // Glendale / La Crescenta / Montrose
  '91201': [34.1709, -118.2893], '91202': [34.1677, -118.2676], '91203': [34.1531, -118.2638],
  '91204': [34.1361, -118.2604], '91205': [34.1366, -118.2463], '91206': [34.1559, -118.2324],
  '91207': [34.1846, -118.2629], '91208': [34.1921, -118.2392], '91214': [34.2367, -118.2496],
  '91020': [34.2112, -118.2309],
  // Pasadena / South Pasadena / Altadena / San Marino / La Cañada
  '91101': [34.1468, -118.1394], '91103': [34.1667, -118.1653], '91104': [34.1653, -118.1236],
  '91105': [34.139, -118.1663], '91106': [34.1395, -118.1283], '91107': [34.1515, -118.0884],
  '91030': [34.1115, -118.1576], '91001': [34.1914, -118.1374], '91108': [34.1213, -118.1124],
  '91011': [34.2122, -118.2004],
  // North Hollywood / Studio City / Toluca Lake / Valley Village / Sherman Oaks / Van Nuys
  '91601': [34.1683, -118.3708], '91602': [34.1501, -118.3672], '91604': [34.1397, -118.3943],
  '91605': [34.2073, -118.3999], '91606': [34.1871, -118.3881], '91607': [34.1652, -118.3999],
  '91423': [34.1505, -118.4339], '91403': [34.1468, -118.4632], '91401': [34.1787, -118.4318],
  '91405': [34.2003, -118.4478], '91406': [34.1957, -118.4895], '91411': [34.1783, -118.4599],
  // Sun Valley / Pacoima / Sylmar / Sunland / Tujunga
  '91352': [34.2295, -118.3661], '91331': [34.2556, -118.4219], '91342': [34.3054, -118.4527],
  '91040': [34.2611, -118.3337], '91042': [34.2516, -118.2846],
  // Encino / Northridge / Reseda / Granada Hills / Chatsworth
  '91316': [34.1594, -118.5049], '91436': [34.1514, -118.4884], '91324': [34.2394, -118.5501],
  '91325': [34.2357, -118.5181], '91330': [34.2448, -118.5287], '91335': [34.2008, -118.5418],
  '91344': [34.2770, -118.5022], '91311': [34.2944, -118.6047],
  // Hollywood / Los Feliz / Silver Lake / Echo Park / West Hollywood / Eagle Rock / Highland Park
  '90028': [34.0998, -118.3266], '90038': [34.0889, -118.3394], '90046': [34.1078, -118.3622],
  '90068': [34.1376, -118.3277], '90027': [34.1044, -118.2926], '90039': [34.1112, -118.2595],
  '90026': [34.0797, -118.2638], '90069': [34.0901, -118.3813], '90041': [34.1376, -118.2077],
  '90042': [34.1149, -118.1923], '90065': [34.1073, -118.2266], '90004': [34.0763, -118.3089],
  // Downtown LA / Santa Monica (outside typical radius — handy for testing)
  '90012': [34.0614, -118.2385], '90401': [34.0158, -118.4922],
};

const toRad = (d: number) => (d * Math.PI) / 180;

export const milesBetween = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) => {
  const R = 3958.8;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

export interface ServiceAreaResult {
  status: 'inside' | 'outside' | 'unknown';
  miles?: number;
  coords?: { latitude: number; longitude: number };
}

export async function locateAddress(address: Address): Promise<{ latitude: number; longitude: number } | null> {
  if (address.latitude != null && address.longitude != null) {
    return { latitude: address.latitude, longitude: address.longitude };
  }
  if (Platform.OS !== 'web') {
    try {
      const results = await Location.geocodeAsync(`${address.line1}, ${address.city}, ${address.state} ${address.zip}`);
      if (results[0]) return { latitude: results[0].latitude, longitude: results[0].longitude };
    } catch {
      // geocoder unavailable (no Play Services, offline…) → fall through to ZIP lookup
    }
  }
  const zip = ZIP_CENTROIDS[address.zip.trim().slice(0, 5)];
  return zip ? { latitude: zip[0], longitude: zip[1] } : null;
}

export async function checkServiceArea(address: Address, radiusMiles: number): Promise<ServiceAreaResult> {
  const coords = await locateAddress(address);
  if (!coords) return { status: 'unknown' };
  const miles = milesBetween(STORE_ORIGIN, coords);
  return { status: miles <= radiusMiles ? 'inside' : 'outside', miles, coords };
}

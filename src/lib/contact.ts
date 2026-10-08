import { Linking, Platform } from 'react-native';
import { Alert } from './dialog';
import { digitsOnly } from './format';
import type { StoreLocation } from '@/types';

const open = async (url: string, fallback?: string) => {
  try {
    await Linking.openURL(url);
  } catch {
    if (fallback) await Linking.openURL(fallback).catch(() => {});
    else Alert.alert('Unable to open', url);
  }
};

export const callBusiness = (phone: string) => open(`tel:${digitsOnly(phone)}`);

/** The business's phone numbers, main line first. */
export const businessPhones = (s: { phone: string; altPhone?: string }) => [s.phone, s.altPhone ?? ''].map((p) => p.trim()).filter(Boolean);

/** "Call" buttons: dial directly with one number, or let the customer pick when there are two. */
export const callUs = (s: { phone: string; altPhone?: string }) => {
  const phones = businessPhones(s);
  if (phones.length <= 1) return callBusiness(phones[0] ?? s.phone);
  Alert.alert("Call Suzy's Cleaners", undefined, [
    ...phones.map((p) => ({ text: p, onPress: () => callBusiness(p) })),
    { text: 'Cancel', style: 'cancel' as const },
  ]);
};

export const emailBusiness = (email: string, subject = "Question for Suzy's Cleaners") =>
  open(`mailto:${email}?subject=${encodeURIComponent(subject)}`);

export const openDirections = (loc: StoreLocation) => {
  const q = encodeURIComponent(`${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`);
  const google = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  if (Platform.OS === 'ios') return open(`http://maps.apple.com/?daddr=${q}`, google);
  if (Platform.OS === 'android') return open(`geo:${loc.latitude},${loc.longitude}?q=${q}`, google);
  return open(google);
};

export const openWebsite = (url: string) => open(url);

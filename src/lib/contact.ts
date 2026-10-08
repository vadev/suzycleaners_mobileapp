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

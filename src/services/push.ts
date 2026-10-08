import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { env } from '@/config/env';
import { colors } from '@/theme';

/**
 * Push notifications.
 *
 * - `registerForPushAsync` asks permission and returns this device's Expo push
 *   token, which is saved on the customer's profile.
 * - `sendPush` delivers through Expo's push service. In the demo the admin
 *   device calls it directly; in production move this call to your backend
 *   (Edge Function / Cloud Function) triggered by the order-status update.
 * - `presentLocal` shows an immediate on-device notification.
 */

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

export function configureNotifications() {
  if (!isNative) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('orders', {
      name: 'Order updates',
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: colors.gold,
      vibrationPattern: [0, 200, 120, 200],
    }).catch(() => {});
  }
}

export async function requestPermission(): Promise<boolean> {
  if (!isNative) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const next = await Notifications.requestPermissionsAsync();
  return next.granted;
}

export async function registerForPushAsync(): Promise<string | null> {
  if (!isNative || !Device.isDevice) return null;
  if (!(await requestPermission())) return null;
  try {
    // Requires an EAS project id (run `npx eas-cli init`) — returns null until configured.
    if (!env.easProjectId) return null;
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId: env.easProjectId });
    return data;
  } catch (e) {
    console.warn('[push] token registration failed', e);
    return null;
  }
}

export async function presentLocal(title: string, body: string, data?: Record<string, unknown>) {
  if (!isNative) return;
  try {
    const perm = await Notifications.getPermissionsAsync();
    if (!perm.granted) return;
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: data ?? {}, sound: true },
      trigger: Platform.OS === 'android' ? { channelId: 'orders' } : null,
    });
  } catch (e) {
    console.warn('[push] local notification failed', e);
  }
}

export async function sendPush(token: string, title: string, body: string, data?: Record<string, unknown>) {
  if (!env.clientSidePush || !token.startsWith('ExponentPushToken')) return false;
  try {
    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: token, title, body, data, sound: 'default', channelId: 'orders' }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

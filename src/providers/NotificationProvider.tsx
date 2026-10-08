import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Icon } from '@/components/ui';
import { backend } from '@/services/backend';
import { configureNotifications, presentLocal } from '@/services/push';
import { colors, fonts, radius, shadow, spacing } from '@/theme';
import { useAuth } from './AuthProvider';

interface Toast {
  id: number;
  title: string;
  body?: string;
  icon?: string;
  orderId?: string;
}

const ToastContext = createContext<{ show(t: Omit<Toast, 'id'>): void }>({ show: () => {} });
export const useToast = () => useContext(ToastContext);

configureNotifications();

/**
 * Delivers order updates to the signed-in customer:
 *  - an in-app banner as soon as the backend reports a new notification
 *  - a system notification (local, or the remote push sent by the backend)
 *  - tapping a notification opens the related order
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [toast, setToast] = useState<Toast | null>(null);
  const [anim] = useState(() => new Animated.Value(0));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seen = useRef<Set<string> | null>(null);
  const insets = useSafeAreaInsets();

  const show = useCallback(
    (t: Omit<Toast, 'id'>) => {
      setToast({ ...t, id: Date.now() });
      anim.setValue(0);
      Animated.spring(anim, { toValue: 1, useNativeDriver: Platform.OS !== 'web', friction: 8 }).start();
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start(() => setToast(null));
      }, 4200);
    },
    [anim],
  );

  // Watch the customer's notification feed.
  useEffect(() => {
    seen.current = null;
    if (!user || user.role !== 'customer') return;
    let active = true;
    const check = async () => {
      const list = await backend.notifications.listMine().catch(() => []);
      if (!active) return;
      if (!seen.current) {
        seen.current = new Set(list.map((n) => n.id));
        return;
      }
      const fresh = list.filter((n) => !seen.current!.has(n.id));
      fresh.forEach((n) => seen.current!.add(n.id));
      const newest = fresh[0];
      if (newest) {
        show({ title: newest.title, body: newest.body, icon: 'bell-ring-outline', orderId: newest.orderId });
        // Remote push covers devices with a token; otherwise raise a local system notification.
        if (!user.pushToken && user.notificationsEnabled) presentLocal(newest.title, newest.body, { orderId: newest.orderId });
      }
    };
    check();
    const unsub = backend.subscribe((topic) => topic === 'notifications' && check());
    return () => {
      active = false;
      unsub();
    };
  }, [user?.id, user?.role, user?.pushToken, user?.notificationsEnabled, show]); // eslint-disable-line react-hooks/exhaustive-deps

  // Open the order when a system notification is tapped.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const orderId = response.notification.request.content.data?.orderId;
      if (typeof orderId === 'string') router.push({ pathname: '/order/[id]', params: { id: orderId } });
    });
    return () => sub.remove();
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.toastWrap,
            { top: insets.top + 8 },
            { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }] },
          ]}
        >
          <Pressable
            accessibilityRole="alert"
            onPress={() => {
              if (toast.orderId && user?.role === 'customer') router.push({ pathname: '/order/[id]', params: { id: toast.orderId } });
              setToast(null);
            }}
            style={[styles.toast, shadow(3)]}
          >
            <View style={styles.toastIcon}>
              <Icon name={toast.icon ?? 'check-circle-outline'} size={20} color={colors.navy900} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={styles.toastTitle}>{toast.title}</AppText>
              {toast.body ? (
                <AppText style={styles.toastBody} numberOfLines={2}>
                  {toast.body}
                </AppText>
              ) : null}
            </View>
          </Pressable>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toastWrap: { position: 'absolute', left: spacing.md, right: spacing.md, zIndex: 100 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.navy900,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  toastIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.sunshine, alignItems: 'center', justifyContent: 'center' },
  toastTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
  toastBody: { fontFamily: fonts.regular, fontSize: 13.5, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});

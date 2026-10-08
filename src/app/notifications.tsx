import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, EmptyState, Icon, Screen, ScreenHeader } from '@/components/ui';
import { STATUS_META } from '@/config/orderStatus';
import { useMyNotifications } from '@/hooks/data';
import { relativeTime } from '@/lib/format';
import { backend } from '@/services/backend';
import { colors, spacing } from '@/theme';

export default function NotificationsInbox() {
  const { notifications, loading } = useMyNotifications();
  useFocusEffect(
    useCallback(() => {
      return () => {
        backend.notifications.markAllRead();
      };
    }, []),
  );
  return (
    <Screen>
      <ScreenHeader title="Notifications" subtitle="Updates about your pickups and orders" />
      {!loading && notifications.length === 0 ? <EmptyState icon="bell-outline" title="You're all caught up" /> : null}
      <View style={{ gap: spacing.sm }}>
        {notifications.map((n) => (
          <Card
            key={n.id}
            onPress={n.orderId ? () => router.push({ pathname: '/order/[id]', params: { id: n.orderId! } }) : undefined}
            style={[styles.row, !n.read && { borderColor: colors.gold, borderWidth: 1 }]}
          >
            <View style={styles.icon}>
              <Icon name={n.status ? STATUS_META[n.status].icon : 'message-text-outline'} size={20} color={colors.navy900} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <AppText variant="bodyStrong" style={{ flex: 1 }}>
                  {n.title}
                </AppText>
                <AppText variant="small">{relativeTime(n.createdAt)}</AppText>
              </View>
              <AppText variant="small" style={{ color: colors.text }}>
                {n.body}
              </AppText>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', padding: spacing.md },
  icon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.sunshineSoft, alignItems: 'center', justifyContent: 'center' },
});

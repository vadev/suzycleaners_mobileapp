import { router } from 'expo-router';
import { View } from 'react-native';
import { AuthGate } from '@/components/AuthGate';
import { OrderCard } from '@/components/orders/OrderCard';
import { AppText, Button, EmptyState, Screen, SectionHeader } from '@/components/ui';
import { isOpenStatus } from '@/config/orderStatus';
import { useMyOrders } from '@/hooks/data';
import { colors, spacing } from '@/theme';

export default function Orders() {
  const { orders, loading, refresh } = useMyOrders();
  const current = orders.filter((o) => isOpenStatus(o.status));
  const past = orders.filter((o) => !isOpenStatus(o.status));

  return (
    <Screen tabBarSpace refreshing={false} onRefresh={refresh}>
      <View style={{ marginTop: spacing.md, gap: 4 }}>
        <AppText variant="caption" style={{ color: colors.gold }}>
          Track every garment
        </AppText>
        <AppText variant="h1">Your Orders</AppText>
      </View>
      <AuthGate title="Track your orders" body="Sign in to see live status updates from pickup to delivery.">
        {!loading && orders.length === 0 ? (
          <EmptyState
            icon="hanger"
            title="No orders yet"
            body="Schedule your first pickup and we'll take it from there."
            action="Schedule a Pickup"
            onAction={() => router.push('/schedule')}
          />
        ) : null}
        {current.length ? <SectionHeader title="Current" /> : null}
        <View style={{ gap: spacing.sm }}>
          {current.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </View>
        {past.length ? <SectionHeader title="Previous" /> : null}
        <View style={{ gap: spacing.sm }}>
          {past.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </View>
        {orders.length ? (
          <Button title="Schedule Another Pickup" icon="calendar-plus" variant="outline" onPress={() => router.push('/schedule')} style={{ marginTop: spacing.xl }} />
        ) : null}
      </AuthGate>
    </Screen>
  );
}

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatThread, Composer } from '@/components/chat/Chat';
import { AppText, Chip, IconButton } from '@/components/ui';
import { useAdminCustomer, useAdminMessages, useAdminOrders } from '@/hooks/data';
import { callBusiness } from '@/lib/contact';
import { backend } from '@/services/backend';
import { colors, spacing } from '@/theme';

const QUICK_REPLIES = [
  'Thank you! We’re on it.',
  'Our driver will arrive within your pickup window.',
  'Your order is ready — would you like delivery or in-store pickup?',
  'Small alterations start at $20. We’ll confirm after a fitting.',
];

export default function AdminChat() {
  const { id, orderId } = useLocalSearchParams<{ id: string; orderId?: string }>();
  const insets = useSafeAreaInsets();
  const { data: customer } = useAdminCustomer(id);
  const { messages } = useAdminMessages(id);
  const { orders } = useAdminOrders();
  const order = orders.find((o) => o.id === orderId);
  const unread = messages.some((m) => !m.readByAdmin);

  useEffect(() => {
    if (id && unread) backend.admin.markConversationRead(id);
  }, [id, unread]);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.cream }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <IconButton icon="chevron-left" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/admin/messages'))} />
        <View style={{ flex: 1 }}>
          <AppText variant="h3" numberOfLines={1}>
            {customer?.name ?? 'Customer'}
          </AppText>
          <AppText variant="small">{order ? `About order #${order.number}` : customer?.phone}</AppText>
        </View>
        <IconButton icon="account-outline" label="Customer profile" onPress={() => router.push({ pathname: '/admin/customer/[id]', params: { id } })} />
        {customer ? <IconButton icon="phone-outline" label="Call customer" onPress={() => callBusiness(customer.phone)} /> : null}
      </View>
      <ChatThread messages={messages} me="admin" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quick} style={{ flexGrow: 0 }}>
        {QUICK_REPLIES.map((r) => (
          <Chip key={r} label={r} onPress={() => backend.admin.sendMessage(id, r, orderId)} style={{ height: 36, maxWidth: 280 }} />
        ))}
      </ScrollView>
      <View style={{ paddingBottom: insets.bottom }}>
        <Composer placeholder={`Message ${customer?.name.split(' ')[0] ?? 'customer'}…`} onSend={(text) => backend.admin.sendMessage(id, text, orderId)} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.ivory,
  },
  quick: { gap: 8, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
});

import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthGate } from '@/components/AuthGate';
import { ChatThread, Composer } from '@/components/chat/Chat';
import { AppText, Chip, IconButton, Screen } from '@/components/ui';
import { TAB_BAR_HEIGHT } from '@/components/TabBar';
import { useMyMessages, useMyOrders, useSettings } from '@/hooks/data';
import { callUs } from '@/lib/contact';
import { backend } from '@/services/backend';
import { colors, spacing } from '@/theme';
import type { MessageTopic } from '@/types';

const TOPICS: { key: MessageTopic; label: string; icon: string; starter: string }[] = [
  { key: 'order', label: 'My order', icon: 'file-document-outline', starter: 'Hi! I have a question about my order.' },
  { key: 'pickup', label: 'Pickup', icon: 'calendar-clock', starter: 'Hi! I have a question about my pickup.' },
  { key: 'delivery', label: 'Delivery', icon: 'truck-delivery-outline', starter: 'Hi! I have a question about my delivery.' },
  { key: 'tailoring', label: 'Tailoring', icon: 'content-cut', starter: 'Hi! I have a tailoring question.' },
  { key: 'shoes', label: 'Shoe cleaning', icon: 'shoe-sneaker', starter: 'Hi! I have a question about shoe cleaning.' },
];

export default function Messages() {
  return (
    <Screen scroll={false} padded={false}>
      <AuthGateWrap />
    </Screen>
  );
}

function AuthGateWrap() {
  const { settings } = useSettings();
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" style={{ color: colors.gold }}>
            Concierge chat
          </AppText>
          <AppText variant="h1">Messages</AppText>
        </View>
        <IconButton icon="phone-outline" label="Call Suzy's Cleaners" onPress={() => callUs(settings)} />
      </View>
      <View style={{ flex: 1, paddingHorizontal: spacing.md }}>
        <AuthGate title="Chat with our team" body="Sign in to ask about your order, pickup, delivery, tailoring or shoe care.">
          <Conversation />
        </AuthGate>
      </View>
    </View>
  );
}

function Conversation() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const insets = useSafeAreaInsets();
  const { messages } = useMyMessages();
  const { orders } = useMyOrders();
  const [topic, setTopic] = useState<MessageTopic | undefined>(params.orderId ? 'order' : undefined);
  const order = orders.find((o) => o.id === params.orderId);

  useFocusEffect(
    useCallback(() => {
      backend.messages.markReadByCustomer();
    }, []),
  );
  // Also mark read when new replies arrive while the chat is open.
  const unread = messages.some((m) => !m.readByCustomer);
  useEffect(() => {
    if (unread) backend.messages.markReadByCustomer();
  }, [unread]);

  const intro = (
    <View style={{ gap: spacing.sm, marginBottom: spacing.sm }}>
      {order ? (
        <View style={styles.context}>
          <AppText variant="smallStrong" style={{ color: colors.navy }}>
            About Order #{order.number}
          </AppText>
        </View>
      ) : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {TOPICS.map((t) => (
          <Chip key={t.key} label={t.label} icon={t.icon} selected={topic === t.key} onPress={() => setTopic(topic === t.key ? undefined : t.key)} style={{ height: 38 }} />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, marginHorizontal: -spacing.md }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ChatThread messages={messages} me="customer" header={intro} />
      <View style={{ paddingBottom: TAB_BAR_HEIGHT + Math.max(insets.bottom, 12) + 6 }}>
        <Composer
          placeholder={topic ? TOPICS.find((t) => t.key === topic)!.starter : 'Ask us anything…'}
          onSend={(text) => backend.messages.send(text, { orderId: order?.id ?? (topic === 'order' ? orders[0]?.id : undefined), topic })}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm, gap: spacing.sm },
  context: { alignSelf: 'flex-start', backgroundColor: colors.sky, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
});

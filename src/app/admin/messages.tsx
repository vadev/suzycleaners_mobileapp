import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Avatar, Card, EmptyState, Screen, ScreenHeader, TextField } from '@/components/ui';
import { useAdminConversations } from '@/hooks/data';
import { relativeTime } from '@/lib/format';
import { colors, fonts, spacing } from '@/theme';

export default function AdminInbox() {
  const { conversations, loading } = useAdminConversations();
  const [q, setQ] = useState('');
  const list = useMemo(
    () => conversations.filter((c) => !q.trim() || c.customerName.toLowerCase().includes(q.trim().toLowerCase())),
    [conversations, q],
  );
  return (
    <Screen>
      <ScreenHeader title="Messages" subtitle={`${conversations.reduce((s, c) => s + c.unread, 0)} unread`} />
      <TextField icon="magnify" placeholder="Search conversations" value={q} onChangeText={setQ} />
      <View style={{ gap: 10, marginTop: spacing.md }}>
        {!loading && list.length === 0 ? <EmptyState icon="message-outline" title="No conversations yet" /> : null}
        {list.map((c) => (
          <Card key={c.customerId} onPress={() => router.push({ pathname: '/admin/chat/[id]', params: { id: c.customerId } })} style={styles.row} accessibilityLabel={`${c.customerName}, ${c.unread} unread`}>
            <Avatar name={c.customerName} />
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <AppText style={[styles.name, c.unread > 0 && { color: colors.navy900 }]} numberOfLines={1}>
                  {c.customerName}
                </AppText>
                <AppText variant="small">{relativeTime(c.lastMessage.createdAt)}</AppText>
              </View>
              <AppText variant="small" numberOfLines={2} style={c.unread > 0 ? { color: colors.text, fontFamily: fonts.medium } : undefined}>
                {c.lastMessage.sender === 'admin' ? 'You: ' : ''}
                {c.lastMessage.body}
              </AppText>
            </View>
            {c.unread ? (
              <View style={styles.unread}>
                <AppText style={styles.unreadText}>{c.unread}</AppText>
              </View>
            ) : null}
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  name: { flex: 1, fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  unread: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  unreadText: { color: colors.white, fontFamily: fonts.bold, fontSize: 12 },
});

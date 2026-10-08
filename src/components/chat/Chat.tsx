import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppText, Icon } from '@/components/ui';
import { formatDateTime, formatTime } from '@/lib/format';
import { colors, fonts, radius, spacing } from '@/theme';
import type { Message, MessageSender } from '@/types';

/** `me` decides which side a bubble sits on: customers see their own on the right, staff see theirs on the right. */
export function ChatThread({ messages, me, header, bottomInset = 0 }: { messages: Message[]; me: MessageSender; header?: React.ReactNode; bottomInset?: number }) {
  const ref = useRef<ScrollView>(null);
  let lastDay = '';
  return (
    <ScrollView
      ref={ref}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.md + bottomInset, gap: 6 }}
      onContentSizeChange={() => ref.current?.scrollToEnd({ animated: false })}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {header}
      {messages.map((m) => {
        const day = formatDateTime(m.createdAt).split(' · ')[0]!;
        const showDay = day !== lastDay;
        lastDay = day;
        const mine = m.sender === me;
        const system = m.sender === 'system';
        return (
          <View key={m.id}>
            {showDay ? <AppText style={styles.day}>{day}</AppText> : null}
            {system ? (
              <View style={styles.system}>
                <Icon name="star-four-points" size={14} color={colors.gold} />
                <AppText variant="small" style={{ flex: 1, color: colors.navy700 }}>
                  {m.body}
                </AppText>
              </View>
            ) : (
              <View style={[styles.bubbleRow, mine ? { justifyContent: 'flex-end' } : null]}>
                <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                  {!mine ? <AppText style={styles.sender}>{m.senderName}</AppText> : null}
                  <AppText style={[styles.body, mine && { color: colors.white }]}>{m.body}</AppText>
                  <AppText style={[styles.time, mine && { color: 'rgba(255,255,255,0.7)' }]}>{formatTime(m.createdAt)}</AppText>
                </View>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

export function Composer({ onSend, placeholder = 'Write a message…' }: { onSend: (text: string) => Promise<unknown>; placeholder?: string }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const send = async () => {
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    try {
      await onSend(t);
      setText('');
    } finally {
      setSending(false);
    }
  };
  return (
    <View style={styles.composer}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.faint}
        multiline
        maxLength={2000}
        style={styles.input}
        accessibilityLabel="Message"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Send message"
        onPress={send}
        disabled={!text.trim() || sending}
        style={[styles.send, (!text.trim() || sending) && { opacity: 0.45 }]}
      >
        {sending ? <ActivityIndicator color={colors.white} /> : <Icon name="send" size={20} color={colors.white} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  day: { textAlign: 'center', fontFamily: fonts.medium, fontSize: 11.5, color: colors.faint, marginVertical: spacing.sm, letterSpacing: 0.6 },
  system: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    backgroundColor: colors.goldSoft,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginVertical: 4,
  },
  bubbleRow: { flexDirection: 'row' },
  bubble: { maxWidth: '82%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, gap: 2 },
  mine: { backgroundColor: colors.navy, borderBottomRightRadius: 6 },
  theirs: { backgroundColor: colors.white, borderBottomLeftRadius: 6, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  sender: { fontFamily: fonts.semibold, fontSize: 12, color: colors.gold },
  body: { fontFamily: fonts.regular, fontSize: 15.5, lineHeight: 21, color: colors.ink },
  time: { fontFamily: fonts.regular, fontSize: 11, color: colors.faint, alignSelf: 'flex-end' },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.ivory,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    backgroundColor: colors.white,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontFamily: fonts.regular,
    fontSize: 15.5,
    color: colors.ink,
  },
  send: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
});

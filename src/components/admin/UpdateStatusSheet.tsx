import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Alert } from '@/lib/dialog';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Button, Icon, IconButton, TextField, Toggle } from '@/components/ui';
import { STATUS_META } from '@/config/orderStatus';
import { useSettings } from '@/hooks/data';
import { useToast } from '@/providers/NotificationProvider';
import { backend } from '@/services/backend';
import { colors, fonts, radius, spacing } from '@/theme';
import { ORDER_STATUSES, type Order, type OrderStatus } from '@/types';
import { toneColors } from '@/components/orders/StatusBadge';

/** Change an order's status and push the update to the customer. */
export function UpdateStatusSheet({ order, visible, onClose }: { order: Order | null; visible: boolean; onClose(): void }) {
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const toast = useToast();
  const [status, setStatus] = useState<OrderStatus>('request_received');
  const [notify, setNotify] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [total, setTotal] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!order || !visible) return;
    const idx = ORDER_STATUSES.indexOf(order.status);
    const next: OrderStatus =
      order.status === 'completed' || order.status === 'cancelled'
        ? order.status
        : order.status === 'ready_for_pickup' || order.status === 'out_for_delivery'
          ? 'completed'
          : ORDER_STATUSES[idx + 1]!;
    setStatus(next);
    setNotify(true);
    setTotal(order.finalTotal != null ? String(order.finalTotal) : '');
  }, [order, visible]);

  useEffect(() => {
    const tpl = settings.notificationTemplates[status];
    setTitle(tpl.title);
    setBody(tpl.body);
  }, [status, settings.notificationTemplates]);

  if (!order) return null;

  const submit = async () => {
    const parsed = total.trim() ? Number(total.replace(/[$,]/g, '')) : null;
    if (parsed !== null && (Number.isNaN(parsed) || parsed < 0)) return Alert.alert('Final total must be a number.');
    setBusy(true);
    try {
      await backend.admin.updateOrder(
        order.id,
        { status, finalTotal: parsed === null ? (order.finalTotal ?? null) : parsed },
        notify ? { title: title.trim() || STATUS_META[status].label, body: body.trim() || settings.notificationTemplates[status].body } : null,
      );
      toast.show({
        title: notify ? `${order.customerName.split(' ')[0]} notified` : 'Order updated',
        body: `Order #${order.number} → ${STATUS_META[status].label}`,
        icon: notify ? 'bell-check-outline' : 'check-circle-outline',
      });
      onClose();
    } catch (e) {
      Alert.alert('Update failed', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.wrap}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.grabber} />
            <View style={styles.head}>
              <View style={{ flex: 1 }}>
                <AppText variant="caption">
                  Order #{order.number} · {order.customerName}
                </AppText>
                <AppText variant="h2">Update & Notify</AppText>
              </View>
              <IconButton icon="close" label="Close" onPress={onClose} />
            </View>
            <ScrollView style={{ flexShrink: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.sm }}>
              <View style={styles.grid}>
                {ORDER_STATUSES.map((s) => {
                  const meta = STATUS_META[s];
                  const on = s === status;
                  const c = toneColors[meta.tone];
                  return (
                    <Pressable
                      key={s}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: on }}
                      onPress={() => setStatus(s)}
                      style={[styles.status, on && { backgroundColor: c.bg, borderColor: c.fg }]}
                    >
                      <Icon name={meta.icon} size={18} color={on ? c.fg : colors.muted} />
                      <AppText style={[styles.statusText, on && { color: c.fg, fontFamily: fonts.semibold }]} numberOfLines={1}>
                        {meta.label}
                      </AppText>
                      {s === order.status ? <View style={styles.current} accessibilityLabel="current status" /> : null}
                    </Pressable>
                  );
                })}
              </View>

              <TextField label="Final total (optional)" icon="currency-usd" value={total} onChangeText={setTotal} keyboardType="decimal-pad" placeholder={`Estimate $${order.estimatedTotal}`} />

              <View style={styles.notifyRow}>
                <Icon name="bell-ring-outline" />
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyStrong">Notify customer</AppText>
                  <AppText variant="small">Push notification + message in their inbox</AppText>
                </View>
                <Toggle value={notify} onValueChange={setNotify} />
              </View>
              {notify ? (
                <View style={{ gap: spacing.sm }}>
                  <TextField label="Notification title" value={title} onChangeText={setTitle} maxLength={60} />
                  <TextField label="Message" value={body} onChangeText={setBody} multiline maxLength={300} counter={300} />
                </View>
              ) : null}
            </ScrollView>
            <Button title={notify ? 'Update & Notify Customer' : 'Update Order'} icon={notify ? 'bullhorn-outline' : 'content-save-outline'} onPress={submit} loading={busy} />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  wrap: { maxHeight: '92%' },
  sheet: { flexShrink: 1, backgroundColor: colors.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: spacing.md, paddingTop: spacing.xs },
  grabber: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.sand, marginBottom: spacing.sm },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  status: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.hairline,
  },
  statusText: { flex: 1, fontFamily: fonts.medium, fontSize: 12.5, color: colors.text },
  current: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold },
  notifyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.white, padding: spacing.md, borderRadius: radius.lg },
});

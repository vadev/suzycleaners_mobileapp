import { View } from 'react-native';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { Button, Card, Screen, ScreenHeader, TextField } from '@/components/ui';
import { DEFAULT_NOTIFICATION_TEMPLATES } from '@/config/orderStatus';
import { useSettingsDraft } from '@/hooks/useSettingsDraft';
import { spacing } from '@/theme';
import { ORDER_STATUSES, type OrderStatus } from '@/types';

export default function NotificationTemplates() {
  const { draft, setDraft, save, saving } = useSettingsDraft();
  const patch = (s: OrderStatus, p: Partial<{ title: string; body: string }>) =>
    setDraft({ ...draft, notificationTemplates: { ...draft.notificationTemplates, [s]: { ...draft.notificationTemplates[s], ...p } } });

  return (
    <Screen>
      <ScreenHeader title="Notification messages" subtitle="Pre-filled when you press “Update & Notify Customer”. You can still edit each one before sending." />
      <View style={{ gap: spacing.md }}>
        {ORDER_STATUSES.map((s) => (
          <Card key={s} style={{ gap: spacing.sm }}>
            <StatusBadge status={s} />
            <TextField label="Title" value={draft.notificationTemplates[s]?.title ?? ''} onChangeText={(title) => patch(s, { title })} maxLength={60} />
            <TextField label="Message" value={draft.notificationTemplates[s]?.body ?? ''} onChangeText={(body) => patch(s, { body })} multiline maxLength={300} />
          </Card>
        ))}
        <Button title="Restore defaults" variant="ghost" size="sm" onPress={() => setDraft({ ...draft, notificationTemplates: DEFAULT_NOTIFICATION_TEMPLATES })} />
        <Button title="Save Messages" variant="dark" onPress={() => save()} loading={saving} />
      </View>
    </Screen>
  );
}

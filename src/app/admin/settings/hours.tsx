import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Divider, Screen, ScreenHeader, TextField, Toggle } from '@/components/ui';
import { useSettingsDraft } from '@/hooks/useSettingsDraft';
import { colors, spacing } from '@/theme';
import type { BusinessHours } from '@/types';

export default function Hours() {
  const { draft, setDraft, save, saving } = useSettingsDraft();
  const patch = (day: BusinessHours['day'], p: Partial<BusinessHours>) =>
    setDraft({ ...draft, hours: draft.hours.map((h) => (h.day === day ? { ...h, ...p } : h)) });

  return (
    <Screen>
      <ScreenHeader title="Business hours" subtitle="Closed days are hidden from pickup scheduling." />
      <Card>
        {draft.hours.map((h, i) => (
          <View key={h.day}>
            {i > 0 ? <Divider style={{ marginVertical: spacing.sm }} /> : null}
            <View style={styles.row}>
              <AppText variant="h3" style={{ width: 48 }}>
                {h.day}
              </AppText>
              {h.closed ? (
                <AppText variant="body" style={{ flex: 1, color: colors.muted }}>
                  Closed
                </AppText>
              ) : (
                <View style={styles.times}>
                  <View style={{ flex: 1 }}>
                    <TextField value={h.open} onChangeText={(open) => patch(h.day, { open })} placeholder="7:00 AM" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextField value={h.close} onChangeText={(close) => patch(h.day, { close })} placeholder="7:00 PM" />
                  </View>
                </View>
              )}
              <Toggle
                value={!h.closed}
                onValueChange={(v) => patch(h.day, { closed: !v, open: h.open || '8:00 AM', close: h.close || '6:00 PM' })}
                accessibilityLabel={`${h.day} open`}
              />
            </View>
          </View>
        ))}
      </Card>
      <Button title="Save Hours" variant="dark" onPress={() => save()} loading={saving} style={{ marginTop: spacing.lg }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  times: { flex: 1, flexDirection: 'row', gap: 8 },
});

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Alert } from '@/lib/dialog';
import { AppText, Button, Card, Icon, Screen, ScreenHeader, TextField, Toggle } from '@/components/ui';
import { useServices } from '@/hooks/data';
import { backend } from '@/services/backend';
import { spacing } from '@/theme';
import type { ServiceItem } from '@/types';

export default function ManageServices() {
  const { allServices, loading } = useServices();
  const [draft, setDraft] = useState<ServiceItem[]>(allServices);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!loading) setDraft(allServices);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const patch = (id: string, p: Partial<ServiceItem>) => setDraft((d) => d.map((s) => (s.id === id ? { ...s, ...p } : s)));

  const save = async () => {
    if (draft.some((s) => !s.name.trim())) return Alert.alert('Every service needs a name.');
    setSaving(true);
    try {
      await backend.admin.saveServices(draft);
      router.back();
    } catch (e) {
      Alert.alert('Could not save', (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Services & pricing" subtitle="Prices are used for customer estimates." />
      <View style={{ gap: spacing.md }}>
        {draft.map((s) => (
          <Card key={s.id} style={{ gap: spacing.sm }}>
            <View style={styles.head}>
              <Icon name={s.icon} />
              <AppText variant="h3" style={{ flex: 1 }}>
                {s.name || 'Untitled'}
              </AppText>
              <AppText variant="small">{s.active ? 'Visible' : 'Hidden'}</AppText>
              <Toggle value={s.active} onValueChange={(active) => patch(s.id, { active })} />
            </View>
            <TextField label="Name" value={s.name} onChangeText={(name) => patch(s.id, { name })} />
            <TextField label="Tagline" value={s.tagline} onChangeText={(tagline) => patch(s.id, { tagline })} />
            <TextField label="Description" value={s.description} onChangeText={(description) => patch(s.id, { description })} multiline />
            <TextField
              label="Highlights (one per line)"
              value={s.highlights.join('\n')}
              onChangeText={(t) => patch(s.id, { highlights: t.split('\n').filter((x, i, a) => x.trim() || i === a.length - 1) })}
              multiline
            />
            {s.bookable ? (
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <TextField label="Price ($)" value={String(s.price)} onChangeText={(t) => patch(s.id, { price: Number(t.replace(/[^\d.]/g, '')) || 0 })} keyboardType="decimal-pad" />
                </View>
                <View style={{ flex: 1.4 }}>
                  <TextField label="Unit" value={s.unitLabel} onChangeText={(unitLabel) => patch(s.id, { unitLabel })} />
                </View>
              </View>
            ) : (
              <AppText variant="small">Pickup & delivery pricing is controlled by the minimum order in Rules.</AppText>
            )}
          </Card>
        ))}
        <Button title="Save Services" variant="dark" onPress={save} loading={saving} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});

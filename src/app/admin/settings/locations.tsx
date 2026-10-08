import { Pressable, StyleSheet, View } from 'react-native';
import { Alert } from '@/lib/dialog';
import { AppText, Button, Card, Chip, Icon, Screen, ScreenHeader, TextField } from '@/components/ui';
import { useSettingsDraft } from '@/hooks/useSettingsDraft';
import { uid } from '@/lib/crypto';
import { colors, spacing } from '@/theme';
import type { StoreLocation } from '@/types';

export default function Locations() {
  const { draft, setDraft, save, saving } = useSettingsDraft();
  const patch = (id: string, p: Partial<StoreLocation>) => setDraft({ ...draft, locations: draft.locations.map((l) => (l.id === id ? { ...l, ...p } : l)) });
  const remove = (id: string) =>
    Alert.alert('Remove location?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setDraft({ ...draft, locations: draft.locations.filter((l) => l.id !== id) }) },
    ]);
  const add = () =>
    setDraft({
      ...draft,
      locations: [
        ...draft.locations,
        { id: `loc-${uid()}`, name: 'New location', address: '', city: '', state: 'CA', zip: '', phone: '', latitude: 0, longitude: 0, status: 'coming_soon' },
      ],
    });

  return (
    <Screen>
      <ScreenHeader title="Locations" subtitle="“Coming soon” locations appear on the home screen." />
      <View style={{ gap: spacing.md }}>
        {draft.locations.map((l) => (
          <Card key={l.id} style={{ gap: spacing.sm }}>
            <View style={styles.head}>
              <Icon name={l.status === 'open' ? 'store-check-outline' : 'store-clock-outline'} />
              <AppText variant="h3" style={{ flex: 1 }}>
                {l.name || 'Untitled'}
              </AppText>
              <Pressable onPress={() => remove(l.id)} hitSlop={10} accessibilityLabel={`Remove ${l.name}`}>
                <Icon name="trash-can-outline" size={20} color={colors.faint} />
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Chip label="Open" selected={l.status === 'open'} onPress={() => patch(l.id, { status: 'open' })} style={{ flex: 1, height: 40 }} />
              <Chip label="Coming soon" selected={l.status === 'coming_soon'} onPress={() => patch(l.id, { status: 'coming_soon' })} style={{ flex: 1, height: 40 }} />
            </View>
            <TextField label="Name" value={l.name} onChangeText={(name) => patch(l.id, { name })} />
            <TextField label="Street address" value={l.address} onChangeText={(address) => patch(l.id, { address })} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1.4 }}>
                <TextField label="City" value={l.city} onChangeText={(city) => patch(l.id, { city })} />
              </View>
              <View style={{ flex: 1 }}>
                <TextField label="ZIP" value={l.zip} onChangeText={(zip) => patch(l.id, { zip })} keyboardType="number-pad" />
              </View>
            </View>
            <TextField label="Phone" value={l.phone} onChangeText={(phone) => patch(l.id, { phone })} keyboardType="phone-pad" />
          </Card>
        ))}
        <Button title="Add Location" icon="plus" variant="outline" size="md" onPress={add} />
        <Button title="Save Locations" variant="dark" onPress={() => save()} loading={saving} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});

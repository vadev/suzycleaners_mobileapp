import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Alert } from '@/lib/dialog';
import { AddressSheet } from '@/components/AddressSheet';
import { AppText, Button, Card, Divider, Icon, Screen, ScreenHeader, SectionHeader, TextField } from '@/components/ui';
import { formatPhone, fullAddress } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { colors, spacing } from '@/theme';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  if (!user) return null;

  const save = async () => {
    if (!name.trim()) return Alert.alert('Please enter your name.');
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), phone: formatPhone(phone) });
      Alert.alert('Saved', 'Your profile has been updated.');
    } finally {
      setSaving(false);
    }
  };

  const remove = (id: string) =>
    Alert.alert('Remove address?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const addresses = user.addresses.filter((a) => a.id !== id);
          updateProfile({ addresses, defaultAddressId: user.defaultAddressId === id ? addresses[0]?.id : user.defaultAddressId });
        },
      },
    ]);

  return (
    <Screen>
      <ScreenHeader title="Profile" subtitle={user.email} />
      <View style={{ gap: spacing.sm }}>
        <TextField label="Full name" icon="account-outline" value={name} onChangeText={setName} autoComplete="name" />
        <TextField label="Mobile phone" icon="phone-outline" value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel" />
        <Button title="Save Changes" variant="dark" size="md" onPress={save} loading={saving} />
      </View>

      <SectionHeader title="Saved addresses" action="Add" onAction={() => setAdding(true)} />
      <Card padded={false} style={{ paddingHorizontal: spacing.md }}>
        {user.addresses.length === 0 ? (
          <AppText variant="body" style={{ paddingVertical: spacing.md, color: colors.muted }}>
            No saved addresses yet.
          </AppText>
        ) : null}
        {user.addresses.map((a, i) => (
          <View key={a.id}>
            {i > 0 ? <Divider /> : null}
            <View style={styles.addr}>
              <Pressable style={{ flex: 1 }} onPress={() => updateProfile({ defaultAddressId: a.id })} accessibilityRole="button" accessibilityLabel={`Make ${a.label} default`}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <AppText variant="bodyStrong">{a.label}</AppText>
                  {user.defaultAddressId === a.id ? (
                    <AppText variant="caption" style={{ color: colors.gold }}>
                      Default
                    </AppText>
                  ) : null}
                </View>
                <AppText variant="small">{fullAddress(a)}</AppText>
              </Pressable>
              <Pressable onPress={() => remove(a.id)} hitSlop={10} accessibilityLabel={`Remove ${a.label}`}>
                <Icon name="trash-can-outline" size={20} color={colors.faint} />
              </Pressable>
            </View>
          </View>
        ))}
      </Card>
      <AddressSheet
        visible={adding}
        title="New address"
        addresses={[]}
        onClose={() => setAdding(false)}
        onSelect={() => setAdding(false)}
        onCreate={async (a) => {
          await updateProfile({ addresses: [...user.addresses, a], defaultAddressId: user.defaultAddressId ?? a.id });
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  addr: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
});

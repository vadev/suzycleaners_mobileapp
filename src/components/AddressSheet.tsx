import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { uid } from '@/lib/crypto';
import { fullAddress } from '@/lib/format';
import { colors, radius, spacing } from '@/theme';
import type { Address } from '@/types';
import { AppText, Button, Chip, Icon, IconButton, TextField } from './ui';

interface Props {
  visible: boolean;
  title: string;
  addresses: Address[];
  selectedId?: string;
  onClose(): void;
  onSelect(address: Address): void;
  /** Persist a newly entered address to the customer's profile. */
  onCreate(address: Address): Promise<void>;
}

const LABELS = ['Home', 'Office', 'Other'];

export function AddressSheet({ visible, title, addresses, selectedId, onClose, onSelect, onCreate }: Props) {
  const insets = useSafeAreaInsets();
  const [adding, setAdding] = useState(addresses.length === 0);
  const [form, setForm] = useState({ label: 'Home', line1: '', line2: '', city: 'Burbank', state: 'CA', zip: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.line1.trim() || !form.city.trim() || !/^\d{5}$/.test(form.zip.trim())) {
      setError('Please enter a street address, city and 5-digit ZIP code.');
      return;
    }
    setSaving(true);
    const address: Address = { id: `adr-${uid()}`, ...form, line1: form.line1.trim(), line2: form.line2.trim() || undefined, zip: form.zip.trim() };
    try {
      await onCreate(address);
      onSelect(address);
      setAdding(false);
      setForm({ label: 'Home', line1: '', line2: '', city: 'Burbank', state: 'CA', zip: '' });
      setError('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrap}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.grabber} />
            <View style={styles.head}>
              <AppText variant="h2">{title}</AppText>
              <IconButton icon="close" label="Close" onPress={onClose} />
            </View>
            <ScrollView style={{ flexShrink: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: spacing.sm }}>
              {!adding &&
                addresses.map((a) => {
                  const on = a.id === selectedId;
                  return (
                    <Pressable
                      key={a.id}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: on }}
                      onPress={() => onSelect(a)}
                      style={[styles.option, on && styles.optionOn]}
                    >
                      <Icon name={a.label === 'Office' ? 'office-building-outline' : 'home-outline'} color={on ? colors.navy900 : colors.muted} />
                      <View style={{ flex: 1 }}>
                        <AppText variant="bodyStrong">{a.label}</AppText>
                        <AppText variant="small">{fullAddress(a)}</AppText>
                      </View>
                      <Icon name={on ? 'radiobox-marked' : 'radiobox-blank'} color={on ? colors.navy : colors.faint} />
                    </Pressable>
                  );
                })}
              {adding ? (
                <View style={{ gap: spacing.sm }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {LABELS.map((l) => (
                      <Chip key={l} label={l} selected={form.label === l} onPress={() => setForm({ ...form, label: l })} style={{ flex: 1, height: 40 }} />
                    ))}
                  </View>
                  <TextField label="Street address" icon="map-marker-outline" value={form.line1} onChangeText={(line1) => setForm({ ...form, line1 })} autoComplete="street-address" textContentType="streetAddressLine1" />
                  <TextField label="Apt, suite, gate code (optional)" value={form.line2} onChangeText={(line2) => setForm({ ...form, line2 })} />
                  <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                    <View style={{ flex: 1.4 }}>
                      <TextField label="City" value={form.city} onChangeText={(city) => setForm({ ...form, city })} textContentType="addressCity" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <TextField label="ZIP" value={form.zip} onChangeText={(zip) => setForm({ ...form, zip: zip.replace(/\D/g, '').slice(0, 5) })} keyboardType="number-pad" textContentType="postalCode" />
                    </View>
                  </View>
                  {error ? (
                    <AppText variant="small" style={{ color: colors.danger }}>
                      {error}
                    </AppText>
                  ) : null}
                  <Button title="Save Address" variant="dark" size="md" onPress={save} loading={saving} />
                  {addresses.length ? <Button title="Cancel" variant="ghost" size="sm" onPress={() => setAdding(false)} /> : null}
                </View>
              ) : (
                <Button title="Add a New Address" icon="plus" variant="outline" size="md" onPress={() => setAdding(true)} />
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheetWrap: { maxHeight: '88%' },
  sheet: { flexShrink: 1, backgroundColor: colors.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: spacing.md, paddingTop: spacing.xs },
  grabber: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.sand, marginBottom: spacing.sm },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionOn: { borderColor: colors.navy, borderWidth: 1.5, backgroundColor: colors.ivory },
});

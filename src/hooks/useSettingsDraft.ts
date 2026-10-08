import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from '@/lib/dialog';
import { backend } from '@/services/backend';
import type { BusinessSettings } from '@/types';
import { useSettings } from './data';

/** Editable copy of the business settings with a save action for admin screens. */
export function useSettingsDraft() {
  const { settings, loading } = useSettings();
  // `null` until the first edit, so the form shows the saved settings once they load.
  const [edited, setEdited] = useState<BusinessSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const draft = edited ?? settings;

  const save = async (next: BusinessSettings = draft) => {
    setSaving(true);
    try {
      await backend.admin.saveSettings(next);
      router.back();
    } catch (e) {
      Alert.alert('Could not save', (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return { draft, setDraft: setEdited as (s: BusinessSettings) => void, save, saving, loading };
}

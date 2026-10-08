import { useEffect, useState } from 'react';
import { Alert } from '@/lib/dialog';
import { router } from 'expo-router';
import { backend } from '@/services/backend';
import type { BusinessSettings } from '@/types';
import { useSettings } from './data';

/** Editable copy of the business settings with a save action for admin screens. */
export function useSettingsDraft() {
  const { settings, loading } = useSettings();
  const [draft, setDraft] = useState<BusinessSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) setDraft(settings);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

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

  return { draft, setDraft, save, saving, loading };
}

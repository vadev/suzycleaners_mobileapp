import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { AppText, Button, IconButton, TextField } from '@/components/ui';
import { formatPhone } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { colors, spacing } from '@/theme';

export default function SignUp() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setError('');
    if (form.phone.replace(/\D/g, '').length < 10) return setError('Please enter a 10-digit mobile number so our driver can reach you.');
    setBusy(true);
    try {
      await signUp({ ...form, phone: formatPhone(form.phone) });
      if (router.canGoBack()) router.back();
      else router.replace('/');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.cream }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingTop: spacing.lg, gap: spacing.md }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'flex-end' }}>
          <IconButton icon="close" label="Close" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
        </View>
        <View style={{ gap: 4 }}>
          <AppText variant="caption" style={{ color: colors.gold }}>
            Join Suzy’s
          </AppText>
          <AppText variant="hero">Create your account</AppText>
          <AppText variant="body" style={{ color: colors.muted }}>
            Book concierge pickups, track every order and chat with our team.
          </AppText>
        </View>
        <TextField label="Full name" icon="account-outline" value={form.name} onChangeText={set('name')} autoComplete="name" textContentType="name" />
        <TextField label="Email" icon="email-outline" value={form.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" autoComplete="email" textContentType="emailAddress" />
        <TextField label="Mobile phone" icon="phone-outline" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
        <TextField
          label="Password"
          icon="lock-outline"
          value={form.password}
          onChangeText={set('password')}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          hint="At least 8 characters"
          error={error}
        />
        <Button title="Create Account" variant="dark" onPress={submit} loading={busy} disabled={!form.name || !form.email || !form.password} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
          <AppText variant="body">Already have an account?</AppText>
          <Link href="/auth/sign-in" replace>
            <AppText variant="bodyStrong" style={{ color: colors.royal }}>
              Sign in
            </AppText>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

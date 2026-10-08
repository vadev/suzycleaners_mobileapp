import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { AppText, Button, IconButton, TextField } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { colors, spacing } from '@/theme';

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError('');
    setBusy(true);
    try {
      await signIn(email, password);
      router.canGoBack() ? router.back() : router.replace('/');
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
        <BrandLogo width={210} />
        <View style={{ gap: 4 }}>
          <AppText variant="h1" style={{ textAlign: 'center' }}>
            Welcome back
          </AppText>
          <AppText variant="body" style={{ textAlign: 'center', color: colors.muted }}>
            Sign in to book pickups and track your orders.
          </AppText>
        </View>
        <TextField label="Email" icon="email-outline" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" textContentType="emailAddress" />
        <TextField label="Password" icon="lock-outline" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" textContentType="password" onSubmitEditing={submit} error={error} />
        <Button title="Sign In" variant="dark" onPress={submit} loading={busy} disabled={!email || !password} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
          <AppText variant="body">New to Suzy's?</AppText>
          <Link href="/auth/sign-up" replace>
            <AppText variant="bodyStrong" style={{ color: colors.royal }}>
              Create an account
            </AppText>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { AppText, Button, Icon, IconButton, TextField } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { colors, fonts, radius, spacing } from '@/theme';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

/**
 * Staff-only sign in. Not linked from any customer screen — reachable via a
 * hidden long-press on the Account footer or the deep link
 * suzyscleaners://staff-login. The backend rejects non-admin accounts.
 */
export default function StaffLogin() {
  const insets = useSafeAreaInsets();
  const { signInStaff, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const attempts = useRef(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [, tick] = useState(0);

  useEffect(() => {
    if (user?.role === 'admin') router.replace('/admin');
  }, [user?.role]);

  useEffect(() => {
    if (!lockedUntil) return;
    const t = setInterval(() => {
      if (Date.now() >= lockedUntil) setLockedUntil(0);
      tick((n) => n + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [lockedUntil]);

  const locked = lockedUntil > Date.now();

  const submit = async () => {
    if (locked) return;
    setError('');
    setBusy(true);
    try {
      await signInStaff(email, password);
      attempts.current = 0;
      router.replace('/admin');
    } catch (e) {
      attempts.current += 1;
      if (attempts.current >= MAX_ATTEMPTS) {
        attempts.current = 0;
        setLockedUntil(Date.now() + LOCKOUT_MS);
        setError('Too many attempts. Please wait a minute and try again.');
      } else {
        setError((e as Error).message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[colors.navy900, colors.navy]} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: spacing.md, paddingTop: insets.top + spacing.sm, gap: spacing.md }} keyboardShouldPersistTaps="handled">
          <IconButton icon="close" label="Close" tone="dark" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
          <View style={styles.logoWrap}>
            <BrandLogo width={200} />
          </View>
          <View style={{ gap: 6, alignItems: 'center' }}>
            <View style={styles.badge}>
              <Icon name="shield-lock-outline" size={15} color={colors.navy900} />
              <AppText style={styles.badgeText}>STAFF ONLY</AppText>
            </View>
            <AppText style={styles.title}>Team Portal</AppText>
            <AppText style={styles.sub}>Sign in to manage pickups, orders and customer messages.</AppText>
          </View>
          <View style={styles.form}>
            <TextField label="Staff email" icon="email-outline" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
            <TextField label="Password" icon="lock-outline" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" onSubmitEditing={submit} error={error} />
            <Button
              title={locked ? `Locked · ${Math.ceil((lockedUntil - Date.now()) / 1000)}s` : 'Sign In to Dashboard'}
              icon="shield-check-outline"
              onPress={submit}
              loading={busy}
              disabled={!email || !password || locked}
            />
          </View>
          <AppText style={styles.legal}>Access is logged. Customer accounts cannot access this area.</AppText>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  logoWrap: { backgroundColor: colors.ivory, borderRadius: radius.xxl, paddingVertical: spacing.md, marginHorizontal: spacing.xl },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.sunshine, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  badgeText: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.4, color: colors.navy900 },
  title: { fontFamily: fonts.display, fontSize: 32, color: colors.white },
  sub: { fontFamily: fonts.regular, fontSize: 15, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  form: { backgroundColor: colors.cream, borderRadius: radius.xl, padding: spacing.md, gap: spacing.md },
  legal: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.55)', textAlign: 'center' },
});

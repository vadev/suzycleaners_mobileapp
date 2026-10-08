import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { spacing } from '@/theme';
import { BrandLogo } from './brand/BrandLogo';
import { AppText, Button } from './ui';

/** Shows a sign-in invitation instead of `children` when no customer is signed in. */
export function AuthGate({ children, title, body }: { children: ReactNode; title: string; body: string }) {
  const { user } = useAuth();
  if (user) return <>{children}</>;
  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: spacing.md, paddingVertical: spacing.xxl }}>
      <BrandLogo width={200} />
      <AppText variant="h1" style={{ textAlign: 'center' }}>
        {title}
      </AppText>
      <AppText variant="body" style={{ textAlign: 'center', color: '#6B7385' }}>
        {body}
      </AppText>
      <Button title="Sign In" variant="dark" onPress={() => router.push('/auth/sign-in')} />
      <Button title="Create an Account" variant="outline" onPress={() => router.push('/auth/sign-up')} />
    </View>
  );
}

import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme';

/** Role gate: only sessions with role === 'admin' ever render admin routes. */
export default function AdminLayout() {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user || user.role !== 'admin') return <Redirect href="/staff-login" />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream }, animation: 'slide_from_right' }} />;
}

import Constants from 'expo-constants';

/**
 * Runtime configuration. `backend` selects the data adapter
 * (see src/services/backend/index.ts). Set it in app.json → expo.extra.backend
 * or with EXPO_PUBLIC_BACKEND.
 */
type BackendKind = 'local' | 'supabase' | 'firebase';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;

export const env = {
  backend: (process.env.EXPO_PUBLIC_BACKEND ?? (extra.backend as string) ?? 'local') as BackendKind,
  easProjectId: (extra.eas as { projectId?: string } | undefined)?.projectId || undefined,
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  /**
   * Demo only: lets the admin device call Expo's push API directly so a real
   * device receives the push. In production, send pushes from your server
   * (Supabase Edge Function / Firebase Cloud Function) and turn this off.
   */
  clientSidePush: true,
};

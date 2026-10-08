import { env } from '@/config/env';
import { LocalBackend } from './local/LocalBackend';
import type { Backend } from './types';

export * from './types';

/**
 * Adapter selection. To go to production:
 *   1. Implement `Backend` in ./supabase/SupabaseBackend.ts (or ./firebase/…)
 *      following docs/BACKEND.md.
 *   2. Return it here when `env.backend` matches.
 * Nothing in src/app or src/components needs to change.
 */
function createBackend(): Backend {
  switch (env.backend) {
    case 'local':
    default:
      return new LocalBackend();
  }
}

export const backend = createBackend();

/** Demo-only helpers that exist on the local adapter. */
export const demoTools = backend instanceof LocalBackend ? backend : null;

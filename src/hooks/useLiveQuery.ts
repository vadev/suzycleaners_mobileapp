import { useCallback, useEffect, useRef, useState } from 'react';
import { backend, type ChangeTopic } from '@/services/backend';

/**
 * Runs `fetcher` and re-runs it whenever the backend reports a change on one
 * of `topics`. This is what makes an admin status update appear instantly on
 * the customer's screens (Supabase realtime / Firestore listeners in prod).
 */
export function useLiveQuery<T>(fetcher: () => Promise<T>, topics: ChangeTopic[], deps: unknown[] = []) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchRef = useRef(fetcher);
  fetchRef.current = fetcher;
  const topicKey = topics.join(',');

  const run = useCallback(async () => {
    try {
      const result = await fetchRef.current();
      setData(result);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    run();
    const unsubscribe = backend.subscribe((topic) => {
      if (active && (topic === 'session' || topicKey.split(',').includes(topic))) run();
    });
    return () => {
      active = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, topicKey, ...deps]);

  return { data, error, loading, refresh: run };
}

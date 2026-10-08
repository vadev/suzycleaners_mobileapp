import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { backend, type ChangeTopic } from '@/services/backend';

interface QueryState<T> {
  key: string;
  data: T | undefined;
  error: Error | null;
}

/**
 * Runs `fetcher` and re-runs it whenever the backend reports a change on one
 * of `topics`. This is what makes an admin status update appear instantly on
 * the customer's screens (Supabase Realtime in production).
 */
export function useLiveQuery<T>(fetcher: () => Promise<T>, topics: ChangeTopic[], deps: unknown[] = []) {
  const key = JSON.stringify(deps);
  const topicKey = topics.join(',');
  const [state, setState] = useState<QueryState<T>>({ key: '', data: undefined, error: null });

  // Always call the latest fetcher without re-subscribing on every render.
  const fetchRef = useRef(fetcher);
  useLayoutEffect(() => {
    fetchRef.current = fetcher;
  });

  const run = useCallback(async (forKey: string) => {
    try {
      const data = await fetchRef.current();
      setState({ key: forKey, data, error: null });
    } catch (e) {
      setState((s) => ({ key: forKey, data: s.data, error: e as Error }));
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = () => {
      if (active) run(key);
    };
    load();
    const unsubscribe = backend.subscribe((topic) => {
      if (topic === 'session' || topicKey.split(',').includes(topic)) load();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [run, key, topicKey]);

  const refresh = useCallback(() => run(key), [run, key]);

  return {
    data: state.data,
    error: state.error,
    /** True until the first result for the current deps has arrived. */
    loading: state.key !== key,
    refresh,
  };
}

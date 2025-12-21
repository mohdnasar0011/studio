
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMatchProfiles } from '@/lib/api';
import type { MatchProfile } from '@/lib/data';

/**
 * Custom hook to fetch match profiles from the backend.
 * @returns An object containing profiles, loading state, and error state.
 */
export function useMatchProfiles() {
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const freshProfiles = await getMatchProfiles();
      setProfiles(freshProfiles);
      setError(null);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError('Failed to connect to the backend. Is it running?');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return { profiles, isLoading, error, refetch: fetchProfiles };
}

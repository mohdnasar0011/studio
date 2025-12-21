
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getChatThreads } from '@/lib/api';
import type { ChatThread } from '@/lib/data';

/**
 * Custom hook to fetch chat threads from the backend.
 * @returns An object containing chat threads, loading state, and error state.
 */
export function useChatThreads() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatThreads = useCallback(async () => {
    setIsLoading(true);
    try {
      const freshThreads = await getChatThreads();
       // The backend might not return data in the exact same format.
      // We can map it here if needed, but for now we assume it matches.
      setThreads(freshThreads);
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
    fetchChatThreads();
    
    // Optional: Add polling if you want the chat list to auto-update
    // const intervalId = setInterval(fetchChatThreads, 5000);
    // return () => clearInterval(intervalId);
  }, [fetchChatThreads]);

  return { threads, isLoading, error, refetch: fetchChatThreads };
}

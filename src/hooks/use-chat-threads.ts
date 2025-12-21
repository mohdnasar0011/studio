
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getChatThreads } from '@/lib/api';
import type { ChatThread } from '@/lib/data';

/**
 * Custom hook to fetch chat threads from the backend with polling.
 * @returns An object containing chat threads, loading state, and error state.
 */
export function useChatThreads() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatThreads = useCallback(async () => {
    // Only show initial loader
    if (threads.length === 0) {
        setIsLoading(true);
    }
    try {
      const freshThreads = await getChatThreads();
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
  }, [threads.length]);

  useEffect(() => {
    fetchChatThreads();
    
    // Set up polling every 5 seconds to simulate real-time updates
    const intervalId = setInterval(fetchChatThreads, 5000);
    return () => clearInterval(intervalId);
  }, [fetchChatThreads]);

  return { threads, isLoading, error, refetch: fetchChatThreads };
}

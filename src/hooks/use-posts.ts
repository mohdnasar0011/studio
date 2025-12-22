'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPosts } from '@/lib/api';
import type { FeedPost } from '@/lib/data';

/**
 * Custom hook to fetch posts from the backend with polling.
 * @returns An object containing posts, loading state, and error state.
 */
export function usePosts() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    // Only show the main loader on the very first fetch
    if (posts.length === 0) {
      setIsLoading(true);
    }
    
    try {
      const freshPosts = await getPosts();
      setPosts(freshPosts);
      setError(null);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError('Failed to connect to the backend. Is it running?');
      }
    } finally {
        setIsLoading(false);
    }
  }, [posts.length]);

  useEffect(() => {
    // Initial fetch
    fetchPosts();

    // Set up polling every 3 seconds
    const intervalId = setInterval(fetchPosts, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchPosts]);

  return { posts, isLoading, error, refetch: fetchPosts };
}

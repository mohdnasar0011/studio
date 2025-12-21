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
    try {
      // We set loading to true only on the initial fetch
      const freshPosts = await getPosts();

      // The backend might not return author details in the same format.
      // We map it to a format the frontend card expects.
      const formattedPosts = freshPosts.map((post: any) => ({
        id: post.id,
        content: post.content,
        imageUrl: post.imageUrl,
        timestamp: new Date(post.createdAt).toLocaleTimeString(), // Format timestamp
        author: { // Assuming backend returns author info or just a UID
            id: post.firebaseUid,
            name: post.authorName || 'Anonymous', // Fallback name
            avatarId: 'user-1' // Default avatar for now
        },
        upvotes: post.upvotes || 0,
        downvotes: post.downvotes || 0,
        comments: post.comments || 0,
      }));

      setPosts(formattedPosts);
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
    // Initial fetch
    fetchPosts();

    // Set up polling every 3 seconds
    const intervalId = setInterval(fetchPosts, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchPosts]);

  return { posts, isLoading, error };
}

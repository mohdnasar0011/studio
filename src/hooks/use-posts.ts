'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPosts } from '@/lib/api';
import type { FeedPost, User } from '@/lib/data';
import { users } from '@/lib/data';

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
    if (!posts.length) {
      setIsLoading(true);
    }
    
    try {
      const freshPosts = await getPosts();

      // The backend might not return full author details.
      // We map it to a format the frontend card expects.
      const formattedPosts = freshPosts.map((post: any) => {
        const author = users.find(u => u.id === post.userId) || { id: post.userId, name: post.authorName || 'Anonymous', avatarId: 'user-1' };
        
        return {
          id: post.id,
          content: post.content,
          imageUrl: post.imageUrl,
          timestamp: new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format timestamp
          author: author,
          upvotes: post.upvotes || 0,
          downvotes: post.downvotes || 0,
          comments: post.comments || 0,
        };
      }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by most recent

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

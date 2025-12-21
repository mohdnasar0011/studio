
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getComments, addComment as apiAddComment } from '@/lib/api';
import type { Comment } from '@/lib/data';

/**
 * Custom hook to fetch and manage comments for a post.
 * @param postId The ID of the post to fetch comments for. Pass null to disable fetching.
 * @returns An object containing comments, loading state, and an addComment function.
 */
export function useComments(postId: string | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setIsLoading(true);
    try {
      const freshComments = await getComments(postId);
      setComments(freshComments);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchComments();
      // Set up polling for new comments
      const intervalId = setInterval(fetchComments, 5000);
      return () => clearInterval(intervalId);
    } else {
        // Clear comments when postId is null (sheet is closed)
        setComments([]);
    }
  }, [postId, fetchComments]);
  
  const addComment = useCallback(async (content: string) => {
    if (!postId) throw new Error("Post ID is not set");
    
    const newComment = await apiAddComment(postId, content);
    // Optimistically update the UI
    setComments(prev => [...prev, newComment]);
    
    // We can re-fetch to ensure consistency, but optimistic update is faster for the user.
    // await fetchComments(); 

    return newComment;
  }, [postId]);


  return { comments, isLoading, addComment };
}

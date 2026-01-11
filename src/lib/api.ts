// This file contains all the API calls to your Next.js backend API routes.

import { type FeedPost, type Comment, type User, type MatchProfile, type ChatThread, type ChatMessage } from "./data";

async function fetcher(url: string, method: string = 'GET', body?: any) {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const res = await fetch(url, options);
    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorBody.message || 'An error occurred with the API request.');
    }
    return res.json();
}


/**
 * Simulates a login handshake.
 * @param email The user's email.
 * @param password The user's password (unused in mock).
 * @returns A promise resolving to mock user data.
 */
export async function loginHandshake(email?: string, password?: string): Promise<User> {
  console.log("API: Login Handshake:", {email});
  const user = await fetcher('/api/auth/login', 'POST', { email, password });
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('userId', user.id);
  }
  
  return user;
}

/**
 * Simulates user sign-out.
 */
export async function signOut(): Promise<{ success: boolean }> {
    console.log("API: Sign Out");
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate small delay
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userId');
    }
    // No backend call needed for simple logout
    return { success: true };
}


interface CreatePostPayload {
  content: string;
  imageUrl: string | null;
  userId: string;
  location?: { lat: number; lon: number } | null;
}

/**
 * Creates a new post by calling the backend API.
 * @param payload - The post data.
 */
export async function createPost(payload: CreatePostPayload): Promise<FeedPost> {
  console.log("API: Create Post:", payload);
  return fetcher('/api/posts', 'POST', payload);
}

/**
 * Fetches posts from the backend API.
 */
export async function getPosts(): Promise<FeedPost[]> {
  console.log("API: Get Posts");
  return fetcher('/api/posts');
}

/**
 * Fetches match profiles from the backend API.
 */
export async function getMatchProfiles(): Promise<MatchProfile[]> {
  console.log("API: Get Match Profiles");
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  if (!userId) return [];
  return fetcher(`/api/match-profiles?userId=${userId}`);
}

/**
 * Records a swipe action by calling the backend API.
 * @param profileId The ID of the profile.
 * @param action The action taken ('accept' or 'dismiss').
 */
export async function recordMatchAction(profileId: string, action: 'accept' | 'dismiss'): Promise<{ success: boolean }> {
    console.log(`API: Match Action: ${action} on profile ${profileId}`);
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!userId) throw new Error("User not logged in");
    return fetcher('/api/match-actions', 'POST', { userId, profileId, action });
}

/**
 * Fetches chat threads for the current user from the backend API.
 */
export async function getChatThreads(): Promise<ChatThread[]> {
  console.log("API: Get Chat Threads");
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  if (!userId) return [];
  return fetcher(`/api/chat/threads?userId=${userId}`);
}

/**
 * Adds a buddy by calling the backend API.
 * @param buddyId The ID of the user to add as a buddy.
 */
export async function addBuddy(buddyId: string): Promise<{ success: boolean }> {
  console.log(`API: Adding buddy with ID: ${buddyId}`);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  if (!userId) throw new Error("User not logged in");
  return fetcher('/api/buddies', 'POST', { userId, buddyId });
}

/**
 * Fetches comments for a given post from the backend API.
 * @param postId The ID of the post.
 */
export async function getComments(postId: string): Promise<Comment[]> {
    console.log(`API: Get Comments for post: ${postId}`);
    return fetcher(`/api/posts/${postId}/comments`);
}

/**
 * Adds a comment to a post by calling the backend API.
 * @param postId The ID of the post.
 * @param content The text content of the comment.
 */
export async function addComment(postId: string, content: string): Promise<Comment> {
    console.log(`API: Add Comment to post ${postId}: ${content}`);
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!userId) throw new Error("User must be logged in to comment.");
    return fetcher(`/api/posts/${postId}/comments`, 'POST', { content, userId });
}

/**
 * Updates a user's profile by calling the backend API.
 * @param userId The ID of the user to update.
 * @param updates The profile data to update.
 */
export async function updateProfile(userId: string, updates: Partial<Pick<User, 'bio' | 'avatarId'>>): Promise<User> {
  console.log(`API: Update Profile for user ${userId}:`, updates);
  return fetcher(`/api/users/${userId}`, 'PUT', updates);
}

/**
 * Votes on a post by calling the backend API.
 * @param postId The ID of the post.
 * @param voteType The type of vote ('upvote' or 'downvote').
 */
export async function voteOnPost(postId: string, voteType: 'upvote' | 'downvote'): Promise<{ success: boolean, newUpvotes: number }> {
    console.log(`API: ${voteType} on post ${postId}`);
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!userId) throw new Error("User not logged in");
    return fetcher(`/api/posts/${postId}/vote`, 'POST', { userId, voteType });
}

/**
 * Fetches a single user's profile from the backend API.
 * @param userId The ID of the user to fetch.
 */
export async function getUserProfile(userId: string): Promise<User | null> {
    console.log(`API: Get User Profile for: ${userId}`);
    return fetcher(`/api/users/${userId}`);
}


/**
 * Fetches messages for a specific chat thread from the backend API.
 * @param threadId The ID of the chat thread.
 */
export async function getMessages(threadId: string): Promise<ChatMessage[]> {
    console.log(`API: Get Messages for thread: ${threadId}`);
    return fetcher(`/api/chat/threads/${threadId}/messages`);
}

/**
 * Adds a new message to a chat thread by calling the backend API.
 * @param threadId The ID of the thread.
 * @param content The message content.
 */
export async function sendMessage(threadId: string, content: string): Promise<ChatMessage> {
    console.log(`API: Send Message to thread ${threadId}: ${content}`);
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!userId) throw new Error("User must be logged in to send a message.");

    return fetcher(`/api/chat/threads/${threadId}/messages`, 'POST', { senderId: userId, content });
}

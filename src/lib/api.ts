
// This file contains all the API calls to your Spring Boot backend.
// This is a MOCK API that simulates a backend for UI development.

import { chatThreads, getCurrentUser, feedPosts, matchProfiles, users, type FeedPost, type Comment, type User } from "./data";

const API_BASE_URL = 'http://localhost:8080/api';

const MOCK_API_DELAY = 500; // ms

// In-memory store for new posts to simulate a database
let inMemoryPosts: any[] = [];
// In-memory store for comments, mapping postId to a list of comments
const inMemoryComments = new Map<string, any[]>();


/**
 * Simulates a login handshake.
 * @param token - An authentication token (unused in mock).
 * @returns A promise resolving to mock user data.
 */
export async function loginHandshake(email?: string, password?: string): Promise<User> {
  console.log("Mock Login Handshake:", {email, password});
  
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  
  // Find user by email, or use the first user as a fallback for signup
  const user = users.find(u => u.email === email) || users[0];

  if (!user) {
    throw new Error("User not found");
  }
  
  localStorage.setItem('userId', user.id);
  return user;
}

/**
 * Simulates user sign-out.
 */
export async function signOut(): Promise<{ success: boolean }> {
    console.log("Mock Sign Out");
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
    localStorage.removeItem('userId');
    return { success: true };
}


interface CreatePostPayload {
  content: string;
  imageUrl: string | null;
  userId: string;
}

/**
 * Simulates creating a new post. The post is added to an in-memory array.
 * @param payload - The post data.
 */
export async function createPost(payload: CreatePostPayload) {
  console.log("Mock Create Post:", payload);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

  const author = users.find(u => u.id === payload.userId);
  if (!author) throw new Error("User not found to create post");

  const newPost = {
    id: `post-${Date.now()}`,
    content: payload.content,
    imageUrl: payload.imageUrl,
    createdAt: new Date().toISOString(),
    userId: payload.userId,
    authorName: author.name,
    upvotes: Math.floor(Math.random() * 5),
    downvotes: 0,
    comments: 0,
  };
  
  inMemoryPosts.unshift(newPost); // Add to the beginning of the array

  return newPost;
}

/**
 * Fetches mock posts.
 */
export async function getPosts(): Promise<any[]> {
  console.log("Mock Get Posts");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
  
  // We'll return a format that mimics a real backend response
  const backendPosts = feedPosts.map(p => ({
    id: p.id,
    content: p.content,
    imageUrl: p.imageUrl,
    createdAt: p.timestamp, // In a real app this would be an ISO string
    userId: p.author.id,
    authorName: p.author.name,
    upvotes: p.upvotes,
    comments: (inMemoryComments.get(p.id) || p.commentsData).length
  }));
  
  // Combine initial posts with newly created ones
  const allPosts = [...inMemoryPosts.map(p => ({...p, comments: (inMemoryComments.get(p.id) || []).length})), ...backendPosts];

  return Promise.resolve(allPosts);
}

/**
 * Fetches mock match profiles.
 */
export async function getMatchProfiles(): Promise<MatchProfile[]> {
  console.log("Mock Get Match Profiles");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  return Promise.resolve([...matchProfiles]);
}

/**
 * Simulates an action (accept/dismiss) on a match profile.
 * @param profileId The ID of the profile.
 * @param action The action taken ('accept' or 'dismiss').
 */
export async function recordMatchAction(profileId: string, action: 'accept' | 'dismiss'): Promise<{ success: boolean }> {
    console.log(`Mock Match Action: ${action} on profile ${profileId}`);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
    if (matchProfiles.some(p => p.id === profileId)) {
        console.log(`Mock API: Successfully recorded ${action} for profile ${profileId}`);
        return { success: true };
    } else {
        throw new Error("Profile not found");
    }
}

/**
 * Fetches mock chat threads.
 */
export async function getChatThreads(): Promise<ChatThread[]> {
  console.log("Mock Get Chat Threads");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  return Promise.resolve([...chatThreads]);
}

/**
 * Simulates adding a buddy.
 * @param buddyId The ID of the user to add as a buddy.
 */
export async function addBuddy(buddyId: string): Promise<{ success: boolean }> {
  console.log(`Mock API: Adding buddy with ID: ${buddyId}`);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  
  // Check if the user exists in our mock data
  if (users.some(u => u.id === buddyId)) {
    console.log(`Mock API: Successfully added buddy ${buddyId}`);
    return { success: true };
  } else {
    throw new Error("User not found");
  }
}

/**
 * Fetches mock comments for a given post.
 * @param postId The ID of the post.
 */
export async function getComments(postId: string): Promise<Comment[]> {
    console.log(`Mock Get Comments for post: ${postId}`);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));

    const post = feedPosts.find(p => p.id === postId);
    const postComments = post ? post.commentsData : [];
    
    const newComments = inMemoryComments.get(postId) || [];

    return Promise.resolve([...postComments, ...newComments]);
}

/**
 * Simulates adding a comment to a post.
 * @param postId The ID of the post.
 * @param content The text content of the comment.
 */
export async function addComment(postId: string, content: string): Promise<Comment> {
    console.log(`Mock Add Comment to post ${postId}: ${content}`);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error("User must be logged in to comment.");

    const newComment: Comment = {
        id: `comment-${Date.now()}`,
        author: currentUser,
        content,
        timestamp: new Date().toISOString(),
    };

    if (!inMemoryComments.has(postId)) {
        inMemoryComments.set(postId, []);
    }
    inMemoryComments.get(postId)?.push(newComment);
    
    // Also update the comment count on the post object itself
    let inMemoryPost = inMemoryPosts.find(p => p.id === postId);
    if (inMemoryPost) {
        inMemoryPost.comments = (inMemoryPost.comments || 0) + 1;
    } else {
        let feedPost = feedPosts.find(p => p.id === postId);
        if (feedPost) {
            // This is a mock, so we'll just increment. A real backend would handle this.
        }
    }


    return newComment;
}

/**
 * Simulates updating a user's profile.
 * @param userId The ID of the user to update.
 * @param updates The profile data to update.
 */
export async function updateProfile(userId: string, updates: Partial<Pick<User, 'bio' | 'avatarId'>>): Promise<User> {
  console.log(`Mock Update Profile for user ${userId}:`, updates);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }

  // Update the in-memory user object
  users[userIndex] = { ...users[userIndex], ...updates };

  console.log("Updated user:", users[userIndex]);
  return users[userIndex];
}

/**
 * Simulates voting on a post.
 * @param postId The ID of the post.
 * @param voteType The type of vote ('upvote' or 'downvote').
 */
export async function voteOnPost(postId: string, voteType: 'upvote' | 'downvote'): Promise<{ success: boolean, newUpvotes: number }> {
    console.log(`Mock API: ${voteType} on post ${postId}`);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 4));
    
    // Find the post in either the initial data or the in-memory data
    let post = feedPosts.find(p => p.id === postId);
    let inMemoryPost = inMemoryPosts.find(p => p.id === postId);

    let targetPost = inMemoryPost || post;

    if (targetPost) {
        if (voteType === 'upvote') {
            targetPost.upvotes = (targetPost.upvotes || 0) + 1;
        } else {
            targetPost.upvotes = (targetPost.upvotes || 0) - 1;
        }
        return { success: true, newUpvotes: targetPost.upvotes };
    }

    throw new Error("Post not found");
}

/**
 * Fetches a single user's profile from the mock data.
 * @param userId The ID of the user to fetch.
 */
export async function getUserProfile(userId: string): Promise<User | null> {
    console.log(`Mock Get User Profile for: ${userId}`);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    const user = users.find(u => u.id === userId);
    return user || null;
}

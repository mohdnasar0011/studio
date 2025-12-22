// This file contains all the API calls to your Spring Boot backend.
// This is a MOCK API that simulates a backend for UI development.

import { chatThreads, getCurrentUser, feedPosts, matchProfiles, users, messagesDb, type FeedPost, type Comment, type User, type MatchProfile, type ChatThread, type ChatMessage } from "./data";
import { formatDistanceToNow } from 'date-fns';

const MOCK_API_DELAY = 500; // ms

// In-memory store for new posts to simulate a database
let inMemoryPosts: FeedPost[] = [];
// In-memory store for comments, mapping postId to a list of comments
const inMemoryComments = new Map<string, Comment[]>();


/**
 * Simulates a login handshake.
 * @param email The user's email.
 * @param password The user's password (unused in mock).
 * @returns A promise resolving to mock user data.
 */
export async function loginHandshake(email?: string, password?: string): Promise<User> {
  console.log("Mock Login Handshake:", {email, password});
  
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  
  // Find user by email. For sign up, if email is not found, use first user as fallback.
  const user = users.find(u => u.email === email);
  
  if (!user && email) { // Login attempt for non-existent user
    throw new Error("User not found or password incorrect");
  }
  
  const userToLogin = user || users[0];

  if (typeof window !== 'undefined') {
    localStorage.setItem('userId', userToLogin.id);
  }
  
  return userToLogin;
}

/**
 * Simulates user sign-out.
 */
export async function signOut(): Promise<{ success: boolean }> {
    console.log("Mock Sign Out");
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userId');
    }
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
export async function createPost(payload: CreatePostPayload): Promise<FeedPost> {
  console.log("Mock Create Post:", payload);
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

  const author = users.find(u => u.id === payload.userId);
  if (!author) throw new Error("User not found to create post");

  const newPost: FeedPost = {
    id: `post-${Date.now()}`,
    author: author,
    userId: author.id,
    content: payload.content,
    imageUrl: payload.imageUrl,
    createdAt: new Date().toISOString(),
    timestamp: 'Just now',
    upvotes: 0,
    downvotes: 0,
    comments: 0,
    commentsData: [],
  };
  
  inMemoryPosts.unshift(newPost); // Add to the beginning of the array

  return newPost;
}

/**
 * Fetches mock posts.
 */
export async function getPosts(): Promise<FeedPost[]> {
  console.log("Mock Get Posts");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
  
  const allDbPosts = [...feedPosts, ...inMemoryPosts].map(p => ({
    ...p,
    // Make sure author object is included
    author: users.find(u => u.id === p.userId)!,
    // Recalculate timestamp and comment count for dynamic updates
    timestamp: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
    comments: (inMemoryComments.get(p.id) || p.commentsData).length,
  }));
  
  // Sort by creation date, newest first
  allDbPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return Promise.resolve(allDbPosts);
}

/**
 * Fetches mock match profiles, excluding the current user.
 */
export async function getMatchProfiles(): Promise<MatchProfile[]> {
  console.log("Mock Get Match Profiles");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  const currentUser = getCurrentUser();
  const otherUsers = matchProfiles.filter(p => p.id !== currentUser?.id);
  return Promise.resolve([...otherUsers]);
}

/**
 * Simulates an action (accept/dismiss) on a match profile.
 * @param profileId The ID of the profile.
 * @param action The action taken ('accept' or 'dismiss').
 */
export async function recordMatchAction(profileId: string, action: 'accept' | 'dismiss'): Promise<{ success: boolean }> {
    console.log(`Mock Match Action: ${action} on profile ${profileId}`);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
    if (users.some(p => p.id === profileId)) {
        console.log(`Mock API: Successfully recorded ${action} for profile ${profileId}`);
        return { success: true };
    } else {
        throw new Error("Profile not found");
    }
}

/**
 * Fetches mock chat threads for the current user.
 */
export async function getChatThreads(): Promise<ChatThread[]> {
  console.log("Mock Get Chat Threads");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  // Filter threads where the current user is a participant
  const userThreads = chatThreads.filter(thread => 
    thread.participants.some(p => p.id === currentUser.id)
  );
  return Promise.resolve([...userThreads]);
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

    const post = [...feedPosts, ...inMemoryPosts].find(p => p.id === postId);
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
    let postToUpdate = [...feedPosts, ...inMemoryPosts].find(p => p.id === postId);
    if(postToUpdate) {
        postToUpdate.comments = (inMemoryComments.get(postId) || postToUpdate.commentsData).length;
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
    let post = [...feedPosts, ...inMemoryPosts].find(p => p.id === postId);
    
    if (post) {
        if (voteType === 'upvote') {
            post.upvotes = (post.upvotes || 0) + 1;
        } else {
            // Prevent going below zero for this mock
            post.upvotes = Math.max(0, (post.upvotes || 0) - 1);
        }
        return { success: true, newUpvotes: post.upvotes };
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


/**
 * Fetches messages for a specific chat thread.
 * @param threadId The ID of the chat thread.
 */
export async function getMessages(threadId: string): Promise<ChatMessage[]> {
    console.log(`Mock Get Messages for thread: ${threadId}`);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 3));
    return messagesDb.filter(m => m.threadId === threadId);
}

/**
 * Adds a new message to a chat thread.
 * @param threadId The ID of the thread.
 * @param content The message content.
 */
export async function sendMessage(threadId: string, content: string): Promise<ChatMessage> {
    console.log(`Mock Send Message to thread ${threadId}: ${content}`);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
    
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error("User must be logged in to send a message.");

    const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        threadId,
        senderId: currentUser.id,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    messagesDb.push(newMessage);

    // Also update the thread's last message for the inbox view
    const thread = chatThreads.find(t => t.id === threadId);
    if(thread) {
        thread.lastMessage = {
            content: content,
            timestamp: new Date().toISOString(),
        }
    }

    return newMessage;
}

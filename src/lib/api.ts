// This file contains all the API calls to your Spring Boot backend.
// This is a MOCK API that simulates a backend for UI development.

import { chatThreads, currentUser, feedPosts, matchProfiles, users, type FeedPost } from "./data";

const API_BASE_URL = 'http://localhost:8080/api';

const MOCK_API_DELAY = 500; // ms

// In-memory store for new posts to simulate a database
let inMemoryPosts: any[] = [];

/**
 * Simulates a login handshake.
 * @param token - An authentication token (unused in mock).
 * @returns A promise resolving to mock user data.
 */
export async function loginHandshake(token: string): Promise<{ id: string, userId: string, email: string, name: string }> {
  console.log("Mock Login Handshake:", token);
  
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  
  const mockUser = { id: currentUser.id, userId: currentUser.id, email: 'user@example.com', name: currentUser.name };
  localStorage.setItem('userId', mockUser.userId);
  return mockUser;
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

  const author = users.find(u => u.id === payload.userId) || currentUser;

  const newPost = {
    id: `post-${Date.now()}`,
    content: payload.content,
    imageUrl: payload.imageUrl,
    createdAt: new Date().toISOString(),
    userId: payload.userId,
    authorName: author.name,
    upvotes: Math.floor(Math.random() * 5),
    downvotes: 0,
    comments: Math.floor(Math.random() * 10),
  };
  
  inMemoryPosts.unshift(newPost); // Add to the beginning of the array

  return newPost;
}

/**
 * Fetches mock posts.
 */
export async function getPosts() {
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
    comments: p.comments
  }));
  
  // Combine initial posts with newly created ones
  const allPosts = [...inMemoryPosts, ...backendPosts];

  return Promise.resolve(allPosts);
}

/**
 * Fetches mock match profiles.
 */
export async function getMatchProfiles() {
  console.log("Mock Get Match Profiles");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  return Promise.resolve([...matchProfiles]);
}

/**
 * Fetches mock chat threads.
 */
export async function getChatThreads() {
  console.log("Mock Get Chat Threads");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  return Promise.resolve([...chatThreads]);
}

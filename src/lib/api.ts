// This file contains all the API calls to your Spring Boot backend.

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Performs a fake login handshake for demonstration.
 * In a real app, you would send a token to be verified.
 * @param token - An authentication token.
 * @returns The user data from the Spring Boot backend.
 */
export async function loginHandshake(token: string): Promise<{ id: string, userId: string, email: string, name: string }> {
  // We're not using the token, but we keep it in the function signature
  // to match the original hybrid architecture design.
  console.log("Performing login handshake. In a real app, this token would be verified:", token);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
       // In a real app, you'd send the token for verification
      'Authorization': `Bearer ${token}`
    },
     // In a real app, you might send other details, but for this demo, we can send a dummy user ID
     body: JSON.stringify({ userId: 'user-1-abc' }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    // Simulate a successful response if the backend is not running
    if (response.status === 404 || response.status === 500) {
        console.warn("Login handshake failed, backend not reachable. Simulating success for browser-only mode.");
        const mockUser = { id: 'mock-id-1', userId: 'user-1-abc', email: 'user@example.com', name: 'Mock User' };
        localStorage.setItem('userId', mockUser.userId);
        return mockUser;
    }
    throw new Error(`Login handshake failed: ${errorBody}`);
  }

  const user = await response.json();
  
  // Store the UID from your own backend's database
  localStorage.setItem('userId', user.userId);

  return user;
}


interface CreatePostPayload {
  content: string;
  imageUrl: string | null;
  userId: string;
}

/**
 * Creates a new post by sending the data to the Spring Boot backend.
 * @param payload - The post data.
 */
export async function createPost(payload: CreatePostPayload) {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to create post: ${errorBody}`);
  }

  return response.json();
}

/**
 * Fetches all posts from the Spring Boot backend.
 */
export async function getPosts() {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    cache: 'no-store', // Ensure we always get the latest posts
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch posts: ${errorBody}`);
  }

  return response.json();
}

/**
 * Fetches all match profiles from the Spring Boot backend.
 */
export async function getMatchProfiles() {
  const response = await fetch(`${API_BASE_URL}/matches`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch match profiles: ${errorBody}`);
  }

  return response.json();
}

/**
 * Fetches all chat threads from the Spring Boot backend.
 */
export async function getChatThreads() {
  const response = await fetch(`${API_BASE_URL}/chat-threads`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch chat threads: ${errorBody}`);
  }

  return response.json();
}

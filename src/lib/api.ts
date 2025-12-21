// This file contains all the API calls to your Spring Boot backend.

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Performs the login handshake.
 * Sends the Firebase ID token to the backend to verify and get/create a user.
 * @param token - The Firebase ID token from the signed-in user.
 * @returns The user data from the Spring Boot backend.
 */
export async function loginHandshake(token: string): Promise<{ id: string, firebaseUid: string, email: string, name: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Login handshake failed: ${errorBody}`);
  }

  const user = await response.json();
  
  // Store the UID from your own backend's database
  localStorage.setItem('firebaseUid', user.firebaseUid);

  return user;
}


interface CreatePostPayload {
  content: string;
  imageUrl: string | null;
  firebaseUid: string;
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

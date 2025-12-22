# FitConnect - Workout Buddy Finder

FitConnect is a modern, mobile-first web application designed to help users find workout partners in their area. It features a dynamic social feed, a swipe-based matching system, and real-time chat to help users connect and coordinate their fitness activities.

This project is built with Next.js (App Router), TypeScript, and Tailwind CSS, and uses a mock API for local development, allowing you to build and test the UI without a live backend.

## Core Features

- **Authentication**: Secure user login and signup flows. The app requires users to log in or create an account before accessing any features.
- **Feed**: A dynamic, scrollable feed where users can share workout plans, achievements, and photos. Includes features for upvoting, downvoting, and commenting.
- **Matching**: A "Find Your Buddy" section with a Tinder-like swipe interface (right to connect, left to pass) to discover potential workout partners based on their profiles.
- **User Profiles**: Comprehensive user profiles displaying a user's bio, reliability score, availability, and a feed of their personal posts. Users can edit their own profile.
- **Chat**: A real-time messaging system where matched users can communicate and coordinate. It includes a chat inbox and individual conversation views.
- **Settings**: A dedicated section for managing account preferences, notifications, privacy, and signing out.

## Getting Started

To run the application locally, follow these steps:

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

## Connecting to Your Backend

The frontend is designed to be backend-agnostic. All communication with the server is handled through a single mock API service file. To connect your own backend (e.g., built with Node.js, Spring Boot, etc.), you only need to modify this one file.

**File to Edit**: `src/lib/api.ts`

### How It Works

1.  **Mock Service**: Currently, all functions in `src/lib/api.ts` (like `getPosts`, `loginHandshake`, `createPost`, etc.) return mock data and simulate network delays. They do not make real API calls.

2.  **React Hooks**: The UI components use custom React hooks (e.g., `usePosts`, `useComments`, `useMatchProfiles`) to fetch data. These hooks are responsible for state management (loading, error, data).

3.  **The Connection**: The React hooks call the functions in `src/lib/api.ts`.

### Your Task

To connect your backend, you must **replace the body of each function in `src/lib/api.ts` with actual `fetch` calls to your API endpoints.**

For example, to connect the `getPosts` function:

```typescript
// src/lib/api.ts

// BEFORE (Mock Implementation)
export async function getPosts(): Promise<FeedPost[]> {
  console.log("Mock Get Posts");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
  // ... mock data logic
  return Promise.resolve(allDbPosts);
}

// AFTER (Your Real Backend Implementation)
export async function getPosts(): Promise<FeedPost[]> {
  const response = await fetch('https://your-backend-url.com/api/posts');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data = await response.json();
  return data; // Ensure your API returns data in the `FeedPost` format
}
```

As long as your backend API returns data in the exact formats specified by the TypeScript types in `src/lib/data.ts` (e.g., `FeedPost`, `User`, `MatchProfile`), the UI will work seamlessly without any further changes.

For a complete reference of all required API endpoints, data models, and a suggested database schema, please see `README.backend.md`.

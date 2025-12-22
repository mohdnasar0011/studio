# Backend Integration Guide for FitConnect

This document provides a comprehensive guide for building a backend (e.g., using Spring Boot, Node.js, etc.) that is compatible with the FitConnect frontend application. It outlines the required API endpoints, data models, and database schema.

## 1. Overview

The frontend is currently connected to a mock API service located in `src/lib/api.ts`. To connect your backend, you must replace the function bodies in this file with actual `fetch` calls to your new API endpoints.

All frontend data fetching and state management are handled by React hooks (e.g., `usePosts`, `useComments`). These hooks call the functions in `src/lib/api.ts`. As long as your API returns data in the formats specified in this guide, the UI will function correctly without further changes.

## 2. Database Schema

Based on the application's features, here is a suggested schema for your database (e.g., PostgreSQL, MySQL).

### `users` table
Stores user account information.

| Column | Type | Description |
|---|---|---|
| `id` | `VARCHAR(255)` or `UUID` | Primary Key. Unique identifier for the user. |
| `name` | `VARCHAR(255)` | User's display name. |
| `email` | `VARCHAR(255)` | Unique email for login. |
| `password_hash` | `VARCHAR(255)` | Hashed password for authentication. |
| `avatar_id` | `VARCHAR(255)` | Identifier for the user's avatar image. The frontend maps this to a URL. |
| `bio` | `TEXT` | User's short biography. |
| `reliability_score`| `INT` | A score from 0-100 indicating user reliability. |
| `created_at` | `TIMESTAMP` | Timestamp of account creation. |

### `user_availability` table
Stores user availability slots.

| Column | Type | Description |
|---|---|---|
| `id` | `SERIAL` or `UUID` | Primary Key. |
| `user_id` | `VARCHAR(255)` | Foreign Key referencing `users.id`. |
| `availability_slot` | `VARCHAR(255)` | e.g., 'Weekdays Mornings', 'Sat Afternoons'. |

### `posts` table
Stores all posts created by users.

| Column | Type | Description |
|---|---|---|
| `id` | `VARCHAR(255)` or `UUID` | Primary Key. Unique identifier for the post. |
| `user_id` | `VARCHAR(255)` | Foreign Key referencing `users.id`. |
| `content` | `TEXT` | The text content of the post. |
| `image_url` | `TEXT` | (Optional) URL to an image attached to the post. |
| `location_lat` | `DECIMAL(10, 8)` | (Optional) Latitude of the tagged location. |
| `location_lon` | `DECIMAL(11, 8)` | (Optional) Longitude of the tagged location. |
| `created_at` | `TIMESTAMP` | Timestamp of post creation. |

### `comments` table
Stores all comments on posts.

| Column | Type | Description |
|---|---|---|
| `id` | `VARCHAR(255)` or `UUID` | Primary Key. Unique identifier for the comment. |
| `post_id` | `VARCHAR(255)` | Foreign Key referencing `posts.id`. |
| `user_id` | `VARCHAR(255)` | Foreign Key referencing `users.id`. |
| `content` | `TEXT` | The text content of the comment. |
| `created_at` | `TIMESTAMP` | Timestamp of comment creation. |

### `post_votes` table
Tracks upvotes and downvotes on posts.

| Column | Type | Description |
|---|---|---|
| `user_id` | `VARCHAR(255)` | Foreign Key referencing `users.id`. |
| `post_id` | `VARCHAR(255)` | Foreign Key referencing `posts.id`. |
| `vote_type` | `SMALLINT` | `1` for upvote, `-1` for downvote. |
| *Primary Key* | | (`user_id`, `post_id`) |

### `buddies` table
Stores the "buddy" relationships between users (a one-way follow system).

| Column | Type | Description |
|---|---|---|
| `user_id` | `VARCHAR(255)` | The ID of the user who is adding a buddy. |
| `buddy_id` | `VARCHAR(255)` | The ID of the user being added as a buddy. |
| *Primary Key* | | (`user_id`, `buddy_id`) |

### `match_actions` table
Stores swipe actions from the "Match" page.

| Column | Type | Description |
|---|---|---|
| `user_id` | `VARCHAR(255)` | The ID of the user performing the action. |
| `profile_id` | `VARCHAR(255)` | The ID of the profile being swiped on. |
| `action` | `VARCHAR(20)` | 'accept' or 'dismiss'. |
| `created_at` | `TIMESTAMP` | Timestamp of the action. |
| *Primary Key* | | (`user_id`, `profile_id`) |

## 3. API Endpoints

Your backend should expose the following RESTful endpoints. The base path for all endpoints is `/api`.

---
### Authentication

#### `POST /auth/login`
- **Description**: Authenticates a user and returns a session token.
- **Request Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Success Response (200)**: `{ "token": "your_jwt_token", "user": { ... } }` (The full User object)
- **Error Response (401)**: `{ "message": "Invalid credentials" }`

#### `POST /auth/signup`
- **Description**: Creates a new user account.
- **Request Body**: `{ "name": "New User", "email": "new@example.com", "password": "password123" }`
- **Success Response (201)**: `{ "token": "your_jwt_token", "user": { ... } }` (The new User object)

#### `POST /auth/logout`
- **Description**: Invalidates the user's session token.
- **Authorization**: `Bearer <token>`
- **Success Response (200)**: `{ "success": true }`

---
### Posts

#### `GET /posts`
- **Description**: Fetches a feed of all posts, sorted by creation date (newest first). Each post object must include the author details, vote count, and comment count.
- **Success Response (200)**: An array of `FeedPost` objects. See `src/lib/data.ts` for the `FeedPost` type definition.

#### `POST /posts`
- **Description**: Creates a new post.
- **Authorization**: `Bearer <token>`
- **Request Body**: `{ "content": "New post!", "imageUrl": "...", "location": { "lat": 40.7, "lon": -73.9 } }`
- **Success Response (201)**: The newly created `FeedPost` object.

#### `POST /posts/{postId}/vote`
- **Description**: Records a vote (up or down) on a post.
- **Authorization**: `Bearer <token>`
- **Request Body**: `{ "voteType": "upvote" | "downvote" }`
- **Success Response (200)**: `{ "success": true, "newUpvotes": 13 }`

---
### Comments

#### `GET /posts/{postId}/comments`
- **Description**: Fetches all comments for a specific post.
- **Success Response (200)**: An array of `Comment` objects. See `src/lib/data.ts` for the type definition.

#### `POST /posts/{postId}/comments`
- **Description**: Adds a new comment to a post.
- **Authorization**: `Bearer <token>`
- **Request Body**: `{ "content": "This is a great comment!" }`
- **Success Response (201)**: The newly created `Comment` object.

---
### Users & Profiles

#### `GET /users/{userId}`
- **Description**: Fetches the complete profile for a single user, including bio, stats, and availability.
- **Success Response (200)**: A `User` object. See `src/lib/data.ts` for the type definition.

#### `PUT /users/me`
- **Description**: Updates the profile of the currently authenticated user.
- **Authorization**: `Bearer <token>`
- **Request Body**: `{ "bio": "New bio here.", "avatarId": "new-avatar-id" }`
- **Success Response (200)**: The updated `User` object.

#### `POST /buddies`
- **Description**: Adds a user to the current user's buddy list.
- **Authorization**: `Bearer <token>`
- **Request Body**: `{ "buddyId": "user-2" }`
- **Success Response (200)**: `{ "success": true }`

---
### Matching

#### `GET /match-profiles`
- **Description**: Fetches a list of potential match profiles for the current user to swipe on. Your backend logic should exclude users they've already seen or are buddies with.
- **Authorization**: `Bearer <token>`
- **Success Response (200)**: An array of `MatchProfile` objects. See `src/lib/data.ts` for the type definition.

#### `POST /match-actions`
- **Description**: Records a swipe action (accept or dismiss).
- **Authorization**: `Bearer <token>`
- **Request Body**: `{ "profileId": "match-1", "action": "accept" }`
- **Success Response (200)**: `{ "success": true }`

---
### Chat

#### `GET /chat/threads`
- **Description**: Fetches the list of chat threads (conversations) for the current user.
- **Authorization**: `Bearer <token>`
- **Success Response (200)**: An array of `ChatThread` objects. See `src/lib/data.ts` for the type definition.

#### `GET /chat/threads/{threadId}/messages`
- **Description**: Fetches all messages for a specific chat thread.
- **Authorization**: `Bearer <token>`
- **Success Response (200)**: An array of `ChatMessage` objects. See `src/lib/data.ts` for the type definition.

#### `POST /chat/threads/{threadId}/messages`
- **Description**: Sends a new message in a chat thread.
- **Authorization**: `Bearer <token>`
- **Request Body**: `{ "content": "Hello!" }`
- **Success Response (201)**: The newly created `ChatMessage` object.

#### Real-time Chat (WebSockets)
The frontend simulates real-time chat with API polling. For a production-ready application, a WebSocket-based approach (e.g., using Spring WebSockets with STOMP or a similar library) is highly recommended.

- **Connection**: A client connects to a WebSocket endpoint (e.g., `/ws`).
- **Subscribe**: The client subscribes to a specific thread topic (e.g., `/topic/chat/{threadId}`).
- **Send Message**: The client sends a message to a destination (e.g., `/app/chat/{threadId}/sendMessage`) with the message payload.
- **Receive Message**: The server broadcasts new messages to all subscribers of the thread's topic.

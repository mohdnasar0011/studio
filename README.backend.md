# Backend Integration Guide for FitConnect

This document provides a comprehensive guide for replacing the mock API service with a live backend (e.g., Spring Boot). It outlines the required API endpoints, data models, and database schema needed to support the FitConnect frontend application.

## 1. Overview

The frontend is currently connected to a mock API located in `src/lib/api.ts`. To connect your Spring Boot backend, you will need to replace the mock function bodies in this file with actual `fetch` calls to your API endpoints.

All data fetching and state management on the frontend is handled by React hooks (e.g., `usePosts`, `useComments`). These hooks call the functions in `src/lib/api.ts`. As long as your new API calls return data in the expected format, the UI will work without further changes.

## 2. Database Schema

Based on the application's features, here is a suggested schema for your database (e.g., PostgreSQL).

### `users` table
Stores user account information.

| Column | Type | Description |
|---|---|---|
| `id` | `VARCHAR(255)` or `UUID` | Primary Key. Unique identifier for the user. |
| `name` | `VARCHAR(255)` | User's display name. |
| `email` | `VARCHAR(255)` | Unique email for login. |
| `password_hash` | `VARCHAR(255)` | Hashed password for authentication. |
| `avatar_url` | `TEXT` | URL to the user's profile picture. |
| `bio` | `TEXT` | User's biography. |
| `created_at` | `TIMESTAMP` | Timestamp of account creation. |

### `posts` table
Stores all posts created by users.

| Column | Type | Description |
|---|---|---|
| `id` | `VARCHAR(255)` or `UUID` | Primary Key. Unique identifier for the post. |
| `user_id` | `VARCHAR(255)` | Foreign Key referencing `users.id`. |
| `content` | `TEXT` | The text content of the post. |
| `image_url` | `TEXT` | (Optional) URL to an image attached to the post. |
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

Your backend should expose the following RESTful endpoints.

---
### Authentication

#### `POST /api/auth/login`
- **Description**: Authenticates a user and returns a session token.
- **Request Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**: `{ "token": "your_jwt_token", "user": { "id": "user-1", "name": "Alex Doe", ... } }`

#### `POST /api/auth/signup`
- **Description**: Creates a new user account.
- **Request Body**: `{ "name": "New User", "email": "new@example.com", "password": "password123" }`
- **Response**: `{ "token": "your_jwt_token", "user": { ... } }`

#### `POST /api/auth/logout`
- **Description**: Invalidates the user's session token.
- **Authorization**: `Bearer <token>`
- **Response**: `200 OK`

---
### Posts

#### `GET /api/posts`
- **Description**: Fetches a feed of all posts, sorted by creation date (newest first). Each post object should include author details and vote/comment counts.
- **Response**: `[{ "id": "post-1", "content": "...", "imageUrl": "...", "createdAt": "...", "author": { "id": "user-1", "name": "Alex", "avatarUrl": "..." }, "upvotes": 12, "comments": 2 }, ...]`

#### `POST /api/posts`
- **Description**: Creates a new post.
- **Authorization**: `Bearer <token>`
- **Request Body**: `{ "content": "New post!", "imageUrl": "..." }`
- **Response**: The newly created post object.

#### `POST /api/posts/{postId}/vote`
- **Description**: Records a vote (up or down) on a post.
- **Authorization**: `Bearer <token>`
- **Request Body**: `{ "voteType": "upvote" | "downvote" }`
- **Response**: `{ "success": true, "newUpvotes": 13 }`

---
### Comments

#### `GET /api/posts/{postId}/comments`
- **Description**: Fetches all comments for a specific post.
- **Response**: `[{ "id": "comment-1", "content": "...", "timestamp": "...", "author": { "id": "user-2", "name": "Samantha", "avatarUrl": "..." } }, ...]`

#### `POST /api/posts/{postId}/comments`
- **Description**: Adds a new comment to a post.
- **Authorization**: `Bearer <token>`
- **Request Body**: `{ "content": "This is a great comment!" }`
- **Response**: The newly created comment object.

---
### Users & Profiles

#### `GET /api/users/{userId}`
- **Description**: Fetches the complete profile for a single user, including their bio, stats, and posts.
- **Response**: `{ "id": "user-1", "name": "Alex", ..., "posts": [...] }`

#### `PUT /api/users/me`
- **Description**: Updates the profile of the currently authenticated user.
- **Authorization**: `Bearer <token>`
- **Request Body**: `{ "bio": "New bio here.", "avatarId": "new-avatar-id" }` (Note: `avatarId` is a mock concept; you should handle image uploads and return a `avatarUrl`).
- **Response**: The updated user object.

#### `POST /api/buddies`
- **Description**: Adds a user to the current user's buddy list.
- **Authorization**: `Bearer <token>`
- **Request Body**: `{ "buddyId": "user-2" }`
- **Response**: `{ "success": true }`

---
### Matching

#### `GET /api/match-profiles`
- **Description**: Fetches a list of potential match profiles for the current user to swipe on. Your backend logic should exclude users they've already seen or are buddies with.
- **Authorization**: `Bearer <token>`
- **Response**: `[{ "id": "match-1", "name": "Jenna", "age": 28, ... }, ...]`

#### `POST /api/match-actions`
- **Description**: Records a swipe action (accept or dismiss).
- **Authorization**: `Bearer <token>`
- **Request Body**: `{ "profileId": "match-1", "action": "accept" }`
- **Response**: `{ "success": true }`

---
### Chat

#### `GET /api/chat/threads`
- **Description**: Fetches the list of chat threads for the current user.
- **Authorization**: `Bearer <token>`
- **Response**: `[{ "id": "chat-1", "name": "Saturday Run Group", "isGroup": true, ... }, ...]`

**(Note:** Real-time chat functionality, including fetching messages for a thread and sending messages, typically requires WebSockets. The current mock implementation simulates this with polling and timeouts, but a production backend should use a WebSocket-based approach.)

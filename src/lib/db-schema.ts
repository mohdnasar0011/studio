// This file contains the SQL statements to create your database schema.
// You can execute this file against your Vercel Postgres database to set up the tables.
import { sql } from '@vercel/postgres';

export async function createTables() {
  const createUsersTable = await sql`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      avatar_id VARCHAR(255),
      bio TEXT,
      reliability_score INT,
      availability TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('Created "users" table');

  const createPostsTable = await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      image_url TEXT,
      location_lat DECIMAL(10, 8),
      location_lon DECIMAL(11, 8),
      upvotes INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('Created "posts" table');
  
  const createCommentsTable = await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id VARCHAR(255) PRIMARY KEY DEFAULT 'comment_' || substr(md5(random()::text), 0, 25),
      post_id VARCHAR(255) REFERENCES posts(id) ON DELETE CASCADE,
      user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('Created "comments" table');

  const createPostVotesTable = await sql`
    CREATE TABLE IF NOT EXISTS post_votes (
      user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
      post_id VARCHAR(255) REFERENCES posts(id) ON DELETE CASCADE,
      vote_type SMALLINT NOT NULL, -- 1 for upvote, -1 for downvote
      PRIMARY KEY (user_id, post_id)
    );
  `;
  console.log('Created "post_votes" table');

  const createBuddiesTable = await sql`
    CREATE TABLE IF NOT EXISTS buddies (
      user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
      buddy_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, buddy_id)
    );
  `;
  console.log('Created "buddies" table');
  
  const createMatchActionsTable = await sql`
    CREATE TABLE IF NOT EXISTS match_actions (
      user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
      profile_id VARCHAR(255) NOT NULL,
      action VARCHAR(20) NOT NULL, -- 'accept' or 'dismiss'
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, profile_id)
    );
  `;
  console.log('Created "match_actions" table');
  
  const createChatThreadsTable = await sql`
      CREATE TABLE IF NOT EXISTS chat_threads (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255),
          is_group BOOLEAN DEFAULT FALSE,
          last_message_content TEXT,
          last_message_timestamp TIMESTAMP WITH TIME ZONE,
          unread_count INT DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
  `;
  console.log('Created "chat_threads" table');

  const createChatThreadParticipantsTable = await sql`
      CREATE TABLE IF NOT EXISTS chat_thread_participants (
          thread_id VARCHAR(255) REFERENCES chat_threads(id) ON DELETE CASCADE,
          user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
          PRIMARY KEY (thread_id, user_id)
      );
  `;
  console.log('Created "chat_thread_participants" table');

  const createChatMessagesTable = await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
          id VARCHAR(255) PRIMARY KEY DEFAULT 'msg_' || substr(md5(random()::text), 0, 25),
          thread_id VARCHAR(255) REFERENCES chat_threads(id) ON DELETE CASCADE,
          sender_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
          content TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
  `;
  console.log('Created "chat_messages" table');

  return {
    createUsersTable,
    createPostsTable,
    createCommentsTable,
    createPostVotesTable,
    createBuddiesTable,
    createMatchActionsTable,
    createChatThreadsTable,
    createChatThreadParticipantsTable,
    createChatMessagesTable,
  };
}

export async function seedData() {
    // Seeding users
    await sql`
        INSERT INTO users (id, name, email, avatar_id, bio, reliability_score, availability)
        VALUES
        ('user-1', 'Alex Doe', 'alex@example.com', 'user-1', 'Morning runner and evening lifter. Looking for a buddy to keep me accountable for my weekend long runs!', 98, ARRAY['Weekdays Mornings', 'Sat Afternoons']),
        ('user-2', 'Samantha G.', 'samantha@example.com', 'user-2', 'Yoga enthusiast and occasional hiker. I love finding new trails.', 92, ARRAY['Weekends', 'Tue/Thu Evenings']),
        ('user-3', 'Mike Ross', 'mike@example.com', 'user-3', 'Gym rat. Usually lifting weights or playing basketball.', 88, ARRAY['Mon/Wed/Fri Evenings']),
        ('user-4', 'Jessica P.', 'jessica@example.com', 'user-4', 'Casual cyclist and weekend warrior. Let''s go for a ride!', 95, ARRAY['Sat/Sun Mornings']),
        ('user-5', 'Chris Evans', 'chris@example.com', 'user-5', 'Training for a marathon. Always looking for running partners.', 99, ARRAY['Anytime', 'Weekdays Evenings']),
        ('user-6', 'Mohd Nasar', 'mohdnasar0011@gmail.com', 'user-6', 'Software developer and fitness enthusiast. Ready to connect!', 97, ARRAY['Weekends', 'Evenings'])
        ON CONFLICT (id) DO NOTHING;
    `;
    console.log('Seeded users');

    // Seeding posts
    await sql`
        INSERT INTO posts (id, user_id, content, image_url, location_lat, location_lon, upvotes, created_at)
        VALUES
        ('post-1', 'user-1', 'Anyone up for a 5k run at Central Park tomorrow morning around 7 AM? Planning to take the main loop.', 'https://images.unsplash.com/photo-1545216560-0699022d5a53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxwYXJrJTIwcGF0aHxlbnwwfHx8fDE3NjYzMDUxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080', 40.785091, -73.968285, 12, NOW() - INTERVAL '5 minutes'),
        ('post-2', 'user-2', 'Looking for a gym partner at Equinox on 5th Ave. I usually go on weekdays after 6 PM. Focus on strength training.', NULL, NULL, NULL, 8, NOW() - INTERVAL '30 minutes'),
        ('post-3', 'user-3', 'Is the basketball court at Pier 2 usually crowded on Saturdays? Thinking of shooting some hoops.', 'https://images.unsplash.com/photo-1602357280104-742c517a1d82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxiYXNrZXRiYWxsJTIwY291cnR8ZW58MHx8fHwxNzY2MjkzNDk4fDA&ixlib=rb-4.1.0&q=80&w=1080', NULL, NULL, 5, NOW() - INTERVAL '2 hours')
        ON CONFLICT (id) DO NOTHING;
    `;
    console.log('Seeded posts');

    // Seeding comments
    await sql`
        INSERT INTO comments (post_id, user_id, content, created_at)
        VALUES
        ('post-1', 'user-2', 'I''m in! See you there.', NOW() - INTERVAL '4 minutes'),
        ('post-1', 'user-4', 'What''s the pace like?', NOW() - INTERVAL '3 minutes'),
        ('post-3', 'user-5', 'It can be, better to go early!', NOW() - INTERVAL '1 hour')
        ON CONFLICT (id) DO NOTHING;
    `;
    console.log('Seeded comments');

    // Seeding chat threads
    await sql`
        INSERT INTO chat_threads (id, name, is_group, last_message_content, last_message_timestamp, unread_count)
        VALUES
        ('user-2', 'Samantha G.', FALSE, 'Sure! Let''s do it.', NOW() - INTERVAL '2 hours', 0),
        ('user-4', 'Chris Evans', FALSE, 'Perfect, let''s aim for the 7 PM session.', NOW() - INTERVAL '1 day', 0),
        ('group-1', 'Saturday Run Group', TRUE, 'Alex: See you all at the park entrance!', NOW() - INTERVAL '15 minutes', 2)
        ON CONFLICT (id) DO NOTHING;
    `;
    console.log('Seeded chat threads');

    // Seeding chat participants
    await sql`
        INSERT INTO chat_thread_participants (thread_id, user_id)
        VALUES
        ('user-2', 'user-1'), ('user-2', 'user-2'),
        ('user-4', 'user-1'), ('user-4', 'user-5'),
        ('group-1', 'user-1'), ('group-1', 'user-2'), ('group-1', 'user-4')
        ON CONFLICT (thread_id, user_id) DO NOTHING;
    `;
    console.log('Seeded chat participants');

    // Seeding chat messages
    await sql`
        INSERT INTO chat_messages (thread_id, sender_id, content, created_at)
        VALUES
        ('user-2', 'user-2', 'Hey! Are you free for a workout this Friday?', NOW() - INTERVAL '2 hours 10 minutes'),
        ('user-2', 'user-1', 'Yeah, I should be. What time were you thinking?', NOW() - INTERVAL '2 hours 9 minutes'),
        ('user-2', 'user-2', 'How about around 6 PM at the usual spot?', NOW() - INTERVAL '2 hours 8 minutes'),
        ('user-2', 'user-1', 'Sure! Let''s do it.', NOW() - INTERVAL '2 hours 7 minutes')
        ON CONFLICT (id) DO NOTHING;
    `;
    console.log('Seeded chat messages');

    console.log('Database seeding complete.');
}

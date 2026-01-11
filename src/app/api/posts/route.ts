// src/app/api/posts/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { formatDistanceToNow } from 'date-fns';

// Get all posts
export async function GET() {
  try {
    const { rows } = await sql`
        SELECT p.*, u.id as author_id, u.name as author_name, u.email as author_email, u.avatar_id, u.bio, u.reliability_score, u.availability
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC;
    `;
    
    const posts = await Promise.all(rows.map(async (row) => {
        // Get comment count for each post
        const { rows: commentRows } = await sql`SELECT COUNT(*) FROM comments WHERE post_id = ${row.id};`;
        const commentCount = parseInt(commentRows[0].count, 10);
        
        return {
            id: row.id,
            content: row.content,
            imageUrl: row.image_url,
            upvotes: row.upvotes || 0,
            comments: commentCount,
            timestamp: formatDistanceToNow(new Date(row.created_at), { addSuffix: true }),
            location: row.location_lat ? { lat: row.location_lat, lon: row.location_lon } : undefined,
            author: {
                id: row.author_id,
                name: row.author_name,
                email: row.author_email,
                avatarId: row.avatar_id,
                bio: row.bio,
                reliabilityScore: row.reliability_score,
                availability: row.availability,
            }
        };
    }));

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Create a new post
export async function POST(request: Request) {
    try {
        const { content, imageUrl, userId, location } = await request.json();
        const id = `post-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        await sql`
            INSERT INTO posts (id, user_id, content, image_url, location_lat, location_lon)
            VALUES (${id}, ${userId}, ${content}, ${imageUrl}, ${location?.lat}, ${location?.lon});
        `;
        
        // Fetch the created post with author details to return
        const { rows: userRows } = await sql`SELECT * FROM users WHERE id = ${userId};`;

        const newPost = {
             id: id,
            author: userRows[0],
            userId: userId,
            content: content,
            imageUrl: imageUrl || undefined,
            createdAt: new Date().toISOString(),
            timestamp: 'Just now',
            upvotes: 0,
            downvotes: 0,
            comments: 0,
            commentsData: [],
            location: location || undefined,
        }

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// src/app/api/posts/[postId]/comments/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { formatDistanceToNow } from 'date-fns';


// Get all comments for a post
export async function GET(request: Request, { params }: { params: { postId: string } }) {
  try {
    const postId = params.postId;

    const { rows } = await sql`
      SELECT c.*, u.id as author_id, u.name as author_name, u.email as author_email, u.avatar_id, u.bio, u.reliability_score, u.availability
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ${postId}
      ORDER BY c.created_at ASC;
    `;
    
    const comments = rows.map(row => ({
        id: row.id,
        content: row.content,
        timestamp: formatDistanceToNow(new Date(row.created_at), { addSuffix: true }),
        author: {
            id: row.author_id,
            name: row.author_name,
            email: row.author_email,
            avatarId: row.avatar_id,
            bio: row.bio,
            reliabilityScore: row.reliability_score,
            availability: row.availability,
        }
    }));
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Add a new comment to a post
export async function POST(request: Request, { params }: { params: { postId: string } }) {
  try {
    const postId = params.postId;
    const { content, userId } = await request.json();

    const { rows } = await sql`
      INSERT INTO comments (post_id, user_id, content)
      VALUES (${postId}, ${userId}, ${content})
      RETURNING id, created_at;
    `;
    
    const commentId = rows[0].id;
    const createdAt = rows[0].created_at;

    // Fetch the author's details to return the full comment object
    const { rows: userRows } = await sql`SELECT * FROM users WHERE id = ${userId};`;

    const newComment = {
        id: commentId,
        content: content,
        timestamp: formatDistanceToNow(new Date(createdAt), { addSuffix: true }),
        author: userRows[0],
    };
    
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

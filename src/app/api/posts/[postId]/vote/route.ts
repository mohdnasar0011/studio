// src/app/api/posts/[postId]/vote/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { postId: string } }) {
  try {
    const postId = params.postId;
    const { userId, voteType } = await request.json();
    const voteValue = voteType === 'upvote' ? 1 : -1;

    // Record the user's vote
    await sql`
      INSERT INTO post_votes (user_id, post_id, vote_type)
      VALUES (${userId}, ${postId}, ${voteValue})
      ON CONFLICT (user_id, post_id) DO UPDATE SET vote_type = ${voteValue};
    `;

    // Recalculate the post's total upvotes
    const { rows } = await sql`
        SELECT SUM(vote_type) as total_votes
        FROM post_votes
        WHERE post_id = ${postId};
    `;
    
    const newUpvotes = rows[0].total_votes || 0;

    // Update the post's upvote count in the posts table
    await sql`
        UPDATE posts
        SET upvotes = ${newUpvotes}
        WHERE id = ${postId};
    `;

    return NextResponse.json({ success: true, newUpvotes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

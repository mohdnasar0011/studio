// src/app/api/match-actions/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, profileId, action } = await request.json();
    if (!userId || !profileId || !action) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await sql`
      INSERT INTO match_actions (user_id, profile_id, action)
      VALUES (${userId}, ${profileId}, ${action})
      ON CONFLICT (user_id, profile_id) DO UPDATE SET action = ${action};
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

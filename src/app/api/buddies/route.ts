// src/app/api/buddies/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, buddyId } = await request.json();
    if (!userId || !buddyId) {
        return NextResponse.json({ message: 'Missing userId or buddyId' }, { status: 400 });
    }

    // In a real app, you'd check if the relationship already exists
    await sql`
      INSERT INTO buddies (user_id, buddy_id)
      VALUES (${userId}, ${buddyId})
      ON CONFLICT (user_id, buddy_id) DO NOTHING;
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

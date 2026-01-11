// src/app/api/auth/signup/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Check if user already exists
    const { rows: existingUsers } = await sql`SELECT * FROM users WHERE email = ${email};`;
    if (existingUsers.length > 0) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }
    
    const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // In a real app, you would hash the password here
    const password_hash = password; // Storing plain text for now as it's a mock

    const { rows } = await sql`
      INSERT INTO users (id, name, email, password_hash, avatar_id, bio, reliability_score, availability)
      VALUES (${id}, ${name}, ${email}, ${password_hash}, 'user-1', 'New user, ready to connect!', 90, ARRAY['Weekends'])
      RETURNING id, name, email, avatar_id, bio, reliability_score, availability;
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

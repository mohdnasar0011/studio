// src/app/api/auth/login/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email) {
      // Handle Google Sign-in case (or any other OAuth) where we just find a default user for now
      const { rows } = await sql`SELECT * FROM users WHERE email = 'alex@example.com';`;
      if (rows.length === 0) return NextResponse.json({ message: 'Default user not found' }, { status: 404 });
      return NextResponse.json(rows[0]);
    }
    
    // In a real app, you'd also check the password
    const { rows } = await sql`SELECT * FROM users WHERE email = ${email};`;

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// src/app/api/auth/login/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // The Google sign-in simulation sends only an email.
    // The regular sign-in sends email and password.
    if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }
    
    // In a real app, you'd also check the password hash. For this mock, we just check if the user exists.
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

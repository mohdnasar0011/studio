// src/app/api/users/[userId]/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Get a single user's profile
export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { rows } = await sql`SELECT * FROM users WHERE id = ${params.userId};`;
    if (rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Update a user's profile
export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { bio, avatarId } = await request.json();
    
    // Build query dynamically based on what's provided
    let query = 'UPDATE users SET ';
    const values = [];
    let setClauses = [];

    if (bio !== undefined) {
      setClauses.push(`bio = $${values.length + 1}`);
      values.push(bio);
    }
    if (avatarId !== undefined) {
      setClauses.push(`avatar_id = $${values.length + 1}`);
      values.push(avatarId);
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    query += setClauses.join(', ');
    query += ` WHERE id = $${values.length + 1} RETURNING *;`;
    values.push(params.userId);

    // Using pg library format for parameterized queries
    const { rows } = await sql.query(query, values);
    
    if (rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

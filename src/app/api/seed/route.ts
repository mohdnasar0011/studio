// src/app/api/seed/route.ts
// This is a temporary development endpoint to set up your database schema and seed it with initial data.
import { createTables, seedData } from '@/lib/db-schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await createTables();
    await seedData();
    return NextResponse.json({ message: 'Database tables created and seeded successfully.' });
  } catch (error) {
    console.error('Database seeding failed:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

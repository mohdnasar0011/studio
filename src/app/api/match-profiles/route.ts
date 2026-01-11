// src/app/api/match-profiles/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { matchProfiles as mockProfiles } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }
    
    // In a real app, this query would be much more complex. It would involve:
    // - Geospatial queries to find users nearby.
    // - Filtering out users the current user has already seen/swiped on.
    // - Filtering out users who are already buddies.
    // - Matching based on preferences.
    // For now, we will return a shuffled list of all users except the current one.
    
    // Using mock data for now as the user profiles for matching are more detailed
    const profiles = mockProfiles.filter(p => p.id !== userId);

    return NextResponse.json(profiles);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// src/app/api/chat/threads/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { formatDistanceToNow } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    // This is a simplified query. A real implementation would be more complex,
    // especially for calculating participant details and unread counts.
    const { rows } = await sql`
        SELECT 
            ct.id,
            ct.name,
            ct.is_group,
            ct.last_message_content,
            ct.last_message_timestamp,
            ct.unread_count
        FROM chat_threads ct
        JOIN chat_thread_participants ctp ON ct.id = ctp.thread_id
        WHERE ctp.user_id = ${userId}
        ORDER BY ct.last_message_timestamp DESC;
    `;
    
    const threads = await Promise.all(rows.map(async (row) => {
        // Fetch participants for each thread
        const { rows: participantRows } = await sql`
            SELECT u.id, u.name, u.email, u.avatar_id, u.bio, u.reliability_score, u.availability FROM users u
            JOIN chat_thread_participants ctp ON u.id = ctp.user_id
            WHERE ctp.thread_id = ${row.id} AND ctp.user_id != ${userId};
        `;

        return {
            id: row.id,
            name: row.is_group ? row.name : (participantRows[0]?.name || 'Unknown User'),
            isGroup: row.is_group,
            participants: participantRows,
            lastMessage: {
                content: row.last_message_content,
                timestamp: formatDistanceToNow(new Date(row.last_message_timestamp), { addSuffix: true }),
            },
            unreadCount: row.unread_count || 0,
        };
    }));


    return NextResponse.json(threads);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// src/app/api/chat/threads/[threadId]/messages/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Get all messages for a thread
export async function GET(request: Request, { params }: { params: { threadId: string } }) {
  try {
    const threadId = params.threadId;
    
    // In a real app, threadId might be a numeric ID or a composite key.
    // For this app, we treat it as the other user's ID for 1-on-1 chats.
    // This is a simplified logic.
    const { rows } = await sql`
        SELECT * FROM chat_messages 
        WHERE thread_id = ${threadId}
        ORDER BY created_at ASC;
    `;
    
    // We map DB columns to frontend properties
    const messages = rows.map(row => ({
        id: row.id,
        senderId: row.sender_id,
        content: row.content,
        timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        threadId: row.thread_id
    }));

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Send a new message
export async function POST(request: Request, { params }: { params: { threadId: string } }) {
  try {
    const threadId = params.threadId;
    const { senderId, content } = await request.json();
    const timestamp = new Date().toISOString();

    const { rows } = await sql`
      INSERT INTO chat_messages (thread_id, sender_id, content)
      VALUES (${threadId}, ${senderId}, ${content})
      RETURNING id, created_at;
    `;

    const newMessage = {
        id: rows[0].id,
        threadId,
        senderId,
        content,
        timestamp: new Date(rows[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update the last message timestamp on the thread itself
    // (This part is simplified and might need more complex logic for group chats)
    await sql`
        UPDATE chat_threads
        SET last_message_content = ${content}, last_message_timestamp = ${timestamp}
        WHERE id = ${threadId};
    `;


    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useChatThreads } from '@/hooks/use-chat-threads';
import { getImageById } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Users, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';


const ChatThreadSkeleton = () => (
    <div className="flex items-center gap-4 p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
            <div className="flex justify-between">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/6" />
            </div>
            <Skeleton className="h-4 w-4/5" />
        </div>
    </div>
);

export default function ChatPage() {
  const { threads, isLoading, error, refetch } = useChatThreads();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div>
          <ChatThreadSkeleton />
          <ChatThreadSkeleton />
          <ChatThreadSkeleton />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-48 flex-col items-center justify-center gap-4 p-4 text-center">
            <h2 className="text-xl font-bold text-destructive">Oops!</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={refetch}>Try Again</Button>
        </div>
      );
    }
    
    if (threads.length === 0) {
        return (
             <div className="flex h-48 flex-col items-center justify-center gap-2 p-4 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                <h2 className="text-xl font-bold">No Messages</h2>
                <p className="text-muted-foreground">Your new matches and conversations will appear here.</p>
            </div>
        )
    }

    return (
      <div className="divide-y">
        {threads.map((thread) => {
          // Placeholder logic for avatars. In a real app, participant data would be richer.
          const participant = thread.isGroup ? null : thread.participants[0];
          const avatar = thread.isGroup
            ? getImageById("group-avatar")
            : participant ? getImageById(participant.avatarId || 'user-1') : null;
          
          const href = thread.isGroup ? `/chat/group/${thread.id}` : `/chat/${participant?.id}`;

          const formattedTimestamp = (timestamp: string) => {
            try {
              const date = new Date(timestamp);
              // Check if date is valid
              if (isNaN(date.getTime())) {
                return timestamp; // return original string if invalid
              }
              return formatDistanceToNow(date, { addSuffix: true });
            } catch (e) {
              return timestamp; // fallback to original timestamp
            }
          }

          return (
            <Link href={href} key={thread.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
              <Avatar className="h-12 w-12 border">
                {avatar ? <AvatarImage src={avatar.imageUrl} alt={thread.name} data-ai-hint={avatar.imageHint} /> : null}
                <AvatarFallback>
                  {thread.isGroup ? <Users className="h-6 w-6 text-muted-foreground" /> : thread.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold truncate">{thread.name}</p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{formattedTimestamp(thread.lastMessage.timestamp)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className={cn(
                    "text-sm text-muted-foreground truncate",
                    thread.unreadCount > 0 && "font-semibold text-foreground"
                  )}>
                    {thread.lastMessage.content}
                  </p>
                  {thread.unreadCount > 0 && (
                    <div className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground ml-auto">
                      {thread.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }


  return (
    <div>
      <header className="sticky top-0 z-10 border-b bg-background/80 p-4 backdrop-blur-sm">
        <h1 className="text-2xl font-bold">Messages</h1>
      </header>
      {renderContent()}
    </div>
  );
}

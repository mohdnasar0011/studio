import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatThreads } from "@/lib/data";
import { getImageById } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div>
      <header className="sticky top-0 z-10 border-b bg-background/80 p-4 backdrop-blur-sm">
        <h1 className="text-2xl font-bold">Messages</h1>
      </header>
      <div className="divide-y">
        {chatThreads.map((thread) => {
          const participant = thread.isGroup ? null : thread.participants[0];
          const avatar = thread.isGroup
            ? getImageById("group-avatar")
            : participant ? getImageById(participant.avatarId) : null;
          
          return (
            <Link href="#" key={thread.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
              <Avatar className="h-12 w-12 border">
                {avatar ? <AvatarImage src={avatar.imageUrl} alt={thread.name} data-ai-hint={avatar.imageHint} /> : null}
                <AvatarFallback>
                  {thread.isGroup ? <Users className="h-6 w-6 text-muted-foreground" /> : thread.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold truncate">{thread.name}</p>
                  <p className="text-xs text-muted-foreground">{thread.lastMessage.timestamp}</p>
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
    </div>
  );
}

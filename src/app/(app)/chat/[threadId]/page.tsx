
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { users, type User, type ChatMessage } from '@/lib/data';
import { getMessages, sendMessage } from '@/lib/api';
import { getImageById } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ChevronLeft, Send, Smile, Loader2, MessageCircle } from 'lucide-react';


const getParticipantFromThreadId = (threadId: string): User | null => {
    // This is a mock logic. In real app, you'd fetch thread details
    // to find the participant who is not the current user.
    const currentUser = localStorage.getItem('userId');
    const participant = users.find(u => u.id === threadId);
    if (participant && participant.id !== currentUser) {
        return participant;
    }
    // Fallback or more complex logic might be needed
    return participant || null;
}


export default function ChatConversationPage({ params }: { params: { threadId: string } }) {
  const router = useRouter();
  const { threadId } = params;

  const [isLoading, setIsLoading] = useState(true);
  const [participant, setParticipant] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAndSetData = async () => {
        setIsLoading(true);
        if (threadId) {
            const convoParticipant = getParticipantFromThreadId(threadId);
            setParticipant(convoParticipant);

            const fetchedMessages = await getMessages(threadId);
            setMessages(fetchedMessages);
            setIsLoading(false);
        }
    };
    fetchAndSetData();
  }, [threadId]);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
         viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !currentUserId) return;
    setIsSending(true);

    const tempId = `msg-${Date.now()}`;
    const messageToSend: ChatMessage = {
      id: tempId,
      threadId,
      senderId: currentUserId,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Optimistically update the UI
    setMessages(prev => [...prev, messageToSend]);
    setNewMessage('');

    try {
        await sendMessage(threadId, messageToSend.content);
        // We can optionally refetch messages here to confirm, but for mock, this is fine
    } catch (error) {
        console.error("Failed to send message:", error);
        // Revert optimistic update on failure
        setMessages(prev => prev.filter(m => m.id !== tempId));
        setNewMessage(messageToSend.content);
    } finally {
        setIsSending(false);
    }
  };

  const participantImage = participant ? getImageById(participant.avatarId) : null;

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>;
  }
  
  if (!participant) {
    return <div className="flex h-full items-center justify-center text-destructive">Conversation not found.</div>;
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/95 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push('/chat')}>
          <ChevronLeft />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            {participantImage && <AvatarImage src={participantImage.imageUrl} alt={participant.name} data-ai-hint={participantImage.imageHint} />}
            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{participant.name}</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            const msgParticipant = isMe ? null : users.find(u => u.id === msg.senderId);
            const msgAvatar = msgParticipant ? getImageById(msgParticipant.avatarId) : null;

            return (
              <div key={msg.id} className={cn("flex items-end gap-2", isMe ? "justify-end" : "justify-start")}>
                {!isMe && (
                   <Avatar className="h-6 w-6 border">
                      {msgAvatar && <AvatarImage src={msgAvatar.imageUrl} alt={msgParticipant?.name} data-ai-hint={msgAvatar.imageHint} />}
                      <AvatarFallback className="text-xs">{msgParticipant?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div className={cn(
                  "max-w-xs rounded-2xl px-4 py-2.5 sm:max-w-sm md:max-w-md",
                  isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                )}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            );
          })}
           {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground p-8">
              <MessageCircle size={48} className="mb-4" />
              <p className="font-semibold">Start a conversation</p>
              <p className="text-sm">Send a message to {participant.name}.</p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Input */}
      <footer className="sticky bottom-0 border-t bg-background p-2">
         <div className="relative flex items-center">
            <Button variant="ghost" size="icon" className="absolute left-1">
                <Smile className="text-muted-foreground" />
                <span className="sr-only">Add emoji</span>
            </Button>
            <Input
                placeholder="Type a message..."
                className="h-11 flex-1 rounded-full border-input bg-muted pl-12 pr-20 text-base focus-visible:ring-1"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSend()}
            />
            <Button 
                size="icon" 
                className="absolute right-1 h-9 w-9 rounded-full bg-primary"
                onClick={handleSend}
                disabled={isSending || !newMessage.trim()}
            >
                {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">Send</span>
            </Button>
         </div>
      </footer>
    </div>
  );
}

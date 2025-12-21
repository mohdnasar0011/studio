'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { users, type User } from '@/lib/data';
import { getImageById } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ChevronLeft, Send, Smile, Loader2 } from 'lucide-react';

// Mock data for a single chat conversation
const getMockConversation = (userId: string) => {
  const otherUser = users.find(u => u.id === userId) || users[1];
  return {
    participant: otherUser,
    messages: [
      { id: 'msg-1', senderId: otherUser.id, content: "Hey! Are you free for a workout this Friday?", timestamp: "10:30 AM" },
      { id: 'msg-2', senderId: 'user-1', content: "Yeah, I should be. What time were you thinking?", timestamp: "10:31 AM" },
      { id: 'msg-3', senderId: otherUser.id, content: "How about around 6 PM at the usual spot?", timestamp: "10:32 AM" },
    ],
  };
};

type Message = {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
};

export default function ChatConversationPage() {
  const router = useRouter();
  const params = useParams();
  const threadId = params.threadId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [participant, setParticipant] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate fetching conversation data
    if (threadId) {
      const convo = getMockConversation(threadId);
      setParticipant(convo.participant);
      setMessages(convo.messages);
      setIsLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    // Simulate typing indicator from the other user
    const typingTimeout = setTimeout(() => setIsTyping(Math.random() > 0.5), Math.random() * 3000 + 1000);
    return () => clearTimeout(typingTimeout);
  }, [messages]);
  
  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
    }
  }, [messages]);


  const handleSend = () => {
    if (!newMessage.trim()) return;
    setIsSending(true);

    const messageToSend: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'user-1', // Assuming current user is 'user-1'
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Simulate sending message
    setTimeout(() => {
      setMessages(prev => [...prev, messageToSend]);
      setNewMessage('');
      setIsSending(false);
    }, 500);
  };

  const participantImage = participant ? getImageById(participant.avatarId) : null;

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>;
  }
  
  if (!participant) {
    return <div className="flex h-full items-center justify-center text-destructive">Conversation not found.</div>;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
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
            {isTyping && <p className="text-xs text-primary animate-pulse">typing...</p>}
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === 'user-1';
            return (
              <div key={msg.id} className={cn("flex items-end gap-2", isMe ? "justify-end" : "justify-start")}>
                {!isMe && (
                   <Avatar className="h-6 w-6 border">
                      {participantImage && <AvatarImage src={participantImage.imageUrl} alt={participant.name} data-ai-hint={participantImage.imageHint} />}
                      <AvatarFallback className="text-xs">{participant.name.charAt(0)}</AvatarFallback>
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
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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

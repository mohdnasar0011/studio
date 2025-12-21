
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { users, type User, chatThreads } from '@/lib/data';
import { getImageById } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ChevronLeft, Send, Smile, Loader2 } from 'lucide-react';

type Message = {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
};

// In a real app, this would come from an API call
const getConversationByParticipantId = (userId: string) => {
    const thread = chatThreads.find(t => !t.isGroup && t.participants.some(p => p.id === userId));
    const participant = users.find(u => u.id === userId);

    if (!participant) return null;

    if (thread) {
         // Create a more detailed message history for the mock if a thread exists
        const messages = [
            { id: 'msg-1', senderId: participant.id, content: "Hey! Are you free for a workout this Friday?", timestamp: "10:30 AM" },
            { id: 'msg-2', senderId: 'user-1', content: "Yeah, I should be. What time were you thinking?", timestamp: "10:31 AM" },
            { id: 'msg-3', senderId: participant.id, content: "How about around 6 PM at the usual spot?", timestamp: "10:32 AM" },
            { id: 'msg-4', senderId: 'user-1', content: thread.lastMessage.content, timestamp: thread.lastMessage.timestamp },
        ];

        return {
            participant,
            messages,
        }
    }
    
    // If no thread exists, create a new, empty conversation
    return {
        participant,
        messages: [],
    }
}


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
    // Simulate fetching conversation data based on the participant ID in the URL
    if (threadId) {
      const convo = getConversationByParticipantId(threadId);
      if (convo) {
        setParticipant(convo.participant);
        setMessages(convo.messages);
      }
      setIsLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    // Simulate typing indicator from the other user
    if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if(lastMessage.senderId === 'user-1') { // if I sent the last message
             const typingTimeout = setTimeout(() => {
                setIsTyping(true);
                const replyTimeout = setTimeout(() => setIsTyping(false), 2500); // Stop typing after a bit
                return () => clearTimeout(replyTimeout);
            }, 1000);
             return () => clearTimeout(typingTimeout);
        }
    }
  }, [messages]);
  
  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
         viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages, isTyping]);


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

      // Simulate a reply
      setTimeout(() => {
        if(participant) {
            setIsTyping(false);
            const replyMessage: Message = {
                id: `msg-${Date.now()}`,
                senderId: participant.id,
                content: "Sounds good!",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, replyMessage]);
        }
      }, 2000); // Wait 2 seconds before replying

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
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/95 p-2 backdrop-blur-sm">
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

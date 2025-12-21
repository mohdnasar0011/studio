
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { useComments } from '@/hooks/use-comments';
import { getImageById } from '@/lib/placeholder-images';
import { formatDistanceToNow } from 'date-fns';
import { getCurrentUser, type User } from '@/lib/data';
import Link from 'next/link';

export default function CommentsSheet({
  postId,
  initialCommentCount,
  children,
  onCommentAdded,
}: {
  postId: string;
  initialCommentCount: number;
  children: React.ReactNode;
  onCommentAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { comments, isLoading, addComment } = useComments(open ? postId : null);
  const [newComment, setNewComment] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setCurrentUser(getCurrentUser());
    }
  }, [open]);

  useEffect(() => {
    // Scroll to the bottom when new comments are added
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
         viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [comments]);


  const currentUserImage = currentUser ? getImageById(currentUser.avatarId) : null;

  const handleSend = async () => {
    if (!newComment.trim() || isSending) return;
    setIsSending(true);
    try {
      await addComment(newComment);
      setNewComment('');
      onCommentAdded();
    } catch (error) {
      console.error("Failed to add comment:", error);
      // Optionally show a toast to the user
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-w-md h-full flex flex-col p-0">
        <SheetHeader className="p-4 border-b text-center">
          <SheetTitle>Comments ({comments.length > 0 ? comments.length : initialCommentCount})</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
                {isLoading && comments.length === 0 && (
                    <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                    </div>
                )}
                {!isLoading && comments.length === 0 && (
                     <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground p-8">
                        <MessageCircle size={48} className="mb-4" />
                        <p className="font-semibold">No comments yet</p>
                        <p className="text-sm">Be the first to comment.</p>
                    </div>
                )}
                {comments.map((comment) => {
                    const authorImage = getImageById(comment.author.avatarId);
                    return (
                    <div key={comment.id} className="flex items-start gap-3">
                        <Link href={`/profile/${comment.author.id}`}>
                            <Avatar className="h-9 w-9 border">
                                {authorImage && <AvatarImage src={authorImage.imageUrl} alt={comment.author.name} data-ai-hint={authorImage.imageHint} />}
                                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div className="flex-1">
                            <div>
                                <Link href={`/profile/${comment.author.id}`} className="font-semibold text-sm hover:underline">{comment.author.name}</Link>
                                <span className="ml-2 text-sm text-muted-foreground">{comment.content}</span>
                            </div>
                             <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    );
                })}
            </div>
        </ScrollArea>
        
        {currentUser && <footer className="sticky bottom-0 border-t bg-background p-2">
            <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                    {currentUserImage && <AvatarImage src={currentUserImage.imageUrl} alt={currentUser.name} data-ai-hint={currentUserImage.imageHint} />}
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Input
                    placeholder="Add a comment..."
                    className="h-10 flex-1 rounded-full border-input bg-muted"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSend()}
                    disabled={isSending}
                />
                <Button 
                    size="icon" 
                    className="h-9 w-9 rounded-full bg-primary shrink-0"
                    onClick={handleSend}
                    disabled={isSending || !newComment.trim()}
                >
                    {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    <span className="sr-only">Send Comment</span>
                </Button>
            </div>
        </footer>}
      </SheetContent>
    </Sheet>
  );
}

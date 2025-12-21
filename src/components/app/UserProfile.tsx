
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/data';
import { addBuddy } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  getImageById,
} from '@/lib/placeholder-images';
import { Settings, ChevronLeft, MessageCircle, UserPlus, Loader2, Edit, PlusSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePosts } from '@/hooks/use-posts';
import { useMemo, useState } from 'react';
import CreatePost from './CreatePost';
import EditProfileDialog from './EditProfileDialog';
import FeedPostCard from './FeedPostCard';


const StatItem = ({ value, label }: { value: string | number; label: string }) => (
    <div className="flex flex-col items-center">
        <p className="text-lg font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
    </div>
)

export default function UserProfile({
  user: initialUser,
  isCurrentUser,
}: {
  user: User;
  isCurrentUser: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState(initialUser);
  const { posts, isLoading: isLoadingPosts, refetch: refetchPosts } = usePosts();
  const [isAdding, setIsAdding] = useState(false);
  
  const userPosts = useMemo(() => {
    return posts.filter(post => post.author.id === user.id);
  }, [posts, user.id]);

  const userImage = getImageById(user.avatarId);

  const handleAddBuddy = async () => {
    setIsAdding(true);
    try {
      await addBuddy(user.id);
      toast({
        title: 'Buddy Added!',
        description: `You are now buddies with ${user.name}.`,
      });
    } catch (error) {
      console.error("Failed to add buddy", error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not add buddy. Please try again.',
      });
    } finally {
      setIsAdding(false);
    }
  }

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };
  
  return (
    <div className="h-full">
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-4 backdrop-blur-sm">
         {!isCurrentUser && (
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2"
                onClick={() => router.back()}
            >
                <ChevronLeft />
                <span className="sr-only">Back</span>
            </Button>
         )}
        <h1 className="flex-1 text-center text-xl font-bold">
          {user.name}
        </h1>
        {isCurrentUser && (
          <Link href="/settings" passHref>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <Settings />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
        )}
      </header>

      <div className="p-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 flex-shrink-0 border-2">
            {userImage && <AvatarImage src={userImage.imageUrl} alt={user.name} data-ai-hint={userImage.imageHint} />}
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 grid-cols-2 gap-4">
              <StatItem value={userPosts.length} label="Posts" />
              <StatItem value={5} label="Buddies" />
          </div>
        </div>
        
        <div className="mt-4">
            <p className="mt-1 text-sm text-muted-foreground">
                {user.bio}
            </p>
        </div>

        {isCurrentUser ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
                <EditProfileDialog user={user} onProfileUpdate={handleProfileUpdate}>
                    <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                </EditProfileDialog>
                 <CreatePost onPostCreated={refetchPosts}>
                    <Button size="sm" className="w-full">
                        <PlusSquare className="mr-2 h-4 w-4" /> Create Post
                    </Button>
                </CreatePost>
            </div>
        ) : (
            <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" onClick={handleAddBuddy} disabled={isAdding}>
                    {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />} 
                    {isAdding ? 'Adding...' : 'Add Buddy'}
            </Button>
            <Link href={`/chat/${user.id}`} passHref>
                <Button className="w-full" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" /> Message
                </Button>
            </Link>
            </div>
        )}
      </div>

      <div className="border-t">
        {isLoadingPosts ? (
           <div className="flex justify-center p-8">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        ) : (
          <div className="space-y-4 p-4">
            {userPosts.map((post) => (
                <FeedPostCard key={post.id} post={post} />
            ))}
            {userPosts.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    <p className="font-semibold">No posts yet</p>
                    {isCurrentUser ? (
                      <p className="text-sm">Click "Create Post" to share your first activity.</p>
                    ) : (
                      <p className="text-sm">This user hasn't posted anything.</p>
                    )}
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

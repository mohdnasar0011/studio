'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/data';
import {
  getImageById,
  placeholderImages,
} from '@/lib/placeholder-images';
import { Dumbbell, Settings, Users, ChevronLeft, MessageCircle, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserProfile({
  user,
  isCurrentUser,
}: {
  user: User;
  isCurrentUser: boolean;
}) {
  const router = useRouter();
  const userImage = getImageById(user.avatarId);
  const galleryImages = placeholderImages.filter((p) =>
    p.id.startsWith('post-')
  );

  return (
    <div className="h-full">
      <header className="relative p-4">
        <h1 className="text-center text-2xl font-bold">
          {isCurrentUser ? 'Profile' : user.name}
        </h1>
        {isCurrentUser ? (
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
        ) : (
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
      </header>

      <div className="flex flex-col items-center p-6 pt-4">
        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
          {userImage && <AvatarImage src={userImage.imageUrl} alt={user.name} data-ai-hint={userImage.imageHint} />}
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
        <p className="text-muted-foreground">New York, NY</p>
      </div>
      
      {!isCurrentUser && (
        <div className="grid grid-cols-2 gap-4 px-6 pb-4">
           <Button variant="outline" size="lg" onClick={() => console.log('Add Buddy clicked for', user.name)}>
                <UserPlus className="mr-2 h-5 w-5" /> Add Buddy
           </Button>
           <Link href={`/chat/${user.id}`} passHref>
            <Button className="w-full" size="lg">
                <MessageCircle className="mr-2 h-5 w-5" /> Message
            </Button>
           </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-px border-y bg-border">
        <div className="flex flex-col items-center justify-center gap-1 bg-background p-4">
          <Users className="h-6 w-6 text-primary" />
          <p className="text-sm font-semibold">5</p>
          <p className="text-xs text-muted-foreground">Buddies</p>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold">Bio</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Morning runner and evening lifter. Looking for a buddy to keep me
          accountable for my weekend long runs!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-1 p-1">
        {galleryImages.map((img) => (
          <div key={img.id} className="relative aspect-square">
            <Image
              src={img.imageUrl}
              alt={img.description}
              fill
              className="rounded-md object-cover"
              data-ai-hint={img.imageHint}
              sizes="(max-width: 768px) 33vw, 120px"
            />
          </div>
        ))}
        {galleryImages.slice(0, 1).map((img) => (
          <div key={img.id + 'd'} className="relative aspect-square">
            <Image
              src={img.imageUrl}
              alt={img.description}
              fill
              className="rounded-md object-cover"
              data-ai-hint={img.imageHint}
              sizes="(max-width: 768px) 33vw, 120px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

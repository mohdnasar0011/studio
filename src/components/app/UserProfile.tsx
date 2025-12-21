'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/data';
import {
  getImageById,
  placeholderImages,
} from '@/lib/placeholder-images';
import { Settings, ChevronLeft, MessageCircle, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const StatItem = ({ value, label }: { value: string | number; label: string }) => (
    <div className="flex flex-col items-center">
        <p className="text-lg font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
    </div>
)

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
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-4 backdrop-blur-sm">
        <h1 className="flex-1 text-center text-xl font-bold">
          {isCurrentUser ? user.name : user.name}
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

      <div className="p-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 flex-shrink-0 border-2">
            {userImage && <AvatarImage src={userImage.imageUrl} alt={user.name} data-ai-hint={userImage.imageHint} />}
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 grid-cols-2 gap-4">
              <StatItem value={7} label="Posts" />
              <StatItem value={5} label="Buddies" />
          </div>
        </div>
        
        <div className="mt-4">
            <h2 className="text-sm font-semibold">{user.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
                Morning runner and evening lifter. Looking for a buddy to keep me
                accountable for my weekend long runs!
            </p>
        </div>

        {!isCurrentUser && (
            <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" onClick={() => console.log('Add Buddy clicked for', user.name)}>
                    <UserPlus className="mr-2 h-4 w-4" /> Add Buddy
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
        <div className="grid grid-cols-3 gap-1 p-1">
            {galleryImages.map((img) => (
            <div key={img.id} className="relative aspect-square">
                <Image
                src={img.imageUrl}
                alt={img.description}
                fill
                className="object-cover"
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
                className="object-cover"
                data-ai-hint={img.imageHint}
                sizes="(max-width: 768px) 33vw, 120px"
                />
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}

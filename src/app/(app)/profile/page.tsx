'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/data';
import {
  getImageById,
  placeholderImages,
} from '@/lib/placeholder-images';
import { Award, Dumbbell, Settings } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  // For demonstration, we'll use the first user.
  const user = currentUser;
  const userImage = getImageById(user.avatarId);
  // Get some images for the gallery grid
  const galleryImages = placeholderImages.filter((p) =>
    p.id.startsWith('post-')
  );

  return (
    <div className="h-full">
      <header className="relative p-4">
        <h1 className="text-center text-2xl font-bold">Profile</h1>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2"
          onClick={() => console.log('Edit Profile clicked')}
        >
          <Settings />
          <span className="sr-only">Edit Profile</span>
        </Button>
      </header>

      <div className="flex flex-col items-center p-6 pt-4">
        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
          {userImage && <AvatarImage src={userImage.imageUrl} alt={user.name} data-ai-hint={userImage.imageHint} />}
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
        <p className="text-muted-foreground">New York, NY</p>
      </div>

      <div className="grid grid-cols-3 gap-px border-y bg-border">
        <div className="flex flex-col items-center justify-center gap-1 bg-background p-4">
          <Award className="h-6 w-6 text-primary" />
          <p className="text-sm font-semibold">{user.reliabilityScore}%</p>
          <p className="text-xs text-muted-foreground">Reliability</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 bg-background p-4">
          <Dumbbell className="h-6 w-6 text-primary" />
          <p className="text-sm font-semibold">12</p>
          <p className="text-xs text-muted-foreground">Workouts</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 bg-background p-4">
          <Badge
            variant="default"
            className="h-6 w-6 items-center justify-center bg-primary p-0"
          >
            5
          </Badge>
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
         {galleryImages.slice(0,1).map((img) => (
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


'use client';

import { useState } from 'react';
import FeedPostCard from '@/components/app/FeedPostCard';
import { Button } from '@/components/ui/button';
import { usePosts } from '@/hooks/use-posts';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare } from 'lucide-react';

const FeedSkeleton = () => (
  <div className="space-y-4">
    <div className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
    </div>
  </div>
);

export default function FeedPage() {
  const { posts, isLoading, error } = usePosts();

  const renderContent = () => {
    if (isLoading && posts.length === 0) {
      return <FeedSkeleton />;
    }
    if (error) {
      return <div className="text-center text-destructive">{error}</div>;
    }
    
    if (posts.length === 0) {
      return (
        <div className="flex h-48 flex-col items-center justify-center gap-2 p-4 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-xl font-bold">No Posts Yet</h2>
          <p className="text-muted-foreground">Be the first to share your workout plans!</p>
        </div>
      );
    }
    return posts.map((post) => (
      <FeedPostCard key={post.id} post={post} />
    ));
  }

  return (
    <div className="container mx-auto max-w-4xl">
       <header className="flex items-center justify-between border-b bg-background p-4 -mx-4 px-4">
        <h1 className="text-2xl font-bold">Fit Buddy</h1>
      </header>

      <div className="space-y-4 py-4">
        {renderContent()}
      </div>
    </div>
  );
}

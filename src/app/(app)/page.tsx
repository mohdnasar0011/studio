
'use client';

import { useState, useEffect } from 'react';
import FeedPostCard from '@/components/app/FeedPostCard';
import CreatePost from '@/components/app/CreatePost';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FeedPost } from '@/lib/data';
import { usePosts } from '@/hooks/use-posts';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
  const { posts, isLoading, error, refetch } = usePosts();
  const [activeTab, setActiveTab] = useState("nearby");

  const handlePostCreated = () => {
    // Force a refetch after a post is created
    refetch();
  };

  const popularPosts = [...posts].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="container mx-auto max-w-4xl">
       <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="sticky top-0 z-10 -mx-4 bg-background/80 px-4 py-2 backdrop-blur-sm">
        <div className="relative mx-auto flex w-full max-w-xs items-center justify-center">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
          <CreatePost onPostCreated={handlePostCreated}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <Plus />
              <span className="sr-only">Create Post</span>
            </Button>
          </CreatePost>
        </div>
      

        <div className="space-y-4 py-4">
            <TabsContent value="nearby" className="m-0 space-y-4">
              {isLoading && !posts.length ? (
                <FeedSkeleton />
              ) : error ? (
                <div className="text-center text-destructive">{error}</div>
              ) : (
                posts.map((post) => (
                  <FeedPostCard key={post.id} post={post} />
                ))
              )}
            </TabsContent>
            <TabsContent value="popular" className="m-0 space-y-4">
              {isLoading && !posts.length ? (
                <FeedSkeleton />
              ) : error ? (
                <div className="text-center text-destructive">{error}</div>
              ) : (
                popularPosts.map((post) => (
                    <FeedPostCard key={post.id} post={post} />
                  ))
              )}
            </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

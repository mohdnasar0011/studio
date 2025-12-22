
'use client';

import { useState } from 'react';
import FeedPostCard from '@/components/app/FeedPostCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState("nearby");

  const popularPosts = [...posts].sort((a, b) => b.upvotes - a.upvotes);

  const renderContent = (feed: typeof posts) => {
    if (isLoading && feed.length === 0) {
      return <FeedSkeleton />;
    }
    if (error) {
      return <div className="text-center text-destructive">{error}</div>;
    }
    if (feed.length === 0) {
      return (
        <div className="flex h-48 flex-col items-center justify-center gap-2 p-4 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-xl font-bold">No Posts Yet</h2>
          <p className="text-muted-foreground">Be the first to share your workout plans!</p>
        </div>
      );
    }
    return feed.map((post) => (
      <FeedPostCard key={post.id} post={post} />
    ));
  }

  return (
    <div className="container mx-auto max-w-4xl">
       <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="sticky top-0 z-10 -mx-4 bg-background/80 px-4 py-2 backdrop-blur-sm">
        <div className="relative mx-auto flex w-full max-w-xs items-center justify-center">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
        </div>
      

        <div className="space-y-4 py-4">
            <TabsContent value="nearby" className="m-0 space-y-4">
              {renderContent(posts)}
            </TabsContent>
            <TabsContent value="popular" className="m-0 space-y-4">
              {renderContent(popularPosts)}
            </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

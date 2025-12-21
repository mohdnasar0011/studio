'use client';

import FeedPostCard from '@/components/app/FeedPostCard';
import CreatePost from '@/components/app/CreatePost';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { feedPosts } from '@/lib/data';
import { Plus } from 'lucide-react';

export default function FeedPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="sticky top-0 z-10 -mx-4 bg-background/80 px-4 py-2 backdrop-blur-sm">
        <div className="relative mx-auto flex w-full max-w-xs items-center justify-center">
          <Tabs defaultValue="nearby" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
          </Tabs>
          <CreatePost>
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
      </div>

      <div className="space-y-4 py-4">
        {/* For simplicity, both tabs show the same content. */}
        <Tabs defaultValue="nearby">
          <TabsContent value="nearby" className="m-0 space-y-4">
            {feedPosts.map((post) => (
              <FeedPostCard key={post.id} post={post} />
            ))}
          </TabsContent>
          <TabsContent value="popular" className="m-0 space-y-4">
            {feedPosts
              .slice()
              .reverse()
              .map((post) => (
                <FeedPostCard key={post.id} post={post} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

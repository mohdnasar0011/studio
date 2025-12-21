import type { FeedPost } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getImageById } from "@/lib/placeholder-images";
import { ArrowDown, ArrowUp, MessageSquare } from "lucide-react";
import Image from "next/image";

export default function FeedPostCard({ post }: { post: FeedPost }) {
  // The author object might come from the backend directly
  const authorImage = post.author?.avatarId ? getImageById(post.author.avatarId) : null;
  const postImage = post.imageUrl ? { imageUrl: post.imageUrl, imageHint: 'post image' } : null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4">
        {post.author ? (
          <>
            <Avatar className="h-10 w-10 border">
              {authorImage && <AvatarImage src={authorImage.imageUrl} alt={post.author.name} data-ai-hint={authorImage.imageHint}/>}
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold">{post.author.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
          </>
        ) : (
          <div className="flex-1">
             <p className="text-sm font-semibold">Anonymous</p>
             <p className="text-xs text-muted-foreground">{post.timestamp}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="mb-4 text-sm leading-relaxed">{post.content}</p>
        {postImage && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border">
            <Image 
              src={postImage.imageUrl} 
              alt="Post image" 
              fill 
              className="object-cover" 
              data-ai-hint={postImage.imageHint}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/50 p-2 px-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
            <ArrowUp className="h-4 w-4" />
            <span>{post.upvotes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments} Comments</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

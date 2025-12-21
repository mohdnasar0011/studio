'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Camera, MapPin, Dumbbell, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { createPost } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function CreatePost({
  children,
  onPostCreated,
}: {
  children: React.ReactNode;
  onPostCreated: () => void;
}) {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [open, setOpen] = useState(false);

  const handlePost = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast({
        variant: 'destructive',
        title: 'Not Signed In',
        description: 'You must be signed in to create a post.',
      });
      return;
    }
    if (!postContent.trim() && !imagePreview) return;

    setIsPosting(true);
    try {
      // In a real app, you'd upload the image to a storage service first.
      // For now, we'll use the placeholder URL directly if it exists.
      const imageUrl = imagePreview;

      await createPost({
        content: postContent,
        imageUrl: imageUrl,
        userId: userId,
      });

      toast({
        title: 'Post Created!',
        description: 'Your post is now live.',
      });
      onPostCreated(); // Notify parent that a post was created
      setPostContent('');
      setImagePreview(null);
      setOpen(false); // Close the dialog
    } catch (error) {
      console.error('Failed to create post:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not create your post. Please try again.',
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageSelect = () => {
    // This is a placeholder for actual image upload logic.
    console.log('Add photo clicked');
    setImagePreview('https://picsum.photos/seed/post-new/600/400');
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder="What's the plan? (e.g., Running 5k at 6pm)"
            className="min-h-[120px] border-none text-base shadow-none focus-visible:ring-0"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />

          {imagePreview && (
            <div className="relative mt-4">
              <img
                src={imagePreview}
                alt="Selected media"
                className="w-full rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-7 w-7"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col items-stretch gap-2 sm:flex-col sm:space-x-0">
          <div className="flex justify-between border-t pt-2">
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={handleImageSelect}>
                <Camera />
                <span className="sr-only">Add Photo</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log('Add location clicked')}
              >
                <MapPin />
                <span className="sr-only">Add Location</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log('Tag activity clicked')}
              >
                <Dumbbell />
                <span className="sr-only">Tag Activity</span>
              </Button>
            </div>
            
            <Button
              onClick={handlePost}
              disabled={isPosting || (!postContent.trim() && !imagePreview)}
            >
              {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPosting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

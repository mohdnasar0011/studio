
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Camera, MapPin, Dumbbell, X, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { createPost } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/data';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePost = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
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
      // For now, we'll use the base64 data URL directly if it exists.
      const imageUrl = imagePreview;

      await createPost({
        content: postContent,
        imageUrl: imageUrl,
        userId: currentUser.id,
      });

      toast({
        title: 'Post Created!',
        description: 'Your post is now live.',
      });
      
      // Reset state and close dialog
      setPostContent('');
      setImagePreview(null);
      setOpen(false); 
      
      // Notify parent to refetch posts
      onPostCreated();
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
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    // Also reset the file input
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
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
                className="w-full rounded-lg object-cover"
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
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <Button variant="ghost" size="icon" onClick={handleImageSelect}>
                <Camera />
                <span className="sr-only">Add Photo</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast({ title: 'Not Implemented', description: 'Location tagging is not yet available.'})}
              >
                <MapPin />
                <span className="sr-only">Add Location</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast({ title: 'Not Implemented', description: 'Activity tagging is not yet available.'})}
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

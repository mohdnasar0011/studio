
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Camera, MapPin, Dumbbell, X, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { createPost } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/data';
import { cn } from '@/lib/utils';

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
  const [location, setLocation] = useState<{ lat: number, lon: number} | null>(null);
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
      await createPost({
        content: postContent,
        imageUrl: imagePreview,
        userId: currentUser.id,
        location,
      });

      toast({
        title: 'Post Created!',
        description: 'Your post is now live.',
      });
      
      // Reset state and close dialog
      setPostContent('');
      setImagePreview(null);
      setLocation(null);
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

  const handleLocationTag = () => {
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        toast({
          title: 'Location Added',
          description: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          variant: 'destructive',
          title: 'Location Error',
          description: 'Could not retrieve your location. Please ensure you have granted permission.',
        });
      }
    );
  };


  const removeImage = () => {
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) { // Reset state on close
            setPostContent('');
            setImagePreview(null);
            setLocation(null);
        }
    }}>
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
              <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLocationTag}
                        >
                            <MapPin className={cn(location && "text-green-500")}/>
                            <span className="sr-only">Add Location</span>
                        </Button>
                    </TooltipTrigger>
                    {location && <TooltipContent><p>Location Added</p></TooltipContent>}
                </Tooltip>
              </TooltipProvider>
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

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
import {
  Camera,
  MapPin,
  Dumbbell,
  X,
} from 'lucide-react';
import { useState } from 'react';

export default function CreatePost({ children }: { children: React.ReactNode }) {
  const [postContent, setPostContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handlePost = () => {
    console.log('Post submitted:', { content: postContent, image: imagePreview });
    // Here you would typically call an API to create the post
    // For now, we just log it.
  };

  const handleImageSelect = () => {
    // This is a placeholder. In a real app, you'd open a file picker.
    console.log('Add photo clicked');
    // For demonstration, we'll set a placeholder image.
    setImagePreview('https://picsum.photos/seed/post-new/600/400');
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle>Create Post</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel</span>
            </Button>
          </DialogClose>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={handleImageSelect}
              >
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
            <DialogClose asChild>
              <Button
                onClick={handlePost}
                disabled={!postContent.trim() && !imagePreview}
              >
                Post
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

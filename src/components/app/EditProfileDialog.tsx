
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/data';
import { getImageById } from '@/lib/placeholder-images';
import { updateProfile } from '@/lib/api';

export default function EditProfileDialog({
  user,
  children,
  onProfileUpdate
}: {
  user: User;
  children: React.ReactNode;
  onProfileUpdate: (updatedUser: User) => void;
}) {
  const { toast } = useToast();
  const [bio, setBio] = useState(user.bio);
  const [avatarId, setAvatarId] = useState(user.avatarId);
  const [imagePreview, setImagePreview] = useState<string | null>(getImageById(user.avatarId)?.imageUrl || null);
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Reset state if user prop changes
    setBio(user.bio);
    setAvatarId(user.avatarId);
    setImagePreview(getImageById(user.avatarId)?.imageUrl || null);
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await updateProfile(user.id, { bio, avatarId });
      
      toast({
        title: 'Profile Saved!',
        description: 'Your profile has been updated.',
      });
      onProfileUpdate(updatedUser); // Notify parent component
      setOpen(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not save your profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = () => {
    const mockImages = ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'];
    const currentIndex = mockImages.indexOf(avatarId);
    const nextIndex = (currentIndex + 1) % mockImages.length;
    const nextAvatarId = mockImages[nextIndex];
    setAvatarId(nextAvatarId);
    setImagePreview(getImageById(nextAvatarId)?.imageUrl || null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
            <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24 border-2">
                    {imagePreview && <AvatarImage src={imagePreview} alt={user.name} />}
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="link" onClick={handleImageChange}>Change profile photo</Button>
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    className="min-h-[100px]"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>
        </div>

        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

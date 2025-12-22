'use client';

import UserProfile from '@/components/app/UserProfile';
import { users, type User } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would have a hook like `useCurrentUser()`
    // For this mock, we get the user ID from localStorage
    const currentUserId = localStorage.getItem('userId');
    if (currentUserId) {
        getUserProfile(currentUserId).then(foundUser => {
          if (foundUser) {
            setUser(foundUser);
          }
          setLoading(false);
        }).catch(err => {
          console.error(err);
          setLoading(false);
        })
    } else {
      // If no user is logged in, maybe redirect or show a message.
      // For now, we'll just stop loading.
      setLoading(false);
    }
  }, []);
  

  if (loading) {
     return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold">Not Logged In</h2>
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    )
  }

  return <UserProfile user={user} isCurrentUser={true} />;
}

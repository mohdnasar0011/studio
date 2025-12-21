'use client';

import UserProfile from '@/components/app/UserProfile';
import { type User } from '@/lib/data';
import { getUserProfile } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// In a real app, this would be a proper user type
// type User = {
//   id: string;
//   name: string;
//   avatarId: string;
// };

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const userId = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      // In a real app, you would fetch this user's data from an API
      // For now, we simulate this with a timeout and data from `lib/data`
      getUserProfile(userId).then(foundUser => {
        if (foundUser) {
          setUser(foundUser);
        }
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      })
    }
  }, [userId]);


  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
      return <div className="flex h-full items-center justify-center text-destructive">User not found.</div>
  }

  return <UserProfile user={user} isCurrentUser={false} />;
}

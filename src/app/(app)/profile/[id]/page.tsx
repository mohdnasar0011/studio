'use client';

import UserProfile from '@/components/app/UserProfile';
import { users } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// In a real app, this would be a proper user type
type User = {
  id: string;
  name: string;
  avatarId: string;
};

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      // In a real app, you would fetch this user's data from an API
      // For now, we simulate this with a timeout and data from `lib/data`
      setTimeout(() => {
        const foundUser = users.find((u) => u.id === userId);
        if (foundUser) {
          setUser(foundUser);
        }
        setLoading(false);
      }, 300); // Simulate network delay
    }
  }, [userId]);


  if (loading || !user) {
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

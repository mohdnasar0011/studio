'use client';

import UserProfile from '@/components/app/UserProfile';
import { users, type User } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would have a hook like `useCurrentUser()`
    // For this mock, we get the user ID from localStorage
    const currentUserId = localStorage.getItem('userId');
    if (currentUserId) {
        const foundUser = users.find(u => u.id === currentUserId);
        setUser(foundUser || null);
    }
    setLoading(false);
  }, []);
  

  if (loading || !user) {
     return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <UserProfile user={user} isCurrentUser={true} />;
}

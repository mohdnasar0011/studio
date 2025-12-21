'use client';

import UserProfile from '@/components/app/UserProfile';
import { currentUser } from '@/lib/data';
import { users } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  // In a real app, you would have a hook like `useCurrentUser()`
  // For this mock, we just use the imported currentUser.
  const user = users.find(u => u.id === 'user-1'); // Assuming 'user-1' is the current user

  if (!user) {
     return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <UserProfile user={user} isCurrentUser={true} />;
}

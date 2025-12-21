'use client';

import UserProfile from '@/components/app/UserProfile';
import { users } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  
  // In a real app, you would fetch this user's data from an API
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <UserProfile user={user} isCurrentUser={false} />;
}

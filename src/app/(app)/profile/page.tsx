'use client';

import UserProfile from '@/components/app/UserProfile';
import { currentUser } from '@/lib/data';

export default function ProfilePage() {
  return <UserProfile user={currentUser} isCurrentUser={true} />;
}

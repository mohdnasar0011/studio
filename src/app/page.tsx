
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for user session on the client side
    if (typeof window !== 'undefined') {
        const userId = localStorage.getItem('userId');
        if (userId) {
          router.replace('/feed');
        } else {
          router.replace('/login');
        }
    }
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

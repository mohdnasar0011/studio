
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/app/BottomNav';
import { usePosts } from '@/hooks/use-posts';
import { Loader2 } from 'lucide-react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { refetch } = usePosts();
  const router = useRouter();
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.replace('/login');
    }
  }, [router]);

  // Check for auth status on client to prevent flash of unauthenticated content
  if (typeof window !== 'undefined' && !localStorage.getItem('userId')) {
     return (
        <div className="flex h-dvh w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
     )
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-md flex-col bg-background shadow-2xl">
      <main className="flex-1 overflow-y-auto pb-20 hide-scrollbar">
        {children}
      </main>
      <BottomNav onPostCreated={refetch} />
    </div>
  );
}

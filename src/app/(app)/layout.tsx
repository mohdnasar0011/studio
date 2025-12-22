
'use client';

import BottomNav from '@/components/app/BottomNav';
import { usePosts } from '@/hooks/use-posts';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { refetch } = usePosts();
  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-md flex-col bg-background shadow-2xl">
      <main className="flex-1 overflow-y-auto pb-20 hide-scrollbar">
        {children}
      </main>
      <BottomNav onPostCreated={refetch} />
    </div>
  );
}

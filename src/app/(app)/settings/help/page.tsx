'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HelpCenterPage() {
  const router = useRouter();

  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-4 backdrop-blur-sm">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
          <ChevronLeft />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 text-center text-2xl font-bold">Help Center</h1>
        <div className="w-10"></div>
      </header>
      <div className="p-6 text-center">
        <p className="text-muted-foreground">The help center will be available here.</p>
      </div>
    </div>
  );
}

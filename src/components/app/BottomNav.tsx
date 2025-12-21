
'use client';

import { Flame, Globe, MessageCircle, User, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import CreatePost from './CreatePost';
import { Button } from '../ui/button';

const navItems = [
  { href: '/', label: 'Feed', icon: Globe },
  { href: '/match', label: 'Match', icon: Flame },
  { href: 'create-post', label: 'Post', icon: Plus },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav({ onPostCreated }: { onPostCreated: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-10 border-t bg-background/95 backdrop-blur-sm">
      <div className="flex h-20 items-center justify-around pb-4">
        {navItems.map((item) => {
          if (item.href === 'create-post') {
            return (
              <CreatePost key={item.href} onPostCreated={onPostCreated}>
                <Button
                  variant="ghost"
                  className="flex h-16 w-16 -translate-y-4 flex-col items-center justify-center gap-1.5 rounded-full bg-primary p-2 text-primary-foreground shadow-lg"
                >
                  <item.icon className="h-7 w-7" />
                  <span className="sr-only">{item.label}</span>
                </Button>
              </CreatePost>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-md p-2 text-xs font-medium transition-colors w-20',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  Shield,
  UserSwitch,
  Flag,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SettingsItem = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
  >
    <div className="flex items-center gap-4">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span>{label}</span>
    </div>
    <ChevronRight className="h-5 w-5 text-muted-foreground" />
  </button>
);

export default function SettingsPage() {
  const router = useRouter();

  const handleSignOut = () => {
    console.log('Signing out...');
    router.push('/login');
  };

  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-4 backdrop-blur-sm">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
          <ChevronLeft />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 text-center text-2xl font-bold">Settings</h1>
        <div className="w-10"></div>
      </header>

      <div className="divide-y">
        <div className="py-2">
          <h2 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
            Account
          </h2>
          <SettingsItem icon={UserSwitch} label="Switch Account" onClick={() => console.log('Switch account')} />
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-4 p-4 text-left text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="py-2">
          <h2 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
            Support
          </h2>
          <SettingsItem icon={HelpCircle} label="Help Center" onClick={() => console.log('Help Center')} />
          <SettingsItem icon={Flag} label="Report a Problem" onClick={() => console.log('Report problem')} />
        </div>

        <div className="py-2">
          <h2 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
            General
          </h2>
          <SettingsItem icon={Bell} label="Notifications" onClick={() => console.log('Notifications')} />
          <SettingsItem icon={Shield} label="Privacy" onClick={() => console.log('Privacy')} />
        </div>
      </div>
    </div>
  );
}

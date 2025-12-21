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
  Users,
  Flag,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';


const SettingsItem = ({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
}) => {
  const content = (
    <div
      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span>{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </div>
  );

  if (href) {
    return (
      <Link href={href} passHref>
        {content}
      </Link>
    );
  }
  
  // Use a button for onClick to be semantically correct
  return <button className="w-full" onClick={onClick}>{content}</button>;
};

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
        await signOut();
        toast({
            title: 'Signed Out',
            description: 'You have been successfully signed out.',
        });
        router.push('/login');
        router.refresh();
    } catch (error) {
        console.error("Sign out failed:", error);
        toast({
            variant: "destructive",
            title: "Sign Out Failed",
            description: "Could not sign you out. Please try again."
        });
    } finally {
        setIsSigningOut(false);
    }
  }

  const handleAuthRedirect = () => {
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
          <SettingsItem icon={Users} label="Switch Account" onClick={handleAuthRedirect} />
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex w-full items-center gap-4 p-4 text-left text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
          >
            {isSigningOut ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
            <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
          </button>
        </div>

        <div className="py-2">
          <h2 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
            Support
          </h2>
          <SettingsItem icon={HelpCircle} label="Help Center" href="/settings/help" />
          <SettingsItem icon={Flag} label="Report a Problem" onClick={() => toast({ title: 'Not Implemented', description: 'Reporting a problem is not yet available.'})} />
        </div>

        <div className="py-2">
          <h2 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
            General
          </h2>
          <SettingsItem icon={Bell} label="Notifications" href="/settings/notifications" />
          <SettingsItem icon={Shield} label="Privacy" href="/settings/privacy" />
        </div>
      </div>
    </div>
  );
}

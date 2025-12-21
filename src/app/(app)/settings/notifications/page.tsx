'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const NotificationSetting = ({
  label,
  description,
  initialChecked = false,
}: {
  label: string;
  description: string;
  initialChecked?: boolean;
}) => {
  const [isChecked, setIsChecked] = useState(initialChecked);
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex-1 pr-4">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={isChecked}
        onCheckedChange={setIsChecked}
        aria-label={label}
      />
    </div>
  );
};

export default function NotificationsSettingsPage() {
  const router = useRouter();

  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-4 backdrop-blur-sm">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
          <ChevronLeft />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 text-center text-2xl font-bold">Notifications</h1>
        <div className="w-10"></div>
      </header>
      <div className="divide-y">
        <div className="py-2">
          <NotificationSetting
            label="Push Notifications"
            description="Receive push notifications on your device."
            initialChecked={true}
          />
        </div>
        <div className="py-2">
           <h2 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
            Matching
          </h2>
          <NotificationSetting
            label="New Matches"
            description="Notify me when I get a new match."
            initialChecked={true}
          />
          <NotificationSetting
            label="New Messages"
            description="Notify me when I receive a new message."
            initialChecked={true}
          />
        </div>
        <div className="py-2">
           <h2 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
            Activities
          </h2>
          <NotificationSetting
            label="Workout Reminders"
            description="Remind me about upcoming planned workouts."
          />
          <NotificationSetting
            label="New Post Likes"
            description="Notify me when someone likes my post."
            initialChecked={true}
          />
        </div>
      </div>
    </div>
  );
}

'use client';

import MatchCard from '@/components/app/MatchCard';
import { Button } from '@/components/ui/button';
import { matchProfiles } from '@/lib/data';
import { Check, X } from 'lucide-react';
import { useState, useMemo } from 'react';

type CardStatus = 'initial' | 'dismissing' | 'accepting';

export default function MatchPage() {
  const [profiles, setProfiles] = useState(matchProfiles);
  const [status, setStatus] = useState<CardStatus>('initial');

  const currentProfile = useMemo(() => (profiles.length > 0 ? profiles[0] : null), [profiles]);
  
  const handleAction = (action: 'accept' | 'dismiss') => {
    if (status !== 'initial' || !currentProfile) return;
    
    setStatus(action === 'accept' ? 'accepting' : 'dismissing');
    
    setTimeout(() => {
      setProfiles(prev => prev.slice(1));
      setStatus('initial');
    }, 300); // Match transition duration
  };
  
  const getCardStyle = (index: number) => {
    if (index === 0) { // Top card
      switch (status) {
        case 'accepting':
          return { transform: 'translateX(100%) rotate(15deg)', opacity: 0 };
        case 'dismissing':
          return { transform: 'translateX(-100%) rotate(-15deg)', opacity: 0 };
        default:
          return { transform: 'translateX(0) rotate(0deg) scale(1)', opacity: 1 };
      }
    }
    if (index === 1) { // Card underneath
      return { transform: 'translateX(0) rotate(0deg) scale(0.95)', opacity: 1};
    }
    return { transform: 'scale(0.9)', opacity: 0 };
  }

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-muted/20">
      <div className="relative h-[calc(100%-150px)] w-full flex-grow flex items-center justify-center">
        {!currentProfile ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
                <h2 className="text-2xl font-bold">That's everyone for now!</h2>
                <p className="text-muted-foreground">Check back later for new buddies.</p>
                <Button onClick={() => setProfiles(matchProfiles)}>Start Over</Button>
            </div>
        ) : (
            <div className="relative w-full h-full max-w-sm p-4 pt-8 flex items-center justify-center">
            {profiles.slice(0, 2).reverse().map((profile, index) => (
                <div 
                    key={profile.id}
                    className="absolute w-full h-full transition-all duration-300 ease-in-out p-4"
                    style={getCardStyle(1 - index)} // 1 for top card, 0 for bottom
                >
                    <MatchCard profile={profile} />
                </div>
            ))}
            </div>
        )}
      </div>
      
      <div className="absolute bottom-8 z-20 flex w-full justify-center gap-4 p-4">
        <Button onClick={() => handleAction('dismiss')} variant="outline" size="icon" className="h-20 w-20 rounded-full border-4 border-red-500 bg-white text-red-500 hover:bg-red-50 shadow-2xl disabled:opacity-50" disabled={status !== 'initial'}>
          <X className="h-10 w-10" />
        </Button>
        <Button onClick={() => handleAction('accept')} variant="outline" size="icon" className="h-20 w-20 rounded-full border-4 border-green-500 bg-white text-green-500 hover:bg-green-50 shadow-2xl disabled:opacity-50" disabled={status !== 'initial'}>
          <Check className="h-10 w-10" />
        </Button>
      </div>
    </div>
  );
}

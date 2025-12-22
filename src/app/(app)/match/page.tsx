
'use client';

import MatchCard from '@/components/app/MatchCard';
import { Button } from '@/components/ui/button';
import { useMatchProfiles } from '@/hooks/use-match-profiles';
import { useState, useMemo, useRef, PointerEvent, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, X, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { recordMatchAction } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


const MatchCardSkeleton = () => (
    <div className="relative w-full h-full max-w-sm p-4 pt-8 flex items-center justify-center">
        <div className="absolute w-full h-full p-4">
            <Card className="h-full w-full overflow-hidden rounded-2xl shadow-xl">
                 <Skeleton className="h-full w-full" />
            </Card>
        </div>
    </div>
)

export default function MatchPage() {
  const { profiles: initialProfiles, isLoading, error, refetch } = useMatchProfiles();
  const [profiles, setProfiles] = useState<typeof initialProfiles>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    setProfiles(initialProfiles);
  }, [initialProfiles]);

  const [status, setStatus] = useState<CardStatus>('initial');
  const cardRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState>({ startX: 0, currentX: 0, isDragging: false });
  
  const currentProfile = useMemo(() => (profiles.length > 0 ? profiles[0] : null), [profiles]);
  
  const handleAction = (action: 'accept' | 'dismiss') => {
    if (status !== 'initial' || !currentProfile) return;

    // Call the mock API
    recordMatchAction(currentProfile.id, action).catch(err => {
        console.error(`Failed to ${action} profile:`, err);
        // We can show a toast, but for now we'll let it fail silently
        // in the background as the UI will proceed anyway.
    });

    if (action === 'accept') {
        toast({
            title: `You liked ${currentProfile.name}!`,
            description: "If they like you back, it's a match!",
        });
    }
    
    setStatus(action === 'accept' ? 'accepting' : 'dismissing');
    
    setTimeout(() => {
      setProfiles(prev => prev.slice(1));
      setStatus('initial');
      if (cardRef.current) {
        cardRef.current.style.transform = '';
        cardRef.current.style.transition = '';
      }
    }, 300); // Match transition duration
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (status !== 'initial') return;
    dragState.current = {
      ...dragState.current,
      startX: e.clientX,
      isDragging: true,
    };
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDragging || !cardRef.current) return;
    dragState.current.currentX = e.clientX;
    const diff = dragState.current.currentX - dragState.current.startX;
    cardRef.current.style.transform = `translateX(${diff}px) rotate(${diff / 20}deg)`;
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);

    dragState.current.isDragging = false;
    if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    }

    const diff = dragState.current.currentX - dragState.current.startX;
    if (Math.abs(diff) > 100) {
      if (diff > 0) {
        handleAction('accept');
      } else {
        handleAction('dismiss');
      }
    } else {
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(0) rotate(0deg) scale(1)';
      }
    }
    dragState.current = { startX: 0, currentX: 0, isDragging: false };
  };
  
  const getCardStyle = (index: number) => {
    if (index === 0) { // Top card
      if (status === 'accepting') {
          return { transform: 'translateX(100%) rotate(15deg)', opacity: 0 };
      }
      if (status === 'dismissing') {
          return { transform: 'translateX(-100%) rotate(-15deg)', opacity: 0 };
      }
      return { transform: 'translateX(0) rotate(0deg) scale(1)', opacity: 1, touchAction: 'pan-y' };
    }
    if (index === 1) { // Card underneath
      return { transform: `translateX(0) rotate(0deg) scale(${status === 'initial' ? 0.95 : 1})`, opacity: 1, transition: 'transform 0.3s, opacity 0.3s'};
    }
    return { transform: 'scale(0.9)', opacity: 0 };
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
        return (
             <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
                <h2 className="text-2xl font-bold text-destructive">Oops!</h2>
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={refetch}>Try Again</Button>
            </div>
        )
    }

    if (!currentProfile) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
                <h2 className="text-2xl font-bold">That's everyone for now!</h2>
                <p className="text-muted-foreground">Check back later for new buddies.</p>
                <Button onClick={refetch}>Start Over</Button>
            </div>
        );
    }
    
    return (
        <div className="relative w-full h-full max-w-sm flex items-center justify-center">
        {profiles.slice(0, 2).reverse().map((profile, index) => (
            <div 
                key={profile.id}
                className="absolute w-full h-full transition-all duration-300 ease-in-out"
                style={getCardStyle(1 - index)} // 1 for top card, 0 for bottom
                {...(index === 1 && { // Apply gesture handlers to the top card only
                    ref: cardRef,
                    onPointerDown: handlePointerDown,
                    onPointerMove: handlePointerMove,
                    onPointerUp: handlePointerUp,
                    onPointerCancel: handlePointerUp, // End drag if OS cancels pointer
                })}
            >
                <MatchCard profile={profile} />
            </div>
        ))}
        </div>
    );
  }


  return (
    <div className="relative flex h-full flex-col items-center justify-between overflow-hidden bg-muted/20">
      <header className="absolute top-0 z-10 p-4 text-center">
        <h1 className="text-2xl font-bold">Find Your Buddy</h1>
      </header>

      <div className="relative h-full w-full flex-grow flex items-center justify-center">
        {renderContent()}
      </div>

       <footer className="w-full p-4 z-10">
        {currentProfile && (
            <div className="flex items-center justify-center gap-4">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-16 w-16 rounded-full border-2 bg-white shadow-lg hover:bg-red-100"
                    onClick={() => handleAction('dismiss')}
                    disabled={status !== 'initial'}
                >
                    <X className="h-8 w-8 text-red-500" />
                </Button>
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-16 w-16 rounded-full border-2 bg-white shadow-lg hover:bg-green-100"
                    onClick={() => handleAction('accept')}
                    disabled={status !== 'initial'}
                >
                    <Heart className="h-8 w-8 text-green-500" />
                </Button>
            </div>
        )}
         <p className="text-center text-sm text-muted-foreground mt-4">Swipe right to connect, left to pass</p>
      </footer>
    </div>
  );
}

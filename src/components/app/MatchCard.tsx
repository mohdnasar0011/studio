import type { MatchProfile } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getImageById } from "@/lib/placeholder-images";
import Image from "next/image";

export default function MatchCard({ profile }: { profile: MatchProfile }) {
  const profileImage = getImageById(profile.avatarId);
  return (
    <Card className="h-full w-full overflow-hidden rounded-2xl shadow-xl">
      <div className="relative h-full w-full">
        {profileImage && (
          <Image 
            src={profileImage.imageUrl} 
            alt={profile.name} 
            fill 
            className="object-cover" 
            data-ai-hint={profileImage.imageHint}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/0" />

        <div className="absolute bottom-0 left-0 right-0 flex h-full flex-col justify-end p-6 text-white">
            <div className="space-y-4">
                <div className="text-shadow">
                    <h2 className="text-3xl font-bold">{profile.name}, {profile.age}</h2>
                    <p className="text-lg opacity-90">{profile.distance} away</p>
                </div>
              <ScrollArea className="h-32 w-full pr-4">
                <div className="space-y-4 text-white/90">
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-white/70">My Goal</h3>
                    <p>{profile.goal}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-white/70">Preferred Time</h3>
                    <p>{profile.preferredTime}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-white/70">Pace/Level</h3>
                    <p>{profile.pace}</p>
                  </div>
                </div>
              </ScrollArea>
            </div>
        </div>
      </div>
    </Card>
  );
}

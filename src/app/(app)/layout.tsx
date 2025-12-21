import BottomNav from '@/components/app/BottomNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
      <main className="flex-1 overflow-y-auto pb-20 hide-scrollbar">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

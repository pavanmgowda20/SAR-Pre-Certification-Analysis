
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { AppHeader } from '@/components/app-header';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex flex-col h-screen">
        <header className="py-5 px-4 md:px-8 border-b">
          <div className="container mx-auto flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 flex flex-col gap-8">
              <Skeleton className="h-[500px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-[800px] w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <Image
        src="https://images.unsplash.com/photo-1541890372-3512816b8a28?q=80&w=1920"
        alt="3D Aircraft Watermark"
        fill
        className="object-contain object-center opacity-5"
        data-ai-hint="aircraft schematic"
      />
      <div className="relative z-10 flex flex-col flex-1">
        <AppHeader />
        {children}
      </div>
    </div>
  );
}

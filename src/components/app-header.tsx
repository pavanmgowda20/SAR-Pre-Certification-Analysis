import { Radio, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useUser, useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const { user } = useUser();
  const { auth } = useFirebase();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <header className="py-5 px-4 md:px-8 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 no-print">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-3">
          <Radio className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            SAR Pre-Certification Analysis
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <UserIcon />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
              <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

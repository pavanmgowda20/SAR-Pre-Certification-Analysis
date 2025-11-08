
'use client';

import { useUser, useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppHeader } from '@/components/app-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useUser();
  const { auth } = useFirebase();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 p-4 md:p-8 container mx-auto">
        <Card className="max-w-md mx-auto">
          <CardHeader className="items-center text-center">
             <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'} />
              <AvatarFallback className="text-3xl">
                {user ? getInitials(user.displayName) : <UserIcon />}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{user?.displayName ?? 'User Profile'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <div>
              <p className="font-semibold">User ID</p>
              <p className="text-muted-foreground text-sm">{user?.uid}</p>
            </div>
            <Button onClick={handleSignOut} variant="destructive" className="w-full mt-4">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

'use client';

import { useUser, useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppHeader } from '@/components/app-header';

export default function ProfilePage() {
  const { user } = useUser();
  const { auth } = useFirebase();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 p-4 md:p-8 container mx-auto">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
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
            <Button onClick={handleSignOut} variant="destructive" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

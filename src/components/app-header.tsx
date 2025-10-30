import { ShieldCheck } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-5 px-4 md:px-8 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 no-print">
      <div className="container mx-auto flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          SARPreCertify
        </h1>
      </div>
    </header>
  );
}

'use client';

import Navigation from '@/components/layout/Navigation';
import BartenderRushMode from '@/components/games/BartenderRushMode';

export default function BartenderRushPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="py-8">
        <BartenderRushMode />
      </main>
    </div>
  );
}

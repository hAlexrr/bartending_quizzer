'use client';

import Navigation from '@/components/layout/Navigation';
import PouringPracticeSimulator from '@/components/games/PouringPracticeSimulator';

export default function PouringPracticePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="py-8">
        <PouringPracticeSimulator />
      </main>
    </div>
  );
}

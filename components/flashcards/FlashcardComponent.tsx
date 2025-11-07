'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flashcard } from '@/types';
import Badge from '@/components/ui/Badge';

interface FlashcardComponentProps {
  flashcard: Flashcard;
  onFlip?: () => void;
}

export default function FlashcardComponent({ flashcard, onFlip }: FlashcardComponentProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  const difficultyColors = {
    1: 'success' as const,
    2: 'warning' as const,
    3: 'danger' as const,
  };

  const difficultyLabels = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard',
  };

  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto">
      <motion.div
        className="relative w-full h-96 cursor-pointer"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-2xl p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <Badge variant="default" className="bg-white/20 text-white backdrop-blur-sm">
                {flashcard.category.toUpperCase()}
              </Badge>
              {flashcard.difficulty && (
                <Badge variant={difficultyColors[flashcard.difficulty]}>
                  {difficultyLabels[flashcard.difficulty]}
                </Badge>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center leading-relaxed">
                {flashcard.front}
              </h2>
            </div>

            <div className="text-center">
              <p className="text-white/80 text-sm">Click to reveal answer</p>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl shadow-2xl p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex gap-2 flex-wrap">
                {flashcard.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="default"
                    size="sm"
                    className="bg-white/20 text-white backdrop-blur-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-y-auto">
              <p className="text-xl md:text-2xl text-white text-center leading-relaxed">
                {flashcard.back}
              </p>
            </div>

            <div className="text-center space-y-2">
              {flashcard.reviewCount > 0 && (
                <p className="text-white/70 text-sm">
                  Reviewed {flashcard.reviewCount} times | Accuracy:{' '}
                  {flashcard.reviewCount > 0
                    ? Math.round((flashcard.correctCount / flashcard.reviewCount) * 100)
                    : 0}
                  %
                </p>
              )}
              <p className="text-white/80 text-sm">Click to flip back</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard } from '@/types';
import FlashcardComponent from './FlashcardComponent';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { ChevronLeft, ChevronRight, Check, X, Shuffle } from 'lucide-react';
import { updateFlashcardReview, updateFlashcardConfidence } from '@/lib/storage';

interface FlashcardStudySessionProps {
  flashcards: Flashcard[];
  onComplete?: (results: { correct: number; total: number }) => void;
}

export default function FlashcardStudySession({
  flashcards,
  onComplete,
}: FlashcardStudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyCards, setStudyCards] = useState(flashcards);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentCard = studyCards[currentIndex];
  const progress = ((currentIndex + 1) / studyCards.length) * 100;

  const handleShuffle = () => {
    const shuffled = [...studyCards].sort(() => Math.random() - 0.5);
    setStudyCards(shuffled);
    setCurrentIndex(0);
    setCorrectCount(0);
    setAnswered(false);
  };

  const handleNext = () => {
    if (currentIndex < studyCards.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
    } else {
      // Session complete
      onComplete?.({ correct: correctCount, total: studyCards.length });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
      setAnswered(false);
    }
  };

  const handleAnswer = (confidenceLevel: 1 | 2 | 3 | 4 | 5) => {
    if (!answered) {
      setAnswered(true);
      const correct = confidenceLevel >= 3; // Consider 3+ as "correct"
      if (correct) {
        setCorrectCount(correctCount + 1);
      }
      updateFlashcardReview(currentCard.id, correct);
      updateFlashcardConfidence(currentCard.id, confidenceLevel);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === '1') handleAnswer(1);
      if (e.key === '2') handleAnswer(2);
      if (e.key === '3') handleAnswer(3);
      if (e.key === '4') handleAnswer(4);
      if (e.key === '5') handleAnswer(5);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, answered]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Card {currentIndex + 1} of {studyCards.length}
          </span>
          <span>
            Correct: {correctCount} / {currentIndex + (answered ? 1 : 0)}
          </span>
        </div>
        <ProgressBar progress={progress} color="primary" height="md" />
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <FlashcardComponent flashcard={currentCard} />
        </motion.div>
      </AnimatePresence>

      {/* Confidence Rating Buttons */}
      {!answered ? (
        <div className="space-y-3">
          <p className="text-center text-gray-600 font-medium">How well do you know this?</p>
          <div className="grid grid-cols-5 gap-2">
            <Button
              variant="danger"
              size="lg"
              onClick={() => handleAnswer(1)}
              className="flex flex-col items-center gap-1 py-4"
            >
              <span className="text-xl">😰</span>
              <span className="text-xs">Need to Learn</span>
              <span className="text-xs font-bold">(1)</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleAnswer(2)}
              className="flex flex-col items-center gap-1 py-4 bg-orange-100 hover:bg-orange-200 text-orange-800"
            >
              <span className="text-xl">😕</span>
              <span className="text-xs">Getting It</span>
              <span className="text-xs font-bold">(2)</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleAnswer(3)}
              className="flex flex-col items-center gap-1 py-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
            >
              <span className="text-xl">😐</span>
              <span className="text-xs">Pretty Good</span>
              <span className="text-xs font-bold">(3)</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleAnswer(4)}
              className="flex flex-col items-center gap-1 py-4 bg-blue-100 hover:bg-blue-200 text-blue-800"
            >
              <span className="text-xl">😊</span>
              <span className="text-xs">Confident</span>
              <span className="text-xs font-bold">(4)</span>
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={() => handleAnswer(5)}
              className="flex flex-col items-center gap-1 py-4"
            >
              <span className="text-xl">😎</span>
              <span className="text-xs">Mastered!</span>
              <span className="text-xs font-bold">(5)</span>
            </Button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-lg text-gray-600 mb-4">
            {correctCount > 0 && currentIndex === studyCards.length - 1
              ? 'Great job! Click Next to see your results.'
              : 'Click Next to continue'}
          </p>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </Button>

        <Button
          variant="secondary"
          onClick={handleShuffle}
          className="flex items-center gap-2"
        >
          <Shuffle className="w-5 h-5" />
          Shuffle
        </Button>

        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!answered}
          className="flex items-center gap-2"
        >
          {currentIndex === studyCards.length - 1 ? 'Finish' : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>Keyboard Shortcuts:</p>
        <p>
          Arrow Keys: Navigate | 1-5: Confidence Level
        </p>
      </div>
    </div>
  );
}

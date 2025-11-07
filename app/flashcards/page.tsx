'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import FlashcardStudySession from '@/components/flashcards/FlashcardStudySession';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getFlashcards, addExperiencePoints } from '@/lib/storage';
import { Flashcard } from '@/types';
import { BookOpen, Play, Filter, Trophy } from 'lucide-react';

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isStudying, setIsStudying] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionResults, setSessionResults] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    loadFlashcards();
  }, []);

  useEffect(() => {
    filterFlashcards();
  }, [flashcards, selectedCategory]);

  const loadFlashcards = () => {
    const cards = getFlashcards();
    setFlashcards(cards);
  };

  const filterFlashcards = () => {
    if (selectedCategory === 'all') {
      setFilteredCards(flashcards);
    } else {
      setFilteredCards(flashcards.filter((card) => card.category === selectedCategory));
    }
  };

  const categories = [
    { id: 'all', name: 'All Cards', icon: '📚' },
    { id: 'recipe', name: 'Recipes', icon: '🍹' },
    { id: 'technique', name: 'Techniques', icon: '🎯' },
    { id: 'terminology', name: 'Terminology', icon: '📖' },
    { id: 'measurement', name: 'Measurements', icon: '📏' },
    { id: 'ingredient', name: 'Ingredients', icon: '🧊' },
  ];

  const handleStartStudy = () => {
    if (filteredCards.length === 0) return;
    setIsStudying(true);
    setSessionComplete(false);
  };

  const handleSessionComplete = (results: { correct: number; total: number }) => {
    setSessionResults(results);
    setSessionComplete(true);
    setIsStudying(false);

    // Award XP based on performance
    const xpEarned = results.correct * 10;
    addExperiencePoints(xpEarned);
  };

  const handleStartNew = () => {
    setSessionComplete(false);
    loadFlashcards();
  };

  if (isStudying) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="py-8">
          <FlashcardStudySession
            flashcards={filteredCards}
            onComplete={handleSessionComplete}
          />
        </main>
      </div>
    );
  }

  if (sessionComplete) {
    const percentage = (sessionResults.correct / sessionResults.total) * 100;
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8">
              <div className="text-center space-y-6">
                <div className="inline-flex p-6 bg-accent-100 rounded-full">
                  <Trophy className="w-16 h-16 text-accent-600" />
                </div>

                <h1 className="text-4xl font-bold text-gray-800">Session Complete!</h1>

                <div className="text-6xl font-bold text-primary-600">
                  {sessionResults.correct} / {sessionResults.total}
                </div>

                <Badge variant={percentage >= 70 ? 'success' : 'warning'} size="lg">
                  {percentage.toFixed(0)}% Accuracy
                </Badge>

                <p className="text-lg text-gray-600">
                  You earned {sessionResults.correct * 10} XP!
                </p>

                <div className="flex gap-4 justify-center pt-6">
                  <Button variant="primary" size="lg" onClick={handleStartNew}>
                    Study Again
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setSessionComplete(false)}>
                    Back to Cards
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-primary-600" />
            Flashcards
          </h1>
          <p className="text-gray-600">Study and master bartending knowledge</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-800">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Total Cards</div>
            <div className="text-3xl font-bold text-gray-800">{flashcards.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Selected Category</div>
            <div className="text-3xl font-bold text-primary-600">{filteredCards.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Categories</div>
            <div className="text-3xl font-bold text-accent-600">{categories.length - 1}</div>
          </Card>
        </div>

        {/* Start Study Button */}
        {filteredCards.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-br from-primary-50 to-accent-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to study {filteredCards.length} flashcard{filteredCards.length !== 1 ? 's' : ''}?
              </h2>
              <p className="text-gray-600 mb-6">
                Test your knowledge and earn experience points!
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartStudy}
                className="flex items-center gap-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                Start Study Session
              </Button>
            </Card>
          </motion.div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg">
              No flashcards found in this category.
              {selectedCategory !== 'all' && ' Try selecting a different category.'}
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}

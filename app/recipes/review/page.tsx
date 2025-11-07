'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DrinkRecipe } from '@/types';
import { getRecipesNeedingReview, updateRecipeConfidence } from '@/lib/storage';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Star, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewPage() {
  const router = useRouter();
  const [recipesNeedingReview, setRecipesNeedingReview] = useState<DrinkRecipe[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    const recipes = getRecipesNeedingReview();
    setRecipesNeedingReview(recipes);
  }, []);

  const currentRecipe = recipesNeedingReview[currentIndex];

  const handleConfidenceRating = (level: 1 | 2 | 3 | 4 | 5) => {
    if (currentRecipe) {
      const correct = level >= 3;
      updateRecipeConfidence(currentRecipe.id, level, correct);
      setReviewedCount(reviewedCount + 1);

      // Move to next recipe or finish
      if (currentIndex < recipesNeedingReview.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Review session complete
        alert(`Great job! You reviewed ${recipesNeedingReview.length} recipes.`);
        router.push('/recipes');
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < recipesNeedingReview.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Never reviewed';
    return new Date(date).toLocaleDateString();
  };

  if (recipesNeedingReview.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="secondary" onClick={() => router.push('/recipes')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Button>

          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
            <p className="text-gray-600 mb-6">
              You don't have any recipes that need review right now. Great work!
            </p>
            <Button onClick={() => router.push('/recipes')}>
              Back to Recipes
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="secondary" onClick={() => router.push('/recipes')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Recipes
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Review Session</h1>
          <p className="text-gray-600">
            Review recipes using spaced repetition for better retention
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Recipe {currentIndex + 1} of {recipesNeedingReview.length}</span>
            <span>Reviewed: {reviewedCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / recipesNeedingReview.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Recipe Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentRecipe.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {currentRecipe.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Last: {formatDate(currentRecipe.lastReviewed)}
                    </span>
                    <span className="flex items-center gap-1">
                      {Array.from({ length: currentRecipe.difficulty }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              {!showAnswer ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 mb-6">
                    Try to recall the recipe for {currentRecipe.name}
                  </p>
                  <Button onClick={() => setShowAnswer(true)} size="lg">
                    Show Recipe
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                    <ul className="space-y-2">
                      {currentRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700">
                          <span className="w-2 h-2 bg-primary-500 rounded-full" />
                          {ing.amount}{ing.unit} {ing.name}
                          {ing.optional && <span className="text-gray-500 italic text-sm">(optional)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
                    <ol className="space-y-2">
                      {currentRecipe.instructions.map((step, i) => (
                        <li key={i} className="flex gap-3 text-gray-700">
                          <span className="font-bold text-primary-600">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <span className="text-sm text-gray-600">Glassware:</span>
                      <p className="font-medium text-gray-900">{currentRecipe.glassware}</p>
                    </div>
                    {currentRecipe.garnish && (
                      <div>
                        <span className="text-sm text-gray-600">Garnish:</span>
                        <p className="font-medium text-gray-900">{currentRecipe.garnish}</p>
                      </div>
                    )}
                  </div>

                  {currentRecipe.notes && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Notes:</h4>
                      <p className="text-sm text-blue-800">{currentRecipe.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Confidence Rating */}
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                How well did you remember this recipe?
              </h3>
              <div className="grid grid-cols-5 gap-2">
                <Button
                  variant="danger"
                  onClick={() => handleConfidenceRating(1)}
                  className="flex flex-col items-center gap-2 py-4"
                >
                  <span className="text-2xl">😰</span>
                  <span className="text-xs font-medium">Need to Learn</span>
                  <span className="text-xs opacity-75">Review: 1 day</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleConfidenceRating(2)}
                  className="flex flex-col items-center gap-2 py-4 bg-orange-100 hover:bg-orange-200 text-orange-800"
                >
                  <span className="text-2xl">😕</span>
                  <span className="text-xs font-medium">Getting It</span>
                  <span className="text-xs opacity-75">Review: 3 days</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleConfidenceRating(3)}
                  className="flex flex-col items-center gap-2 py-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                >
                  <span className="text-2xl">😐</span>
                  <span className="text-xs font-medium">Pretty Good</span>
                  <span className="text-xs opacity-75">Review: 1 week</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleConfidenceRating(4)}
                  className="flex flex-col items-center gap-2 py-4 bg-blue-100 hover:bg-blue-200 text-blue-800"
                >
                  <span className="text-2xl">😊</span>
                  <span className="text-xs font-medium">Confident</span>
                  <span className="text-xs opacity-75">Review: 2 weeks</span>
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleConfidenceRating(5)}
                  className="flex flex-col items-center gap-2 py-4"
                >
                  <span className="text-2xl">😎</span>
                  <span className="text-xs font-medium">Mastered!</span>
                  <span className="text-xs opacity-75">Review: 1 month</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={handleNext}
            disabled={currentIndex === recipesNeedingReview.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

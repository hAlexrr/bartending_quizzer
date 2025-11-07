'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DrinkRecipe, Ingredient } from '@/types';
import { getRecipes } from '@/lib/storage';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Plus, Trash2, Check, X, Clock, Trophy } from 'lucide-react';

interface BuildDrinkGameProps {
  onComplete?: (score: number, accuracy: number) => void;
}

export default function BuildDrinkGame({ onComplete }: BuildDrinkGameProps) {
  const [currentRecipe, setCurrentRecipe] = useState<DrinkRecipe | null>(null);
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [playerIngredients, setPlayerIngredients] = useState<Ingredient[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (gameStarted && !gameComplete) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameComplete]);

  const startGame = (selectedDifficulty: 1 | 2 | 3) => {
    setDifficulty(selectedDifficulty);
    const recipes = getRecipes();
    const filteredRecipes = recipes.filter(r => r.difficulty === selectedDifficulty);

    if (filteredRecipes.length === 0) {
      alert('No recipes available for this difficulty!');
      return;
    }

    const randomRecipe = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
    setCurrentRecipe(randomRecipe);

    // Create pool of ingredients (correct + distractors)
    const correctIngredients = randomRecipe.ingredients.map(i => i.name);
    const allRecipes = getRecipes();
    const allIngredients = Array.from(
      new Set(allRecipes.flatMap(r => r.ingredients.map(i => i.name)))
    );

    // Add some distractor ingredients
    const distractors = allIngredients
      .filter(ing => !correctIngredients.includes(ing))
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(8, allIngredients.length - correctIngredients.length));

    const ingredientPool = [...correctIngredients, ...distractors].sort(() => Math.random() - 0.5);
    setAvailableIngredients(ingredientPool);
    setPlayerIngredients([]);
    setGameStarted(true);
    setGameComplete(false);
    setTimeElapsed(0);
  };

  const addIngredient = (ingredientName: string) => {
    if (!currentRecipe) return;

    const correctIngredient = currentRecipe.ingredients.find(i => i.name === ingredientName);

    if (correctIngredient) {
      setPlayerIngredients([...playerIngredients, { ...correctIngredient }]);
    }
  };

  const removeIngredient = (index: number) => {
    setPlayerIngredients(playerIngredients.filter((_, i) => i !== index));
  };

  const submitDrink = () => {
    if (!currentRecipe) return;

    let correctCount = 0;
    let totalRequired = currentRecipe.ingredients.filter(i => !i.optional).length;

    // Check each required ingredient
    currentRecipe.ingredients.forEach(correctIng => {
      if (correctIng.optional) return;

      const found = playerIngredients.find(
        p => p.name === correctIng.name &&
             Math.abs(p.amount - correctIng.amount) < 0.5 && // Allow small variance
             p.unit === correctIng.unit
      );

      if (found) correctCount++;
    });

    // Check for extra incorrect ingredients
    const incorrectExtras = playerIngredients.filter(
      p => !currentRecipe.ingredients.some(c => c.name === p.name)
    ).length;

    const accuracy = ((correctCount / totalRequired) * 100) - (incorrectExtras * 10);
    const finalAccuracy = Math.max(0, Math.min(100, accuracy));

    // Score based on accuracy and time
    let baseScore = finalAccuracy * 10;
    const timeBonus = Math.max(0, 300 - timeElapsed); // Bonus for speed (max 300 seconds)
    const finalScore = Math.round(baseScore + timeBonus);

    setScore(finalScore);
    setGameComplete(true);
    onComplete?.(finalScore, finalAccuracy);
  };

  const playAgain = () => {
    setGameStarted(false);
    setGameComplete(false);
    setPlayerIngredients([]);
    setScore(0);
  };

  // Difficulty selection screen
  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className="text-6xl mb-4">🍹</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Build-a-Drink Game</h2>
            <p className="text-gray-600 mb-8">
              Select ingredients to recreate the cocktail. Get the right ingredients with correct
              measurements to score points!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card
                className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-green-500"
                onClick={() => startGame(1)}
              >
                <div className="text-4xl mb-2">😊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Easy</h3>
                <p className="text-sm text-gray-600">Simple cocktails with few ingredients</p>
              </Card>

              <Card
                className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-yellow-500"
                onClick={() => startGame(2)}
              >
                <div className="text-4xl mb-2">🤔</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Medium</h3>
                <p className="text-sm text-gray-600">Classic cocktails with more ingredients</p>
              </Card>

              <Card
                className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-red-500"
                onClick={() => startGame(3)}
              >
                <div className="text-4xl mb-2">😰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Hard</h3>
                <p className="text-sm text-gray-600">Complex recipes with precise measurements</p>
              </Card>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  // Game complete screen
  if (gameComplete && currentRecipe) {
    const accuracy = Math.round(
      (playerIngredients.filter(p =>
        currentRecipe.ingredients.some(c => c.name === p.name)
      ).length / currentRecipe.ingredients.filter(i => !i.optional).length) * 100
    );

    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">
              {accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🎉' : '💪'}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {accuracy >= 90 ? 'Perfect!' : accuracy >= 70 ? 'Great Job!' : 'Keep Practicing!'}
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              You scored {score} points
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{accuracy}%</div>
                <div className="text-sm text-blue-700">Accuracy</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">{timeElapsed}s</div>
                <div className="text-sm text-purple-700">Time</div>
              </div>
            </div>

            {/* Show correct recipe */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
              <h3 className="font-bold text-gray-900 mb-4">Correct Recipe: {currentRecipe.name}</h3>
              <div className="space-y-2">
                {currentRecipe.ingredients.map((ing, i) => {
                  const playerHasIt = playerIngredients.some(p => p.name === ing.name);
                  return (
                    <div key={i} className="flex items-center gap-2">
                      {playerHasIt ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                      <span className={playerHasIt ? 'text-green-900' : 'text-red-900'}>
                        {ing.amount}{ing.unit} {ing.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="secondary" onClick={playAgain}>
                Play Again
              </Button>
              <Button onClick={() => window.location.href = '/games'}>
                Back to Games
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with timer and recipe name */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Build: {currentRecipe?.name}</h2>
          <p className="text-gray-600">Select the correct ingredients and measurements</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-blue-900">{timeElapsed}s</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Ingredients */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Available Ingredients</h3>
          <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {availableIngredients.map((ing, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addIngredient(ing)}
                className="px-4 py-3 bg-gray-100 hover:bg-primary-100 hover:text-primary-800 rounded-lg text-left font-medium text-gray-700 transition-colors"
              >
                {ing}
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Your Drink */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Drink</h3>
          <div className="space-y-2 mb-6 min-h-[200px]">
            <AnimatePresence>
              {playerIngredients.map((ing, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between bg-primary-50 p-3 rounded-lg"
                >
                  <span className="font-medium text-gray-900">
                    {ing.amount}{ing.unit} {ing.name}
                  </span>
                  <button
                    onClick={() => removeIngredient(i)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {playerIngredients.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Click ingredients to add them to your drink
              </div>
            )}
          </div>

          <Button
            onClick={submitDrink}
            disabled={playerIngredients.length === 0}
            className="w-full"
            size="lg"
          >
            Submit Drink
          </Button>

          <div className="mt-4 text-center text-sm text-gray-500">
            {playerIngredients.length} / {currentRecipe?.ingredients.filter(i => !i.optional).length} required ingredients
          </div>
        </Card>
      </div>

      {/* Hint (for easy mode) */}
      {difficulty === 1 && (
        <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Hint:</strong> This {currentRecipe?.name} needs{' '}
            {currentRecipe?.ingredients.filter(i => !i.optional).length} main ingredients.
          </p>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Wine, Trophy, Timer } from 'lucide-react';
import { saveGameSession, generateId } from '@/lib/storage';

interface IngredientPair {
  drink: string;
  ingredients: string[];
  correctIngredients: string[];
  category: string;
}

const ingredientChallenges: IngredientPair[] = [
  {
    drink: 'Margarita',
    ingredients: ['Tequila', 'Vodka', 'Lime Juice', 'Lemon Juice', 'Triple Sec', 'Simple Syrup'],
    correctIngredients: ['Tequila', 'Lime Juice', 'Triple Sec'],
    category: 'Classic Cocktails',
  },
  {
    drink: 'Mojito',
    ingredients: ['White Rum', 'Dark Rum', 'Mint', 'Basil', 'Lime', 'Lemon', 'Soda Water', 'Tonic Water'],
    correctIngredients: ['White Rum', 'Mint', 'Lime', 'Soda Water'],
    category: 'Classic Cocktails',
  },
  {
    drink: 'Old Fashioned',
    ingredients: ['Bourbon', 'Gin', 'Sugar', 'Honey', 'Bitters', 'Orange Peel', 'Lemon Peel'],
    correctIngredients: ['Bourbon', 'Sugar', 'Bitters', 'Orange Peel'],
    category: 'Classic Cocktails',
  },
  {
    drink: 'Moscow Mule',
    ingredients: ['Vodka', 'Gin', 'Ginger Beer', 'Ginger Ale', 'Lime', 'Lemon'],
    correctIngredients: ['Vodka', 'Ginger Beer', 'Lime'],
    category: 'Classic Cocktails',
  },
];

export default function IngredientMatchGame() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const challenge = ingredientChallenges[currentChallenge];

  useEffect(() => {
    if (!isPlaying || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleEndGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleStart = () => {
    setIsPlaying(true);
    setGameStartTime(new Date());
    setScore(0);
    setCorrectCount(0);
    setCurrentChallenge(0);
    setTimeLeft(90);
    setSelectedIngredients([]);
  };

  const toggleIngredient = (ingredient: string) => {
    if (showResult) return;

    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleSubmit = () => {
    const correct =
      selectedIngredients.length === challenge.correctIngredients.length &&
      selectedIngredients.every((ing) => challenge.correctIngredients.includes(ing));

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const points = 500;
      setScore(score + points);
      setCorrectCount(correctCount + 1);
    }

    setTimeout(() => {
      if (currentChallenge < ingredientChallenges.length - 1) {
        setCurrentChallenge(currentChallenge + 1);
        setSelectedIngredients([]);
        setShowResult(false);
      } else {
        handleEndGame();
      }
    }, 2000);
  };

  const handleEndGame = () => {
    setIsPlaying(false);

    const session = {
      id: generateId(),
      gameType: 'ingredient-match' as const,
      score,
      accuracy: correctCount / ingredientChallenges.length,
      timeSpent: gameStartTime ? Math.floor((Date.now() - gameStartTime.getTime()) / 1000) : 0,
      level: 1,
      completedAt: new Date(),
    };

    saveGameSession(session);
  };

  if (!isPlaying && currentChallenge === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-6"
      >
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="inline-flex p-6 bg-primary-100 rounded-full">
              <Wine className="w-16 h-16 text-primary-600" />
            </div>

            <h1 className="text-4xl font-bold text-gray-800">Ingredient Match</h1>
            <p className="text-lg text-gray-600">
              Select the correct ingredients for each classic cocktail!
            </p>

            <div className="bg-gray-50 p-6 rounded-lg space-y-3 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">How to Play:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>You'll be shown a cocktail name</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Select all the correct ingredients from the list</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>You have 90 seconds to complete all challenges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Perfect matches earn 500 points</span>
                </li>
              </ul>
            </div>

            <Button variant="primary" size="lg" onClick={handleStart} className="px-12">
              Start Game
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!isPlaying && currentChallenge > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-6"
      >
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="inline-flex p-6 bg-accent-100 rounded-full">
              <Trophy className="w-16 h-16 text-accent-600" />
            </div>

            <h1 className="text-4xl font-bold text-gray-800">Game Complete!</h1>

            <div className="text-6xl font-bold text-primary-600">{score}</div>
            <p className="text-xl text-gray-600">Total Points</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round((correctCount / ingredientChallenges.length) * 100)}%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Correct</p>
                <p className="text-2xl font-bold text-gray-800">
                  {correctCount} / {ingredientChallenges.length}
                </p>
              </div>
            </div>

            <Button variant="primary" size="lg" onClick={handleStart} fullWidth>
              Play Again
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ingredient Match</h2>
          <p className="text-sm text-gray-600">
            Challenge {currentChallenge + 1} of {ingredientChallenges.length}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
            <Timer className="w-5 h-5 text-primary-600" />
            <span className="text-lg font-bold text-gray-800">{timeLeft}s</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent-600" />
            <span className="text-lg font-bold text-gray-800">{score}</span>
          </div>
        </div>
      </div>

      {/* Challenge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentChallenge}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
                <Wine className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">{challenge.drink}</h3>
              <p className="text-gray-600">Select all correct ingredients</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {challenge.ingredients.map((ingredient) => {
                const isSelected = selectedIngredients.includes(ingredient);
                const isCorrectIngredient = challenge.correctIngredients.includes(ingredient);

                let styling = '';
                if (showResult) {
                  if (isCorrectIngredient) {
                    styling = 'border-green-500 bg-green-50 text-green-700';
                  } else if (isSelected) {
                    styling = 'border-red-500 bg-red-50 text-red-700';
                  } else {
                    styling = 'border-gray-300 bg-gray-50 text-gray-400';
                  }
                } else {
                  styling = isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400';
                }

                return (
                  <motion.button
                    key={ingredient}
                    onClick={() => toggleIngredient(ingredient)}
                    disabled={showResult}
                    className={`p-4 rounded-lg border-2 font-semibold transition-all duration-200 ${styling}`}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                  >
                    {ingredient}
                  </motion.button>
                );
              })}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg text-center ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                <p className="text-xl font-bold">
                  {isCorrect ? 'Perfect Match!' : 'Not Quite Right'}
                </p>
                {!isCorrect && (
                  <p className="text-sm mt-1">
                    Correct ingredients: {challenge.correctIngredients.join(', ')}
                  </p>
                )}
              </motion.div>
            )}

            {!showResult && (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleSubmit}
                disabled={selectedIngredients.length === 0}
              >
                Submit Answer
              </Button>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

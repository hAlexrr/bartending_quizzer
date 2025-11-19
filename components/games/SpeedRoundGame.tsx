'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DrinkRecipe } from '@/types';
import { getRecipes } from '@/lib/storage';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Clock, Zap, Trophy, Target } from 'lucide-react';

export default function SpeedRoundGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    if (gameStarted && !gameComplete && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setGameComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameComplete, timeRemaining]);

  const generateQuestions = () => {
    const recipes = getRecipes().filter(r => r.ingredients && r.ingredients.length > 0);

    if (recipes.length === 0) {
      // Return default questions if no recipes
      return [
        {
          question: 'How many ounces in a standard shot?',
          answer: '1.5',
          points: 100,
        },
        {
          question: 'What does "neat" mean?',
          answer: 'no ice',
          points: 100,
        },
      ];
    }

    const questionTypes = [
      // Type 1: What's the main spirit?
      (recipe: DrinkRecipe) => {
        if (!recipe.ingredients || recipe.ingredients.length === 0) return null;
        return {
          question: `What's the main spirit in a ${recipe.name}?`,
          answer: recipe.ingredients[0].name.toLowerCase(),
          points: 100,
        };
      },
      // Type 2: What glassware?
      (recipe: DrinkRecipe) => ({
        question: `What glassware is used for a ${recipe.name}?`,
        answer: recipe.glassware.toLowerCase(),
        points: 100,
      }),
      // Type 3: How many ingredients?
      (recipe: DrinkRecipe) => ({
        question: `How many ingredients in a ${recipe.name}?`,
        answer: recipe.ingredients.length.toString(),
        points: 150,
      }),
      // Type 4: What category?
      (recipe: DrinkRecipe) => ({
        question: `What category is a ${recipe.name}?`,
        answer: recipe.category.toLowerCase(),
        points: 100,
      }),
      // Type 5: Ingredient amount
      (recipe: DrinkRecipe) => {
        if (!recipe.ingredients || recipe.ingredients.length === 0) return null;
        const ing = recipe.ingredients[Math.floor(Math.random() * recipe.ingredients.length)];
        return {
          question: `How many ${ing.unit} of ${ing.name} in a ${recipe.name}?`,
          answer: ing.amount.toString(),
          points: 200,
        };
      },
    ];

    const generated = [];
    for (let i = 0; i < 20; i++) {
      const recipe = recipes[Math.floor(Math.random() * recipes.length)];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      const question = questionType(recipe);
      if (question) {
        generated.push(question);
      }
    }

    return generated.length > 0 ? generated : [
      {
        question: 'How many ounces in a standard shot?',
        answer: '1.5',
        points: 100,
      },
    ];
  };

  const startGame = () => {
    setQuestions(generateQuestions());
    setGameStarted(true);
    setGameComplete(false);
    setTimeRemaining(60);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setScore(0);
    setStreak(0);
    setUserAnswer('');
    setAnswerFeedback(null);
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();

    if (isCorrect) {
      const streakBonus = streak * 50;
      const timeBonus = Math.floor(timeRemaining / 10) * 10;
      const totalPoints = currentQuestion.points + streakBonus + timeBonus;

      setCorrectAnswers(correctAnswers + 1);
      setScore(score + totalPoints);
      setStreak(streak + 1);
      setAnswerFeedback('correct');
    } else {
      setStreak(0);
      setAnswerFeedback('incorrect');
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer('');
        setAnswerFeedback(null);
      } else {
        setGameComplete(true);
      }
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !answerFeedback) {
      submitAnswer();
    }
  };

  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <div className="text-6xl mb-4">⚡</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Speed Round Challenge</h2>
            <p className="text-gray-600 mb-8">
              Answer as many questions as you can in 60 seconds! Build streaks for bonus points.
            </p>

            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h3 className="font-bold text-yellow-900 mb-2">How to Play:</h3>
              <ul className="text-sm text-yellow-800 text-left space-y-1">
                <li>• Answer questions about cocktail recipes</li>
                <li>• Press Enter or click Submit to answer</li>
                <li>• Build streaks for bonus points</li>
                <li>• Faster answers = more time bonus</li>
              </ul>
            </div>

            <Button onClick={startGame} size="lg">
              <Zap className="w-5 h-5 mr-2" />
              Start Challenge
            </Button>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (gameComplete) {
    const accuracy = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">
              {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '🎯' : '💪'}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Time's Up!</h2>
            <p className="text-xl text-gray-600 mb-6">Final Score: {score}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{correctAnswers}</div>
                <div className="text-sm text-blue-700">Correct</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{accuracy}%</div>
                <div className="text-sm text-green-700">Accuracy</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">{score}</div>
                <div className="text-sm text-purple-700">Points</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="secondary" onClick={startGame}>
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

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeRemaining <= 10 ? 'bg-red-100 animate-pulse' : 'bg-blue-100'
          }`}>
            <Clock className={`w-5 h-5 ${timeRemaining <= 10 ? 'text-red-600' : 'text-blue-600'}`} />
            <span className={`font-bold text-xl ${timeRemaining <= 10 ? 'text-red-900' : 'text-blue-900'}`}>
              {timeRemaining}s
            </span>
          </div>

          {streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-lg"
            >
              <Zap className="w-5 h-5 text-orange-600" />
              <span className="font-bold text-orange-900">{streak}x Streak!</span>
            </motion.div>
          )}
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-600">Score</div>
          <div className="text-2xl font-bold text-gray-900">{score}</div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-8">
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQuestion?.question}</h2>

          <Input
            type="text"
            value={userAnswer}
            onChange={(value) => !answerFeedback && setUserAnswer(value)}
            placeholder="Type your answer..."
            className={
              answerFeedback === 'correct'
                ? 'border-green-500 bg-green-50'
                : answerFeedback === 'incorrect'
                ? 'border-red-500 bg-red-50'
                : ''
            }
          />

          {answerFeedback === 'correct' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg font-medium"
            >
              ✓ Correct! +{currentQuestion.points} points
            </motion.div>
          )}

          {answerFeedback === 'incorrect' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg"
            >
              ✗ Incorrect. Answer: {currentQuestion.answer}
            </motion.div>
          )}
        </div>

        <Button
          onClick={submitAnswer}
          disabled={!userAnswer.trim() || !!answerFeedback}
          className="w-full"
          size="lg"
        >
          Submit Answer
        </Button>
      </Card>

      {/* Progress Bar */}
      <div className="mt-4 bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

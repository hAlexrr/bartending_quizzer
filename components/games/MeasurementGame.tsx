'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { Trophy, Timer, Target } from 'lucide-react';
import { saveGameSession, generateId } from '@/lib/storage';

interface MeasurementChallenge {
  question: string;
  correctAnswer: number;
  unit: string;
  options: number[];
}

const challenges: MeasurementChallenge[] = [
  {
    question: 'How many ounces in a standard shot?',
    correctAnswer: 1.5,
    unit: 'oz',
    options: [1, 1.5, 2, 2.5],
  },
  {
    question: 'How many ml in 1 ounce?',
    correctAnswer: 30,
    unit: 'ml',
    options: [25, 30, 35, 40],
  },
  {
    question: 'How many dashes equal 1/4 oz?',
    correctAnswer: 8,
    unit: 'dashes',
    options: [4, 6, 8, 10],
  },
  {
    question: 'How many ounces in a standard jigger (large side)?',
    correctAnswer: 1.5,
    unit: 'oz',
    options: [1, 1.5, 2, 2.5],
  },
  {
    question: 'How many tablespoons in 1 ounce?',
    correctAnswer: 2,
    unit: 'tbsp',
    options: [1, 2, 3, 4],
  },
  {
    question: 'What is a "splash" typically?',
    correctAnswer: 0.25,
    unit: 'oz',
    options: [0.25, 0.5, 0.75, 1],
  },
  {
    question: 'How many ounces in a pony shot?',
    correctAnswer: 1,
    unit: 'oz',
    options: [0.75, 1, 1.25, 1.5],
  },
  {
    question: 'How many ml in a standard shot?',
    correctAnswer: 44,
    unit: 'ml',
    options: [30, 44, 50, 60],
  },
];

export default function MeasurementGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentChallenge = challenges[currentQuestion];

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
    setCorrectAnswers(0);
    setCurrentQuestion(0);
    setTimeLeft(60);
  };

  const handleAnswer = (answer: number) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    const correct = answer === currentChallenge.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const points = Math.max(100, 500 - (60 - timeLeft) * 5);
      setScore(score + points);
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      if (currentQuestion < challenges.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        handleEndGame();
      }
    }, 1500);
  };

  const handleEndGame = () => {
    setIsPlaying(false);

    const session = {
      id: generateId(),
      gameType: 'measurement' as const,
      score,
      accuracy: correctAnswers / challenges.length,
      timeSpent: gameStartTime ? Math.floor((Date.now() - gameStartTime.getTime()) / 1000) : 0,
      level: 1,
      completedAt: new Date(),
    };

    saveGameSession(session);
  };

  if (!isPlaying && currentQuestion === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-6"
      >
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="inline-flex p-6 bg-primary-100 rounded-full">
              <Target className="w-16 h-16 text-primary-600" />
            </div>

            <h1 className="text-4xl font-bold text-gray-800">Measurement Master</h1>
            <p className="text-lg text-gray-600">
              Test your knowledge of bartending measurements and conversions!
            </p>

            <div className="bg-gray-50 p-6 rounded-lg space-y-3 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">How to Play:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Answer measurement questions as quickly as possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Faster answers earn more points</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>You have 60 seconds to complete all questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Each correct answer is worth up to 500 points</span>
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

  if (!isPlaying && currentQuestion > 0) {
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
                  {Math.round((correctAnswers / challenges.length) * 100)}%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Correct</p>
                <p className="text-2xl font-bold text-gray-800">
                  {correctAnswers} / {challenges.length}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="primary" size="lg" onClick={handleStart} fullWidth>
                Play Again
              </Button>
            </div>
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
          <h2 className="text-2xl font-bold text-gray-800">Measurement Master</h2>
          <p className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {challenges.length}
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

      {/* Progress */}
      <ProgressBar
        progress={((currentQuestion + 1) / challenges.length) * 100}
        color="primary"
        height="md"
      />

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {currentChallenge.question}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentChallenge.options.map((option) => (
                <motion.button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                  className={`p-6 rounded-xl border-2 text-2xl font-bold transition-all duration-200 ${
                    showFeedback
                      ? option === currentChallenge.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : option === selectedAnswer
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-gray-50 text-gray-400'
                      : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50 text-gray-800'
                  }`}
                  whileHover={!showFeedback ? { scale: 1.05 } : {}}
                  whileTap={!showFeedback ? { scale: 0.95 } : {}}
                >
                  {option} {currentChallenge.unit}
                </motion.button>
              ))}
            </div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg text-center ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                <p className="text-xl font-bold">
                  {isCorrect ? 'Correct!' : 'Incorrect!'}
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quiz, Question, QuizResult, UserAnswer } from '@/types';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import Card from '@/components/ui/Card';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { saveQuizResult, generateId } from '@/lib/storage';

interface QuizTakerProps {
  quiz: Quiz;
  onComplete: (result: QuizResult) => void;
}

export default function QuizTaker({ quiz, onComplete }: QuizTakerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit || 0);
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Timer
  useEffect(() => {
    if (!hasStarted || !quiz.timeLimit) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, quiz.timeLimit]);

  const handleStart = () => {
    setHasStarted(true);
    setStartTime(new Date());
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      isCorrect,
      pointsEarned: isCorrect ? currentQuestion.points : 0,
    };

    setAnswers([...answers, userAnswer]);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      handleFinishQuiz([...answers, userAnswer]);
    }
  };

  const handleFinishQuiz = (finalAnswers?: UserAnswer[]) => {
    const quizAnswers = finalAnswers || answers;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = quizAnswers.reduce((sum, a) => sum + a.pointsEarned, 0);
    const percentage = (earnedPoints / totalPoints) * 100;

    const result: QuizResult = {
      id: generateId(),
      quizId: quiz.id,
      score: earnedPoints,
      totalPoints,
      percentage,
      answers: quizAnswers,
      completedAt: new Date(),
      timeSpent: startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0,
      passed: percentage >= quiz.passingScore,
    };

    saveQuizResult(result);
    onComplete(result);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!hasStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-6"
      >
        <Card className="p-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">{quiz.title}</h1>
            <p className="text-lg text-gray-600">{quiz.description}</p>

            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Questions</p>
                <p className="text-2xl font-bold text-primary-600">{quiz.questions.length}</p>
              </div>
              {quiz.timeLimit && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Time Limit</p>
                  <p className="text-2xl font-bold text-primary-600">{formatTime(quiz.timeLimit)}</p>
                </div>
              )}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Passing Score</p>
                <p className="text-2xl font-bold text-primary-600">{quiz.passingScore}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Points</p>
                <p className="text-2xl font-bold text-primary-600">
                  {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
                </p>
              </div>
            </div>

            <Button variant="primary" size="lg" onClick={handleStart} className="px-12">
              Start Quiz
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
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
          <p className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        {quiz.timeLimit && (
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
            <Clock className="w-5 h-5 text-primary-600" />
            <span className="text-lg font-bold text-gray-800">{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <ProgressBar progress={progress} color="primary" height="md" />

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentQuestion.question}</h3>
                <p className="text-sm text-gray-500">Worth {currentQuestion.points} points</p>
              </div>

              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === option
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === option
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-400'
                        }`}
                      >
                        {selectedAnswer === option && (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-lg">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
              >
                {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

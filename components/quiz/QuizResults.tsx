'use client';

import { motion } from 'framer-motion';
import { QuizResult, Quiz } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Trophy, CheckCircle, XCircle, Clock, Target } from 'lucide-react';

interface QuizResultsProps {
  result: QuizResult;
  quiz: Quiz;
  onRetry?: () => void;
  onBackToQuizzes?: () => void;
}

export default function QuizResults({ result, quiz, onRetry, onBackToQuizzes }: QuizResultsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const correctAnswers = result.answers.filter((a) => a.isCorrect).length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className={`inline-flex p-6 rounded-full ${
                result.passed ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <Trophy
                className={`w-16 h-16 ${result.passed ? 'text-green-600' : 'text-red-600'}`}
              />
            </motion.div>

            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {result.passed ? 'Congratulations!' : 'Quiz Complete'}
              </h1>
              <p className="text-xl text-gray-600">
                {result.passed
                  ? "You've passed the quiz!"
                  : 'Keep practicing to improve your score'}
              </p>
            </div>

            <div className="inline-block">
              <Badge
                variant={result.passed ? 'success' : 'danger'}
                size="lg"
                className="text-2xl px-6 py-3"
              >
                {result.percentage.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6 text-center">
            <Target className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Score</p>
            <p className="text-2xl font-bold text-gray-800">
              {result.score} / {result.totalPoints}
            </p>
          </Card>

          <Card className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Correct</p>
            <p className="text-2xl font-bold text-gray-800">
              {correctAnswers} / {quiz.questions.length}
            </p>
          </Card>

          <Card className="p-6 text-center">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Incorrect</p>
            <p className="text-2xl font-bold text-gray-800">
              {quiz.questions.length - correctAnswers}
            </p>
          </Card>

          <Card className="p-6 text-center">
            <Clock className="w-8 h-8 text-accent-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Time Taken</p>
            <p className="text-2xl font-bold text-gray-800">{formatTime(result.timeSpent)}</p>
          </Card>
        </div>
      </motion.div>

      {/* Question Review */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Question Review</h2>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = result.answers[index];
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border-2 ${
                    userAnswer.isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {userAnswer.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-2">
                        {index + 1}. {question.question}
                      </p>
                      <div className="space-y-1 text-sm">
                        {!userAnswer.isCorrect && (
                          <>
                            <p className="text-red-700">
                              Your answer: <span className="font-semibold">{userAnswer.userAnswer as string}</span>
                            </p>
                            <p className="text-green-700">
                              Correct answer:{' '}
                              <span className="font-semibold">{question.correctAnswer}</span>
                            </p>
                          </>
                        )}
                        {userAnswer.isCorrect && (
                          <p className="text-green-700">
                            Your answer: <span className="font-semibold">{userAnswer.userAnswer as string}</span>
                          </p>
                        )}
                        {question.explanation && (
                          <p className="text-gray-600 mt-2 italic">{question.explanation}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant={userAnswer.isCorrect ? 'success' : 'danger'}>
                      {userAnswer.pointsEarned} / {question.points} pts
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4"
      >
        {onRetry && (
          <Button variant="primary" size="lg" onClick={onRetry} fullWidth>
            Try Again
          </Button>
        )}
        {onBackToQuizzes && (
          <Button variant="outline" size="lg" onClick={onBackToQuizzes} fullWidth>
            Back to Quizzes
          </Button>
        )}
      </motion.div>
    </div>
  );
}

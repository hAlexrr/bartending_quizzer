'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import QuizTaker from '@/components/quiz/QuizTaker';
import QuizResults from '@/components/quiz/QuizResults';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getQuizzes, addExperiencePoints } from '@/lib/storage';
import { Quiz, QuizResult } from '@/types';
import { Brain, Clock, Target, Trophy } from 'lucide-react';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = () => {
    const loadedQuizzes = getQuizzes();
    setQuizzes(loadedQuizzes);
  };

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setQuizResult(null);
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);

    // Award XP based on score
    const xpEarned = Math.floor(result.percentage * 5);
    addExperiencePoints(xpEarned);
  };

  const handleRetry = () => {
    setQuizResult(null);
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setQuizResult(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizResult && selectedQuiz) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="py-8">
          <QuizResults
            result={quizResult}
            quiz={selectedQuiz}
            onRetry={handleRetry}
            onBackToQuizzes={handleBackToQuizzes}
          />
        </main>
      </div>
    );
  }

  if (selectedQuiz) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="py-8">
          <QuizTaker quiz={selectedQuiz} onComplete={handleQuizComplete} />
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
            <Brain className="w-10 h-10 text-primary-600" />
            Quizzes
          </h1>
          <p className="text-gray-600">Test your bartending knowledge and track your progress</p>
        </div>

        {/* Quiz Grid */}
        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-6 h-full flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="info">{quiz.category}</Badge>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target className="w-4 h-4" />
                        <span>{quiz.questions.length} questions</span>
                      </div>
                      {quiz.timeLimit && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(quiz.timeLimit)} time limit</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Trophy className="w-4 h-4" />
                        <span>{quiz.passingScore}% to pass</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => handleQuizSelect(quiz)}
                    fullWidth
                    className="mt-6"
                  >
                    Start Quiz
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Quizzes Available</h2>
            <p className="text-gray-600">Check back later for new quizzes!</p>
          </Card>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How Quizzes Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-4xl">⏱️</div>
                <h3 className="font-semibold text-gray-800">Timed Challenges</h3>
                <p className="text-sm text-gray-600">
                  Complete quizzes within the time limit to test your knowledge under pressure.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl">📊</div>
                <h3 className="font-semibold text-gray-800">Detailed Feedback</h3>
                <p className="text-sm text-gray-600">
                  Get instant results with explanations for each question to learn from mistakes.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl">🏆</div>
                <h3 className="font-semibold text-gray-800">Earn Experience</h3>
                <p className="text-sm text-gray-600">
                  Earn XP based on your performance to level up and track your progress.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

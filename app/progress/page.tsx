'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { getUserProgress, getQuizResults, getGameSessions, getFlashcards } from '@/lib/storage';
import { TrendingUp, Trophy, Target, BookOpen, Brain, Gamepad2, Star } from 'lucide-react';

export default function ProgressPage() {
  const [progress, setProgress] = useState({
    level: 1,
    experiencePoints: 0,
    totalFlashcardsReviewed: 0,
    totalQuizzesTaken: 0,
    totalGamesPlayed: 0,
    averageQuizScore: 0,
    currentStreak: 0,
    longestStreak: 0,
  });

  const [stats, setStats] = useState({
    quizAccuracy: 0,
    gameAccuracy: 0,
    flashcardAccuracy: 0,
    totalXP: 0,
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    const userProgress = getUserProgress();
    const quizResults = getQuizResults();
    const gameSessions = getGameSessions();
    const flashcards = getFlashcards();

    // Calculate quiz accuracy
    const quizAccuracy =
      quizResults.length > 0
        ? quizResults.reduce((sum, r) => sum + r.percentage, 0) / quizResults.length
        : 0;

    // Calculate game accuracy
    const gameAccuracy =
      gameSessions.length > 0
        ? (gameSessions.reduce((sum, s) => sum + s.accuracy, 0) / gameSessions.length) * 100
        : 0;

    // Calculate flashcard accuracy
    const reviewedCards = flashcards.filter((f) => f.reviewCount > 0);
    const flashcardAccuracy =
      reviewedCards.length > 0
        ? (reviewedCards.reduce((sum, f) => sum + (f.correctCount / f.reviewCount), 0) /
            reviewedCards.length) *
          100
        : 0;

    setProgress({
      ...userProgress,
      totalQuizzesTaken: quizResults.length,
      totalGamesPlayed: gameSessions.length,
      totalFlashcardsReviewed: reviewedCards.length,
      averageQuizScore: quizAccuracy,
    });

    setStats({
      quizAccuracy,
      gameAccuracy,
      flashcardAccuracy,
      totalXP: userProgress.experiencePoints,
    });
  };

  const nextLevelXP = progress.level * 100;
  const currentLevelProgress = ((progress.experiencePoints % 100) / 100) * 100;

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-primary-600" />
            Your Progress
          </h1>
          <p className="text-gray-600">Track your bartending journey and achievements</p>
        </div>

        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-8 bg-gradient-to-br from-primary-500 to-accent-600 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/80 mb-1">Current Level</p>
                <h2 className="text-5xl font-bold">Level {progress.level}</h2>
              </div>
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Trophy className="w-12 h-12" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/80">
                <span>{progress.experiencePoints % 100} XP</span>
                <span>{nextLevelXP} XP</span>
              </div>
              <ProgressBar progress={currentLevelProgress} color="accent" height="lg" />
              <p className="text-sm text-white/80 text-center">
                {100 - (progress.experiencePoints % 100)} XP until next level
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <Badge variant="info">{progress.totalFlashcardsReviewed}</Badge>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Flashcards Studied</h3>
              <div className="text-sm text-gray-600">
                {stats.flashcardAccuracy.toFixed(0)}% accuracy
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
                <Badge variant="info">{progress.totalQuizzesTaken}</Badge>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Quizzes Completed</h3>
              <div className="text-sm text-gray-600">{stats.quizAccuracy.toFixed(0)}% avg score</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Gamepad2 className="w-8 h-8 text-green-600" />
                <Badge variant="info">{progress.totalGamesPlayed}</Badge>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Games Played</h3>
              <div className="text-sm text-gray-600">{stats.gameAccuracy.toFixed(0)}% accuracy</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-8 h-8 text-accent-600" />
                <Badge variant="warning">{progress.experiencePoints}</Badge>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Total XP Earned</h3>
              <div className="text-sm text-gray-600">Level {progress.level} Mixologist</div>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary-600" />
                Performance Overview
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">Quiz Performance</span>
                    <span className="text-gray-600">{stats.quizAccuracy.toFixed(0)}%</span>
                  </div>
                  <ProgressBar progress={stats.quizAccuracy} color="primary" height="md" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">Game Performance</span>
                    <span className="text-gray-600">{stats.gameAccuracy.toFixed(0)}%</span>
                  </div>
                  <ProgressBar progress={stats.gameAccuracy} color="success" height="md" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">Flashcard Accuracy</span>
                    <span className="text-gray-600">{stats.flashcardAccuracy.toFixed(0)}%</span>
                  </div>
                  <ProgressBar progress={stats.flashcardAccuracy} color="accent" height="md" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-accent-600" />
                Achievements
              </h2>

              <div className="space-y-4">
                {progress.totalFlashcardsReviewed >= 10 && (
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="text-3xl">📚</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Dedicated Learner</h3>
                      <p className="text-sm text-gray-600">Studied 10+ flashcards</p>
                    </div>
                  </div>
                )}

                {progress.totalQuizzesTaken >= 3 && (
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="text-3xl">🧠</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Quiz Master</h3>
                      <p className="text-sm text-gray-600">Completed 3+ quizzes</p>
                    </div>
                  </div>
                )}

                {progress.totalGamesPlayed >= 5 && (
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="text-3xl">🎮</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Game Champion</h3>
                      <p className="text-sm text-gray-600">Played 5+ games</p>
                    </div>
                  </div>
                )}

                {progress.level >= 5 && (
                  <div className="flex items-center gap-4 p-4 bg-accent-50 rounded-lg border-2 border-accent-200">
                    <div className="text-3xl">⭐</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Rising Star</h3>
                      <p className="text-sm text-gray-600">Reached Level 5</p>
                    </div>
                  </div>
                )}

                {progress.totalFlashcardsReviewed === 0 &&
                  progress.totalQuizzesTaken === 0 &&
                  progress.totalGamesPlayed === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Start learning to unlock achievements!</p>
                    </div>
                  )}
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

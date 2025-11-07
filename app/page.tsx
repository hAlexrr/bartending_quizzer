'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { BookOpen, Brain, Gamepad2, PlusCircle, TrendingUp, Sparkles } from 'lucide-react';
import { getUserProgress, getFlashcards, getQuizzes, getGameSessions } from '@/lib/storage';
import { initialFlashcards, initialQuizzes, initialRecipes } from '@/data/initialData';
import { saveFlashcard, saveQuiz, saveRecipe } from '@/lib/storage';

export default function HomePage() {
  const [stats, setStats] = useState({
    flashcardsCount: 0,
    quizzesCount: 0,
    gamesPlayed: 0,
    level: 1,
    xp: 0,
  });

  useEffect(() => {
    // Initialize data if empty
    const flashcards = getFlashcards();
    if (flashcards.length === 0) {
      initialFlashcards.forEach(saveFlashcard);
    }

    const quizzes = getQuizzes();
    if (quizzes.length === 0) {
      initialQuizzes.forEach(saveQuiz);
    }

    // Load stats
    const progress = getUserProgress();
    const gameSessions = getGameSessions();

    setStats({
      flashcardsCount: getFlashcards().length,
      quizzesCount: getQuizzes().length,
      gamesPlayed: gameSessions.length,
      level: progress.level,
      xp: progress.experiencePoints,
    });
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: 'Flashcards',
      description: 'Study drink recipes, techniques, and terminology with interactive flashcards',
      color: 'from-blue-500 to-blue-600',
      href: '/flashcards',
      count: stats.flashcardsCount,
    },
    {
      icon: Brain,
      title: 'Quizzes',
      description: 'Test your bartending knowledge with comprehensive quizzes',
      color: 'from-purple-500 to-purple-600',
      href: '/quizzes',
      count: stats.quizzesCount,
    },
    {
      icon: Gamepad2,
      title: 'Games',
      description: 'Practice measurements and ingredients with fun, interactive games',
      color: 'from-green-500 to-green-600',
      href: '/games',
      count: 3,
    },
    {
      icon: PlusCircle,
      title: 'Create',
      description: 'Add your own flashcards and customize your learning experience',
      color: 'from-orange-500 to-orange-600',
      href: '/create',
      count: null,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span className="text-primary-700 font-semibold">Welcome to Your Learning Journey</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
            Master Bartending
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Learn cocktail recipes, perfect your techniques, and become a skilled mixologist through
            interactive lessons, quizzes, and games.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">Level {stats.level}</div>
              <div className="text-sm text-gray-600">Your Level</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-600">{stats.xp}</div>
              <div className="text-sm text-gray-600">Experience Points</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{stats.gamesPlayed}</div>
              <div className="text-sm text-gray-600">Games Played</div>
            </div>
          </div>

          <Link href="/flashcards">
            <Button variant="primary" size="lg" className="text-lg px-8">
              Start Learning
            </Button>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={itemVariants}>
                <Link href={feature.href}>
                  <Card hover className="p-8 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.color}`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      {feature.count !== null && (
                        <Badge variant="info" size="lg">
                          {feature.count}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="p-8 bg-gradient-to-br from-primary-50 to-accent-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-600" />
              Pro Tips for Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-4xl">📚</div>
                <h3 className="font-semibold text-gray-800">Study Consistently</h3>
                <p className="text-sm text-gray-600">
                  Review flashcards daily to build muscle memory and retain information better.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl">🎯</div>
                <h3 className="font-semibold text-gray-800">Practice with Games</h3>
                <p className="text-sm text-gray-600">
                  Use interactive games to make learning measurements and ingredients fun and memorable.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl">✅</div>
                <h3 className="font-semibold text-gray-800">Test Your Knowledge</h3>
                <p className="text-sm text-gray-600">
                  Take quizzes regularly to identify areas where you need more practice.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

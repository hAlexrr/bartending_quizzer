'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import MeasurementGame from '@/components/games/MeasurementGame';
import IngredientMatchGame from '@/components/games/IngredientMatchGame';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Gamepad2, Target, Wine, Trophy, Zap, Construction, Clock, Droplet, Flame, Users } from 'lucide-react';

type GameType = 'measurement' | 'ingredient' | null;

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const router = useRouter();

  const newGames = [
    {
      title: 'Bartender Rush Mode',
      description: 'Simulate a busy bar shift! Manage multiple orders, build combos, and don\'t let orders expire',
      icon: Flame,
      color: 'from-red-500 to-orange-600',
      difficulty: 'Hard',
      estimatedTime: '5-10 min',
      route: '/games/bartender-rush',
      badge: 'NEW',
    },
    {
      title: 'Pouring Practice',
      description: 'Master your pouring technique with visual feedback and timing challenges',
      icon: Droplet,
      color: 'from-blue-500 to-cyan-600',
      difficulty: 'All Levels',
      estimatedTime: '5+ min',
      route: '/games/pouring-practice',
      badge: 'NEW',
    },
    {
      title: 'Build-a-Drink',
      description: 'Recreate cocktails by selecting the right ingredients with correct measurements',
      icon: Construction,
      color: 'from-purple-500 to-purple-600',
      difficulty: 'All Levels',
      estimatedTime: '3-5 min',
      route: '/games/build-drink',
      badge: 'NEW',
    },
    {
      title: 'Speed Round',
      description: 'Answer rapid-fire questions in 60 seconds. Build streaks for bonus points!',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      difficulty: 'Medium',
      estimatedTime: '1 min',
      route: '/games/speed-round',
      badge: 'NEW',
    },
  ];

  const games = [
    {
      id: 'measurement' as GameType,
      title: 'Measurement Master',
      description: 'Test your knowledge of bartending measurements and conversions',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      difficulty: 'Medium',
      estimatedTime: '2-3 min',
    },
    {
      id: 'ingredient' as GameType,
      title: 'Ingredient Match',
      description: 'Match classic cocktails with their correct ingredients',
      icon: Wine,
      color: 'from-green-500 to-green-600',
      difficulty: 'Medium',
      estimatedTime: '3-4 min',
    },
  ];

  if (selectedGame === 'measurement') {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <Button variant="outline" onClick={() => setSelectedGame(null)}>
              ← Back to Games
            </Button>
          </div>
          <MeasurementGame />
        </main>
      </div>
    );
  }

  if (selectedGame === 'ingredient') {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <Button variant="outline" onClick={() => setSelectedGame(null)}>
              ← Back to Games
            </Button>
          </div>
          <IngredientMatchGame />
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
            <Gamepad2 className="w-10 h-10 text-primary-600" />
            Interactive Games
          </h1>
          <p className="text-gray-600">Practice your skills with fun, challenging games</p>
        </div>

        {/* New Games Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">New Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newGames.map((game, index) => {
              const Icon = game.icon;
              return (
                <motion.div
                  key={game.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="p-8 h-full flex flex-col relative">
                    {game.badge && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {game.badge}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${game.color} inline-block mb-4`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{game.title}</h3>
                      <p className="text-gray-600 mb-6">{game.description}</p>

                      <div className="flex gap-3 mb-6">
                        <Badge variant="info">{game.difficulty}</Badge>
                        <Badge variant="default">{game.estimatedTime}</Badge>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => router.push(game.route)}
                      fullWidth
                      className="flex items-center justify-center gap-2"
                    >
                      <Gamepad2 className="w-5 h-5" />
                      Play Now
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Classic Games Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Classic Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game, index) => {
              const Icon = game.icon;
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Card hover className="p-8 h-full flex flex-col">
                    <div className="flex-1">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${game.color} inline-block mb-4`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{game.title}</h3>
                      <p className="text-gray-600 mb-6">{game.description}</p>

                      <div className="flex gap-3 mb-6">
                        <Badge variant="info">{game.difficulty}</Badge>
                        <Badge variant="default">{game.estimatedTime}</Badge>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setSelectedGame(game.id)}
                      fullWidth
                      className="flex items-center justify-center gap-2"
                    >
                      <Gamepad2 className="w-5 h-5" />
                      Play Now
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-accent-600" />
              Why Practice with Games?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-4xl">🎯</div>
                <h3 className="font-semibold text-gray-800">Build Muscle Memory</h3>
                <p className="text-sm text-gray-600">
                  Repetitive practice helps you memorize measurements and recipes naturally.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl">⚡</div>
                <h3 className="font-semibold text-gray-800">Speed & Accuracy</h3>
                <p className="text-sm text-gray-600">
                  Timed challenges improve your ability to recall information quickly.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl">🎮</div>
                <h3 className="font-semibold text-gray-800">Fun Learning</h3>
                <p className="text-sm text-gray-600">
                  Gamification makes studying enjoyable and increases retention.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

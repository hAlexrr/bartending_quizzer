'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PouringPractice, PourAttempt } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Droplet, Trophy, Target, Clock, TrendingUp, RotateCcw } from 'lucide-react';

type PracticeMode = 'free-pour' | 'count-pour' | 'jigger' | 'challenge';

export default function PouringPracticeSimulator() {
  const [mode, setMode] = useState<PracticeMode | null>(null);
  const [targetAmount, setTargetAmount] = useState(1.5); // oz
  const [isPouring, setIsPouring] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [pourStartTime, setPourStartTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<PourAttempt[]>([]);
  const [showResults, setShowResults] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startPour = () => {
    setIsPouring(true);
    setPourStartTime(Date.now());
    setCurrentAmount(0);

    // Simulate pouring at ~0.5oz per second (adjustable)
    intervalRef.current = setInterval(() => {
      setCurrentAmount(prev => {
        const next = prev + 0.05;
        return Math.min(next, 4); // Max 4 oz
      });
    }, 100);
  };

  const stopPour = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!pourStartTime) return;

    const duration = Date.now() - pourStartTime;
    const accuracy = calculateAccuracy(currentAmount, targetAmount);

    const attempt: PourAttempt = {
      amount: parseFloat(currentAmount.toFixed(2)),
      accuracy,
      duration,
    };

    setAttempts(prev => [...prev, attempt]);
    setIsPouring(false);
    setShowResults(true);

    // Auto-hide results after 3 seconds
    setTimeout(() => {
      setShowResults(false);
      setCurrentAmount(0);
    }, 3000);
  };

  const calculateAccuracy = (poured: number, target: number): number => {
    const difference = Math.abs(poured - target);
    const percentOff = (difference / target) * 100;
    return Math.max(0, 100 - percentOff);
  };

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 95) return 'text-green-600';
    if (accuracy >= 85) return 'text-blue-600';
    if (accuracy >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyLabel = (accuracy: number): string => {
    if (accuracy >= 95) return 'Perfect!';
    if (accuracy >= 85) return 'Great!';
    if (accuracy >= 75) return 'Good';
    if (accuracy >= 60) return 'Close';
    return 'Try Again';
  };

  const getAverageAccuracy = (): number => {
    if (attempts.length === 0) return 0;
    const sum = attempts.reduce((acc, a) => acc + a.accuracy, 0);
    return sum / attempts.length;
  };

  const reset = () => {
    setMode(null);
    setAttempts([]);
    setCurrentAmount(0);
    setShowResults(false);
    setIsPouring(false);
  };

  const newRound = () => {
    setCurrentAmount(0);
    setShowResults(false);
    setIsPouring(false);
  };

  if (!mode) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pouring Practice Simulator</h1>
          <p className="text-gray-600">Master your pouring technique with visual feedback</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              hover
              className="p-6 cursor-pointer h-full"
              onClick={() => setMode('free-pour')}
            >
              <div className="text-center">
                <Droplet className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free Pour</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Practice pouring without a jigger. Hold and release to pour, aiming for the target amount.
                </p>
                <div className="text-xs text-gray-500">Best for: Bartending speed</div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              hover
              className="p-6 cursor-pointer h-full"
              onClick={() => setMode('count-pour')}
            >
              <div className="text-center">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Count Pour</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Practice counting while pouring. Standard: 1.5 oz = 3 second count.
                </p>
                <div className="text-xs text-gray-500">Best for: Consistency</div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              hover
              className="p-6 cursor-pointer h-full"
              onClick={() => setMode('jigger')}
            >
              <div className="text-center">
                <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Jigger Practice</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Practice using visual measurements. Stop exactly at the target line.
                </p>
                <div className="text-xs text-gray-500">Best for: Accuracy</div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card
              hover
              className="p-6 cursor-pointer h-full"
              onClick={() => setMode('challenge')}
            >
              <div className="text-center">
                <Trophy className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Challenge Mode</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Random amounts, time pressure, and scoring. Test your pouring mastery!
                </p>
                <div className="text-xs text-gray-500">Best for: Competition prep</div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 capitalize">{mode.replace('-', ' ')}</h2>
          <p className="text-gray-600 text-sm">Target: {targetAmount} oz</p>
        </div>
        <Button variant="secondary" onClick={reset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Change Mode
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Pouring Area */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            <div className="mb-8">
              {/* Visual Glass */}
              <div className="relative w-48 h-96 mx-auto bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg border-4 border-gray-300 overflow-hidden">
                {/* Target Line */}
                <div
                  className="absolute w-full border-t-4 border-dashed border-green-500 z-10"
                  style={{ bottom: `${(targetAmount / 4) * 100}%` }}
                >
                  <div className="absolute right-2 -top-3 text-xs font-bold text-green-700 bg-white px-2 py-1 rounded">
                    {targetAmount}oz
                  </div>
                </div>

                {/* Liquid */}
                <motion.div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400"
                  animate={{
                    height: `${(currentAmount / 4) * 100}%`,
                  }}
                  transition={{ duration: 0.1 }}
                >
                  {currentAmount > 0 && (
                    <div className="absolute top-2 left-0 right-0 text-center text-white font-bold text-lg">
                      {currentAmount.toFixed(2)} oz
                    </div>
                  )}
                </motion.div>

                {/* Pour Stream */}
                {isPouring && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-12 bg-blue-400 -mt-12"
                  />
                )}
              </div>
            </div>

            {/* Pour Controls */}
            <div className="text-center">
              {!isPouring && !showResults && (
                <Button
                  onClick={startPour}
                  size="lg"
                  className="w-64"
                >
                  <Droplet className="w-5 h-5 mr-2" />
                  Start Pouring
                </Button>
              )}

              {isPouring && (
                <Button
                  onClick={stopPour}
                  size="lg"
                  variant="danger"
                  className="w-64"
                >
                  Stop Pouring
                </Button>
              )}

              {showResults && !isPouring && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 mb-4">
                    <div className={`text-4xl font-bold mb-2 ${getAccuracyColor(attempts[attempts.length - 1].accuracy)}`}>
                      {attempts[attempts.length - 1].accuracy.toFixed(1)}%
                    </div>
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      {getAccuracyLabel(attempts[attempts.length - 1].accuracy)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Poured: {attempts[attempts.length - 1].amount} oz
                      <br />
                      Time: {(attempts[attempts.length - 1].duration / 1000).toFixed(2)}s
                      <br />
                      Difference: {Math.abs(attempts[attempts.length - 1].amount - targetAmount).toFixed(2)} oz
                    </div>
                  </Card>
                  <Button onClick={newRound} className="w-64">
                    Try Again
                  </Button>
                </motion.div>
              )}
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>💡 Tip: In real life, {targetAmount} oz ≈ {(targetAmount * 0.5).toFixed(1)} second count</p>
            </div>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Session Stats
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-600">Attempts</div>
                <div className="text-2xl font-bold text-gray-900">{attempts.length}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Average Accuracy</div>
                <div className={`text-2xl font-bold ${getAccuracyColor(getAverageAccuracy())}`}>
                  {getAverageAccuracy().toFixed(1)}%
                </div>
              </div>
              {attempts.length > 0 && (
                <div>
                  <div className="text-xs text-gray-600">Best Pour</div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.max(...attempts.map(a => a.accuracy)).toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-gray-900 mb-3">Recent Attempts</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {attempts.slice().reverse().slice(0, 10).map((attempt, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                  <span className="text-gray-700">{attempt.amount} oz</span>
                  <span className={`font-bold ${getAccuracyColor(attempt.accuracy)}`}>
                    {attempt.accuracy.toFixed(0)}%
                  </span>
                </div>
              ))}
              {attempts.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No attempts yet</p>
              )}
            </div>
          </Card>

          <Card className="p-4 bg-blue-50">
            <h4 className="font-bold text-blue-900 mb-2 text-sm">Pro Tips</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Keep bottle inverted at 180°</li>
              <li>• Count in your head</li>
              <li>• Practice with the same bottle</li>
              <li>• Aim for 95%+ accuracy</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal, GoalType } from '@/types';
import {
  getActiveGoals,
  getCompletedGoals,
  createGoal,
  saveGoal,
  incrementGoal,
  completeGoal,
  deleteGoal,
  getGoalProgress,
} from '@/lib/goals';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Input from '@/components/ui/Input';
import {
  Target,
  Trophy,
  Calendar,
  TrendingUp,
  Plus,
  CheckCircle,
  Trash2,
  Zap,
  Award,
  Clock,
} from 'lucide-react';

type GoalMetric = 'flashcards' | 'quizzes' | 'recipes' | 'games' | 'xp' | 'streak';

export default function GoalsPage() {
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState<'active' | 'completed'>('active');

  // Form state
  const [newGoalType, setNewGoalType] = useState<GoalType>('daily');
  const [newGoalMetric, setNewGoalMetric] = useState<GoalMetric>('quizzes');
  const [newGoalTarget, setNewGoalTarget] = useState('5');
  const [newGoalTitle, setNewGoalTitle] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    setActiveGoals(getActiveGoals());
    setCompletedGoals(getCompletedGoals());
  };

  const handleCreateGoal = () => {
    if (!newGoalTitle.trim() || parseInt(newGoalTarget) <= 0) return;

    const durationDays = newGoalType === 'daily' ? 1 : newGoalType === 'weekly' ? 7 : 30;
    const goal = createGoal(
      newGoalType,
      newGoalMetric,
      parseInt(newGoalTarget),
      durationDays,
      newGoalTitle.trim()
    );

    // Save the goal to localStorage
    saveGoal(goal);

    // Reset form
    setNewGoalTitle('');
    setNewGoalTarget('5');
    setNewGoalMetric('quizzes');
    setNewGoalType('daily');
    setShowCreateForm(false);

    loadGoals();
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
      loadGoals();
    }
  };

  const handleCompleteGoal = (id: string) => {
    completeGoal(id);
    loadGoals();
  };

  const getGoalTypeIcon = (type: GoalType) => {
    switch (type) {
      case 'daily':
        return <Zap className="w-5 h-5 text-yellow-600" />;
      case 'weekly':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'monthly':
        return <Trophy className="w-5 h-5 text-purple-600" />;
    }
  };

  const getGoalTypeColor = (type: GoalType) => {
    switch (type) {
      case 'daily':
        return 'border-yellow-500 bg-yellow-50';
      case 'weekly':
        return 'border-blue-500 bg-blue-50';
      case 'monthly':
        return 'border-purple-500 bg-purple-50';
    }
  };

  const getMetricLabel = (metric: GoalMetric) => {
    switch (metric) {
      case 'quizzes':
        return 'Quizzes Completed';
      case 'flashcards':
        return 'Flashcards Reviewed';
      case 'recipes':
        return 'Recipes Learned';
      case 'games':
        return 'Games Played';
      case 'xp':
        return 'XP Earned';
      case 'streak':
        return 'Study Streak Days';
    }
  };

  const getDaysRemaining = (goal: Goal) => {
    const now = new Date();
    const end = new Date(goal.endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getTimeRemainingText = (goal: Goal) => {
    const days = getDaysRemaining(goal);
    if (days === 0) return 'Ends today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Goals & Tracking</h1>
              <p className="text-gray-600">Set targets and track your bartending journey</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Plus className="w-5 h-5 mr-2" />
              New Goal
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{activeGoals.length}</div>
                  <div className="text-xs text-gray-600">Active Goals</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{completedGoals.length}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {activeGoals.length > 0
                      ? Math.round(
                          activeGoals.reduce((sum, g) => sum + getGoalProgress(g), 0) /
                            activeGoals.length
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-gray-600">Avg Progress</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {activeGoals.filter(g => getGoalProgress(g) >= 100).length}
                  </div>
                  <div className="text-xs text-gray-600">Ready to Complete</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Create Goal Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="p-6 bg-white border-2 border-primary-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Goal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Goal Title
                    </label>
                    <Input
                      type="text"
                      value={newGoalTitle}
                      onChange={(value) => setNewGoalTitle(value)}
                      placeholder="e.g., Master Classic Cocktails"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Goal Type
                    </label>
                    <select
                      value={newGoalType}
                      onChange={(e) => setNewGoalType(e.target.value as GoalType)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="daily">Daily Goal</option>
                      <option value="weekly">Weekly Goal</option>
                      <option value="monthly">Monthly Goal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Metric to Track
                    </label>
                    <select
                      value={newGoalMetric}
                      onChange={(e) => setNewGoalMetric(e.target.value as GoalMetric)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="quizzes">Quizzes Completed</option>
                      <option value="flashcards">Flashcards Reviewed</option>
                      <option value="recipes">Recipes Learned</option>
                      <option value="games">Games Played</option>
                      <option value="xp">XP Earned</option>
                      <option value="streak">Study Streak Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Amount
                    </label>
                    <Input
                      type="number"
                      value={newGoalTarget}
                      onChange={(value) => setNewGoalTarget(value)}
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="primary" onClick={handleCreateGoal}>
                    Create Goal
                  </Button>
                  <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={viewMode === 'active' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('active')}
          >
            Active Goals ({activeGoals.length})
          </Button>
          <Button
            variant={viewMode === 'completed' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('completed')}
          >
            Completed ({completedGoals.length})
          </Button>
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 gap-4">
          {viewMode === 'active' && activeGoals.length === 0 && (
            <Card className="p-12 text-center">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Active Goals</h3>
              <p className="text-gray-500 mb-6">
                Create your first goal to start tracking your progress!
              </p>
              <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Goal
              </Button>
            </Card>
          )}

          {viewMode === 'completed' && completedGoals.length === 0 && (
            <Card className="p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Completed Goals Yet</h3>
              <p className="text-gray-500">
                Complete your active goals to see them here!
              </p>
            </Card>
          )}

          {viewMode === 'active' &&
            activeGoals.map((goal) => {
              const progress = getGoalProgress(goal);
              const isReady = progress >= 100;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className={`p-6 border-l-4 ${getGoalTypeColor(goal.type)}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        {getGoalTypeIcon(goal.type)}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">
                            {goal.title || `${goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} Goal`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {getMetricLabel(goal.metric)} • {goal.current} / {goal.target}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isReady && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleCompleteGoal(goal.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <ProgressBar
                      progress={Math.min(progress, 100)}
                      color={isReady ? 'success' : 'primary'}
                      height="md"
                    />

                    <div className="flex items-center justify-between mt-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{getTimeRemainingText(goal)}</span>
                      </div>
                      <div className="font-bold text-gray-900">
                        {progress.toFixed(0)}% Complete
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}

          {viewMode === 'completed' &&
            completedGoals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-300">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {goal.title || `${goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} Goal`}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {getMetricLabel(goal.metric)} • Completed {goal.current} / {goal.target}
                        </p>
                        <div className="text-xs text-gray-500">
                          Completed on {new Date(goal.completedAt!).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-500" />
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>

        {/* Pro Tips */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Pro Tips for Goal Setting
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Start with daily goals to build consistent study habits</li>
            <li>• Set realistic targets - it's better to complete small goals regularly</li>
            <li>• Use weekly goals for skill-building and recipe mastery</li>
            <li>• Monthly goals are great for long-term certification prep</li>
            <li>• Your goals auto-update as you complete quizzes and study activities!</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

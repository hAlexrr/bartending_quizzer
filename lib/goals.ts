import { Goal } from '@/types';
import { generateId } from './storage';

const STORAGE_KEY = 'bartending-quizzer-goals';

export function getGoals(): Goal[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return parsed.map((goal: any) => ({
      ...goal,
      startDate: new Date(goal.startDate),
      endDate: new Date(goal.endDate),
      completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
    }));
  } catch (error) {
    console.error('Error loading goals:', error);
    return [];
  }
}

export function getActiveGoals(): Goal[] {
  const now = new Date();
  return getGoals().filter(g => !g.completed && g.endDate >= now);
}

export function getCompletedGoals(): Goal[] {
  return getGoals().filter(g => g.completed);
}

export function getGoal(id: string): Goal | undefined {
  return getGoals().find(g => g.id === id);
}

export function saveGoal(goal: Goal): void {
  const goals = getGoals();
  const existingIndex = goals.findIndex(g => g.id === goal.id);

  if (existingIndex >= 0) {
    goals[existingIndex] = goal;
  } else {
    goals.push(goal);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export function deleteGoal(id: string): void {
  const goals = getGoals().filter(g => g.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export function updateGoalProgress(id: string, progress: number): void {
  const goals = getGoals();
  const goal = goals.find(g => g.id === id);

  if (goal) {
    goal.current = Math.min(progress, goal.target);

    // Check if goal is completed
    if (goal.current >= goal.target && !goal.completed) {
      goal.completed = true;
      goal.completedAt = new Date();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }
}

export function incrementGoal(id: string, amount: number = 1): void {
  const goals = getGoals();
  const goal = goals.find(g => g.id === id);

  if (goal) {
    goal.current = Math.min(goal.current + amount, goal.target);

    // Check if goal is completed
    if (goal.current >= goal.target && !goal.completed) {
      goal.completed = true;
      goal.completedAt = new Date();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }
}

export function createGoal(
  type: Goal['type'],
  metric: Goal['metric'],
  target: number,
  durationDays: number = 7,
  title?: string
): Goal {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + durationDays);

  const goal: Goal = {
    id: generateId(),
    type,
    target,
    current: 0,
    metric,
    startDate,
    endDate,
    completed: false,
  };

  if (title) {
    goal.title = title;
  }

  return goal;
}

export function completeGoal(id: string): void {
  const goals = getGoals();
  const goal = goals.find(g => g.id === id);

  if (goal) {
    goal.completed = true;
    goal.completedAt = new Date();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }
}

export function getTodaysGoals(): Goal[] {
  return getActiveGoals().filter(g => g.type === 'daily');
}

export function getWeeklyGoals(): Goal[] {
  return getActiveGoals().filter(g => g.type === 'weekly');
}

export function getMonthlyGoals(): Goal[] {
  return getActiveGoals().filter(g => g.type === 'monthly');
}

export function getGoalProgress(goal: Goal): number {
  return goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
}

export function getDaysRemaining(goal: Goal): number {
  const now = new Date();
  const diff = goal.endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getStreakGoal(): number {
  // This would integrate with actual streak tracking
  // For now, return a dummy value
  return 5;
}

export function autoIncrementGoalsByActivity(
  activity: 'flashcard' | 'quiz' | 'recipe' | 'game',
  count: number = 1
): void {
  const activeGoals = getActiveGoals();

  activeGoals.forEach(goal => {
    if (
      (goal.metric === 'flashcards' && activity === 'flashcard') ||
      (goal.metric === 'quizzes' && activity === 'quiz') ||
      (goal.metric === 'recipes' && activity === 'recipe') ||
      (goal.metric === 'games' && activity === 'game')
    ) {
      incrementGoal(goal.id, count);
    }
  });
}

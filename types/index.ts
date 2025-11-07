// Core data types for the bartending education platform

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: 'recipe' | 'technique' | 'terminology' | 'measurement' | 'ingredient';
  tags: string[];
  createdAt: Date;
  difficulty?: 1 | 2 | 3; // 1 = Easy, 2 = Medium, 3 = Hard
  lastReviewed?: Date;
  reviewCount: number;
  correctCount: number;
  // Spaced Repetition System fields
  confidenceLevel: 1 | 2 | 3 | 4 | 5; // 1 = Need to learn, 5 = Mastered
  nextReview?: Date;
  recipeId?: string; // Link to source recipe if auto-generated
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: Question[];
  timeLimit?: number; // in seconds
  passingScore: number; // percentage
  createdAt: Date;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: UserAnswer[];
  completedAt: Date;
  timeSpent: number; // in seconds
  passed: boolean;
}

export interface UserAnswer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
}

export interface GameSession {
  id: string;
  gameType: 'measurement' | 'ingredient-match' | 'speed-pour' | 'recipe-builder';
  score: number;
  accuracy: number;
  timeSpent: number;
  level: number;
  completedAt: Date;
  achievements?: string[];
}

export interface UserProgress {
  totalFlashcardsReviewed: number;
  totalQuizzesTaken: number;
  totalGamesPlayed: number;
  averageQuizScore: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  level: number;
  experiencePoints: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

export interface DrinkRecipe {
  id: string;
  name: string;
  category: string;
  ingredients: Ingredient[];
  instructions: string[];
  glassware: string;
  garnish?: string;
  difficulty: 1 | 2 | 3;
  imageUrl?: string;
  // Custom recipe enhancements
  tags: string[]; // e.g., ['House Special', 'Summer Menu', 'VIP']
  notes?: string; // Personal notes and variations
  createdAt: Date;
  updatedAt: Date;
  isCustom: boolean; // True if user-created, false if pre-loaded
  // Spaced Repetition System fields
  confidenceLevel: 1 | 2 | 3 | 4 | 5; // How well you know this recipe
  lastReviewed?: Date;
  nextReview?: Date;
  timesReviewed: number;
  timesCorrect: number;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: 'oz' | 'ml' | 'dash' | 'splash' | 'piece' | 'leaf' | 'wedge';
  optional?: boolean;
}

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

// Import/Export types
export interface ExportData {
  version: string;
  exportedAt: Date;
  recipes: DrinkRecipe[];
  flashcards: Flashcard[];
  quizzes: Quiz[];
  userProgress: UserProgress;
}

export interface RecipeCollection {
  name: string;
  description: string;
  recipes: DrinkRecipe[];
  createdAt: Date;
  author?: string;
}

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

// Study Path types
export interface StudyPath {
  id: string;
  name: string;
  description: string;
  difficulty: 1 | 2 | 3;
  estimatedDays: number;
  modules: StudyModule[];
  prerequisites?: string[]; // IDs of paths that must be completed first
  createdAt: Date;
  isCustom: boolean;
}

export interface StudyModule {
  id: string;
  name: string;
  description: string;
  recipeIds: string[];
  flashcardIds: string[];
  quizIds: string[];
  requiredScore?: number; // Minimum score to pass module
  completed: boolean;
  completedAt?: Date;
}

export interface StudyPathProgress {
  pathId: string;
  currentModuleIndex: number;
  modulesCompleted: number;
  startedAt: Date;
  completedAt?: Date;
  overallScore: number;
}

// Wrong Answer Bank types
export interface WrongAnswer {
  id: string;
  type: 'flashcard' | 'quiz' | 'recipe';
  itemId: string; // ID of flashcard, quiz question, or recipe
  incorrectCount: number;
  lastIncorrect: Date;
  notes?: string;
}

// Goal types
export interface Goal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  target: number;
  current: number;
  metric: 'flashcards' | 'quizzes' | 'recipes' | 'games' | 'xp' | 'streak';
  startDate: Date;
  endDate: Date;
  completed: boolean;
  completedAt?: Date;
}

// Analytics types
export interface AnalyticsData {
  studySessionsByDay: { [date: string]: number };
  performanceByCategory: { [category: string]: number };
  timeSpentByActivity: { [activity: string]: number };
  weeklyProgress: WeeklyProgress[];
  strongestCategories: string[];
  weakestCategories: string[];
  averageSessionDuration: number;
  totalStudyTime: number;
}

export interface WeeklyProgress {
  week: string;
  flashcardsReviewed: number;
  quizzesTaken: number;
  gamesPlayed: number;
  averageScore: number;
  totalXP: number;
}

export interface SessionReport {
  id: string;
  type: 'flashcard' | 'quiz' | 'game' | 'recipe';
  startTime: Date;
  endTime: Date;
  duration: number;
  itemsReviewed: number;
  correctAnswers: number;
  accuracy: number;
  xpEarned: number;
  insights: string[];
}

// Inventory types
export interface InventoryItem {
  id: string;
  name: string;
  category: 'spirit' | 'liqueur' | 'mixer' | 'garnish' | 'other';
  quantity: number;
  unit: string;
  cost: number;
  costPerUnit: number;
  lowStockThreshold: number;
  inStock: boolean;
  lastRestocked?: Date;
}

export interface RecipeCost {
  recipeId: string;
  totalCost: number;
  costBreakdown: { ingredient: string; cost: number }[];
  profitMargin?: number;
  suggestedPrice?: number;
}

// Substitution types
export interface IngredientSubstitution {
  original: string;
  substitute: string;
  ratio: number; // e.g., 1.0 for 1:1, 0.5 for half the amount
  notes: string;
  flavorImpact: 'minimal' | 'moderate' | 'significant';
}

// Menu types
export interface Menu {
  id: string;
  name: string;
  description: string;
  recipeIds: string[];
  sections: MenuSection[];
  theme?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuSection {
  id: string;
  name: string;
  description?: string;
  recipeIds: string[];
  order: number;
}

// Allergen & Safety types
export interface AllergenInfo {
  name: string;
  commonIn: string[];
  severity: 'mild' | 'moderate' | 'severe';
  substitutes: string[];
}

export interface SafetyScenario {
  id: string;
  title: string;
  description: string;
  options: ScenarioOption[];
  correctOptionId: string;
  explanation: string;
  category: 'alcohol-service' | 'allergens' | 'hygiene' | 'emergency';
}

export interface ScenarioOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Flair Bartending types
export interface FlairMove {
  id: string;
  name: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
  videoUrl?: string;
  prerequisites: string[]; // IDs of moves to learn first
  tips: string[];
  commonMistakes: string[];
}

export interface FlairRoutine {
  id: string;
  name: string;
  moves: string[]; // Ordered array of move IDs
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: number; // in seconds
}

// Wine & Beer types
export interface WineProfile {
  id: string;
  name: string;
  type: 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert';
  varietal: string;
  region?: string;
  tastingNotes: string[];
  pairsWith: string[]; // Cocktail IDs or food types
  servingTemp: string;
}

export interface BeerProfile {
  id: string;
  name: string;
  style: string;
  abv: number;
  ibu?: number;
  tastingNotes: string[];
  pairsWith: string[];
}

// Mocktail types
export interface Mocktail extends Omit<DrinkRecipe, 'category'> {
  category: 'mocktail';
  alcoholicVersion?: string; // ID of the alcoholic version
  naSpirits?: string[]; // Non-alcoholic spirit brands used
}

// Theme types
export interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  highContrast: boolean;
  dyslexiaFriendly: boolean;
}

// Voice Command types
export interface VoiceCommand {
  command: string;
  action: string;
  parameters?: { [key: string]: string };
}

// Offline Mode types
export interface OfflineData {
  recipes: DrinkRecipe[];
  flashcards: Flashcard[];
  quizzes: Quiz[];
  lastSync: Date;
  pendingChanges: PendingChange[];
}

export interface PendingChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'recipe' | 'flashcard' | 'quiz' | 'progress';
  data: any;
  timestamp: Date;
}

// Print types
export interface PrintTemplate {
  id: string;
  name: string;
  type: 'recipe-card' | 'menu' | 'study-guide' | 'reference-sheet';
  size: '4x6' | 'letter' | 'a4' | 'pocket';
  waterproof: boolean;
}

// Game-specific types
export interface BuildDrinkGame {
  id: string;
  recipeId: string;
  playerIngredients: { ingredient: string; amount: number; unit: string }[];
  timeStarted: Date;
  timeCompleted?: Date;
  score: number;
  accuracy: number;
}

export interface SpeedRoundChallenge {
  id: string;
  questions: SpeedQuestion[];
  currentQuestionIndex: number;
  correctAnswers: number;
  timeRemaining: number;
  timeLimit: number;
}

export interface SpeedQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  userAnswer?: string;
  timeToAnswer?: number;
  points: number;
}

export interface BartenderRushOrder {
  id: string;
  recipeId: string;
  customerId: number;
  orderTime: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  timeLimit: number;
}

export interface PouringPractice {
  id: string;
  targetAmount: number;
  targetUnit: string;
  pourAttempts: PourAttempt[];
  averageAccuracy: number;
}

export interface PourAttempt {
  amount: number;
  accuracy: number;
  duration: number;
}

// Extended GameSession to include new game types
export type ExtendedGameType =
  | 'measurement'
  | 'ingredient-match'
  | 'speed-pour'
  | 'recipe-builder'
  | 'build-drink'
  | 'speed-round'
  | 'bartender-rush'
  | 'pouring-practice';

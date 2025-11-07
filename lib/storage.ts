// Local storage utilities for data persistence
import { Flashcard, Quiz, QuizResult, GameSession, UserProgress, DrinkRecipe, ExportData, RecipeCollection } from '@/types';

// Generic storage helper
const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item, dateReviver) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }
};

// Date reviver for JSON.parse to properly deserialize dates
function dateReviver(key: string, value: any): any {
  const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
  if (typeof value === 'string' && datePattern.test(value)) {
    return new Date(value);
  }
  return value;
}

// Flashcards
export const getFlashcards = (): Flashcard[] => {
  return storage.get<Flashcard[]>('flashcards') || [];
};

export const saveFlashcard = (flashcard: Flashcard): void => {
  const flashcards = getFlashcards();
  const existingIndex = flashcards.findIndex(f => f.id === flashcard.id);

  if (existingIndex >= 0) {
    flashcards[existingIndex] = flashcard;
  } else {
    flashcards.push(flashcard);
  }

  storage.set('flashcards', flashcards);
};

export const deleteFlashcard = (id: string): void => {
  const flashcards = getFlashcards().filter(f => f.id !== id);
  storage.set('flashcards', flashcards);
};

export const updateFlashcardReview = (id: string, correct: boolean): void => {
  const flashcards = getFlashcards();
  const flashcard = flashcards.find(f => f.id === id);

  if (flashcard) {
    flashcard.lastReviewed = new Date();
    flashcard.reviewCount++;
    if (correct) flashcard.correctCount++;
    storage.set('flashcards', flashcards);
  }
};

// Quizzes
export const getQuizzes = (): Quiz[] => {
  return storage.get<Quiz[]>('quizzes') || [];
};

export const saveQuiz = (quiz: Quiz): void => {
  const quizzes = getQuizzes();
  const existingIndex = quizzes.findIndex(q => q.id === quiz.id);

  if (existingIndex >= 0) {
    quizzes[existingIndex] = quiz;
  } else {
    quizzes.push(quiz);
  }

  storage.set('quizzes', quizzes);
};

export const deleteQuiz = (id: string): void => {
  const quizzes = getQuizzes().filter(q => q.id !== id);
  storage.set('quizzes', quizzes);
};

// Quiz Results
export const getQuizResults = (): QuizResult[] => {
  return storage.get<QuizResult[]>('quizResults') || [];
};

export const saveQuizResult = (result: QuizResult): void => {
  const results = getQuizResults();
  results.push(result);
  storage.set('quizResults', results);
};

// Game Sessions
export const getGameSessions = (): GameSession[] => {
  return storage.get<GameSession[]>('gameSessions') || [];
};

export const saveGameSession = (session: GameSession): void => {
  const sessions = getGameSessions();
  sessions.push(session);
  storage.set('gameSessions', sessions);
};

// User Progress
export const getUserProgress = (): UserProgress => {
  return storage.get<UserProgress>('userProgress') || {
    totalFlashcardsReviewed: 0,
    totalQuizzesTaken: 0,
    totalGamesPlayed: 0,
    averageQuizScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: [],
    level: 1,
    experiencePoints: 0,
  };
};

export const updateUserProgress = (updates: Partial<UserProgress>): void => {
  const progress = getUserProgress();
  const updated = { ...progress, ...updates };
  storage.set('userProgress', updated);
};

export const addExperiencePoints = (points: number): void => {
  const progress = getUserProgress();
  progress.experiencePoints += points;

  // Level up logic (100 XP per level)
  const newLevel = Math.floor(progress.experiencePoints / 100) + 1;
  if (newLevel > progress.level) {
    progress.level = newLevel;
  }

  storage.set('userProgress', progress);
};

// Drink Recipes
export const getRecipes = (): DrinkRecipe[] => {
  return storage.get<DrinkRecipe[]>('recipes') || [];
};

export const saveRecipe = (recipe: DrinkRecipe): void => {
  const recipes = getRecipes();
  const existingIndex = recipes.findIndex(r => r.id === recipe.id);

  if (existingIndex >= 0) {
    recipes[existingIndex] = recipe;
  } else {
    recipes.push(recipe);
  }

  storage.set('recipes', recipes);
};

export const deleteRecipe = (id: string): void => {
  const recipes = getRecipes().filter(r => r.id !== id);
  storage.set('recipes', recipes);
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Spaced Repetition System functions
export const updateFlashcardConfidence = (id: string, confidenceLevel: 1 | 2 | 3 | 4 | 5): void => {
  const flashcards = getFlashcards();
  const flashcard = flashcards.find(f => f.id === id);

  if (flashcard) {
    flashcard.confidenceLevel = confidenceLevel;
    flashcard.lastReviewed = new Date();
    flashcard.nextReview = calculateNextReview(confidenceLevel);
    storage.set('flashcards', flashcards);
  }
};

export const updateRecipeConfidence = (id: string, confidenceLevel: 1 | 2 | 3 | 4 | 5, correct: boolean): void => {
  const recipes = getRecipes();
  const recipe = recipes.find(r => r.id === id);

  if (recipe) {
    recipe.confidenceLevel = confidenceLevel;
    recipe.lastReviewed = new Date();
    recipe.nextReview = calculateNextReview(confidenceLevel);
    recipe.timesReviewed++;
    if (correct) recipe.timesCorrect++;
    recipe.updatedAt = new Date();
    storage.set('recipes', recipes);
  }
};

// Calculate next review date based on confidence level (SRS algorithm)
export const calculateNextReview = (confidenceLevel: 1 | 2 | 3 | 4 | 5): Date => {
  const now = new Date();
  const intervals = {
    1: 1,      // 1 day - need to learn
    2: 3,      // 3 days - getting it
    3: 7,      // 1 week - pretty good
    4: 14,     // 2 weeks - confident
    5: 30      // 1 month - mastered
  };

  const daysToAdd = intervals[confidenceLevel];
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + daysToAdd);
  return nextReview;
};

// Get items that need review
export const getFlashcardsNeedingReview = (): Flashcard[] => {
  const flashcards = getFlashcards();
  const now = new Date();
  return flashcards.filter(f => {
    if (!f.nextReview) return true; // Never reviewed
    return new Date(f.nextReview) <= now;
  });
};

export const getRecipesNeedingReview = (): DrinkRecipe[] => {
  const recipes = getRecipes();
  const now = new Date();
  return recipes.filter(r => {
    if (!r.nextReview) return true; // Never reviewed
    return new Date(r.nextReview) <= now;
  });
};

// Import/Export functions
export const exportAllData = (): ExportData => {
  return {
    version: '1.0',
    exportedAt: new Date(),
    recipes: getRecipes(),
    flashcards: getFlashcards(),
    quizzes: getQuizzes(),
    userProgress: getUserProgress(),
  };
};

export const importData = (data: ExportData): void => {
  if (data.recipes) storage.set('recipes', data.recipes);
  if (data.flashcards) storage.set('flashcards', data.flashcards);
  if (data.quizzes) storage.set('quizzes', data.quizzes);
  if (data.userProgress) storage.set('userProgress', data.userProgress);
};

export const exportRecipeCollection = (recipeIds: string[], name: string, description: string): RecipeCollection => {
  const allRecipes = getRecipes();
  const selectedRecipes = allRecipes.filter(r => recipeIds.includes(r.id));

  return {
    name,
    description,
    recipes: selectedRecipes,
    createdAt: new Date(),
  };
};

export const importRecipeCollection = (collection: RecipeCollection): void => {
  const existingRecipes = getRecipes();
  const newRecipes = collection.recipes.map(r => ({
    ...r,
    id: generateId(), // Generate new IDs to avoid conflicts
    isCustom: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  storage.set('recipes', [...existingRecipes, ...newRecipes]);
};

// CSV Export/Import for recipes
export const exportRecipesToCSV = (): string => {
  const recipes = getRecipes();
  const headers = ['Name', 'Category', 'Ingredients', 'Instructions', 'Glassware', 'Garnish', 'Difficulty', 'Tags', 'Notes'];

  const rows = recipes.map(r => [
    r.name,
    r.category,
    r.ingredients.map(i => `${i.amount}${i.unit} ${i.name}`).join('; '),
    r.instructions.join('; '),
    r.glassware,
    r.garnish || '',
    r.difficulty.toString(),
    r.tags.join('; '),
    r.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};

export const importRecipesFromCSV = (csvContent: string): DrinkRecipe[] => {
  const lines = csvContent.split('\n');
  const recipes: DrinkRecipe[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (handles quoted fields)
    const fields: string[] = [];
    let currentField = '';
    let insideQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        fields.push(currentField);
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField);

    if (fields.length >= 7) {
      const [name, category, ingredientsStr, instructionsStr, glassware, garnish, difficultyStr, tagsStr = '', notesStr = ''] = fields;

      // Parse ingredients
      const ingredients = ingredientsStr.split(';').map(ing => {
        const match = ing.trim().match(/^([\d.]+)(\w+)\s+(.+)$/);
        if (match) {
          return {
            name: match[3],
            amount: parseFloat(match[1]),
            unit: match[2] as any,
          };
        }
        return { name: ing.trim(), amount: 0, unit: 'oz' as const };
      });

      recipes.push({
        id: generateId(),
        name,
        category,
        ingredients,
        instructions: instructionsStr.split(';').map(s => s.trim()),
        glassware,
        garnish: garnish || undefined,
        difficulty: parseInt(difficultyStr) as 1 | 2 | 3,
        tags: tagsStr ? tagsStr.split(';').map(t => t.trim()) : [],
        notes: notesStr || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        isCustom: true,
        confidenceLevel: 1,
        timesReviewed: 0,
        timesCorrect: 0,
      });
    }
  }

  // Save imported recipes
  const existingRecipes = getRecipes();
  storage.set('recipes', [...existingRecipes, ...recipes]);

  return recipes;
};

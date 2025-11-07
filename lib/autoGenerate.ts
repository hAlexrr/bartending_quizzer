// Auto-generate study materials from recipes
import { DrinkRecipe, Flashcard, Quiz, Question } from '@/types';
import { generateId } from './storage';

/**
 * Generate flashcards from a recipe
 * Creates multiple flashcards covering different aspects of the recipe
 */
export const generateFlashcardsFromRecipe = (recipe: DrinkRecipe): Flashcard[] => {
  const flashcards: Flashcard[] = [];
  const now = new Date();

  // Flashcard 1: Ingredients list
  flashcards.push({
    id: generateId(),
    front: `What are the ingredients for a ${recipe.name}?`,
    back: recipe.ingredients
      .map(i => `${i.amount}${i.unit} ${i.name}${i.optional ? ' (optional)' : ''}`)
      .join('\n'),
    category: 'recipe',
    tags: [...recipe.tags, recipe.category, 'ingredients'],
    createdAt: now,
    difficulty: recipe.difficulty,
    reviewCount: 0,
    correctCount: 0,
    confidenceLevel: 1,
    recipeId: recipe.id,
  });

  // Flashcard 2: Instructions
  if (recipe.instructions.length > 0) {
    flashcards.push({
      id: generateId(),
      front: `How do you make a ${recipe.name}?`,
      back: recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n'),
      category: 'technique',
      tags: [...recipe.tags, recipe.category, 'preparation'],
      createdAt: now,
      difficulty: recipe.difficulty,
      reviewCount: 0,
      correctCount: 0,
      confidenceLevel: 1,
      recipeId: recipe.id,
    });
  }

  // Flashcard 3: Glassware
  flashcards.push({
    id: generateId(),
    front: `What glassware is used for a ${recipe.name}?`,
    back: recipe.glassware,
    category: 'recipe',
    tags: [...recipe.tags, recipe.category, 'glassware'],
    createdAt: now,
    difficulty: 1,
    reviewCount: 0,
    correctCount: 0,
    confidenceLevel: 1,
    recipeId: recipe.id,
  });

  // Flashcard 4: Garnish (if applicable)
  if (recipe.garnish) {
    flashcards.push({
      id: generateId(),
      front: `What is the garnish for a ${recipe.name}?`,
      back: recipe.garnish,
      category: 'recipe',
      tags: [...recipe.tags, recipe.category, 'garnish'],
      createdAt: now,
      difficulty: 1,
      reviewCount: 0,
      correctCount: 0,
      confidenceLevel: 1,
      recipeId: recipe.id,
    });
  }

  // Flashcard 5: Full recipe card
  const recipeDetails = [
    `**Ingredients:**`,
    ...recipe.ingredients.map(i => `• ${i.amount}${i.unit} ${i.name}`),
    `\n**Glass:** ${recipe.glassware}`,
  ];
  if (recipe.garnish) recipeDetails.push(`**Garnish:** ${recipe.garnish}`);
  if (recipe.notes) recipeDetails.push(`\n**Notes:** ${recipe.notes}`);

  flashcards.push({
    id: generateId(),
    front: `Complete recipe card: ${recipe.name}`,
    back: recipeDetails.join('\n'),
    category: 'recipe',
    tags: [...recipe.tags, recipe.category, 'complete-recipe'],
    createdAt: now,
    difficulty: recipe.difficulty,
    reviewCount: 0,
    correctCount: 0,
    confidenceLevel: 1,
    recipeId: recipe.id,
  });

  return flashcards;
};

/**
 * Generate a quiz from multiple recipes
 */
export const generateQuizFromRecipes = (recipes: DrinkRecipe[], title?: string): Quiz => {
  const questions: Question[] = [];

  recipes.forEach(recipe => {
    // Question 1: Multiple choice - Main ingredient
    const mainIngredient = recipe.ingredients[0];
    if (mainIngredient) {
      questions.push({
        id: generateId(),
        type: 'multiple-choice',
        question: `What is the main spirit in a ${recipe.name}?`,
        options: [
          mainIngredient.name,
          'Vodka',
          'Rum',
          'Tequila',
          'Whiskey',
        ].filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 4), // Unique options
        correctAnswer: mainIngredient.name,
        explanation: `A ${recipe.name} is made with ${mainIngredient.name} as the base spirit.`,
        points: 10,
      });
    }

    // Question 2: Fill in blank - Glassware
    questions.push({
      id: generateId(),
      type: 'fill-in-blank',
      question: `A ${recipe.name} is served in a _________.`,
      correctAnswer: recipe.glassware.toLowerCase(),
      explanation: `The ${recipe.name} is traditionally served in a ${recipe.glassware}.`,
      points: 10,
    });

    // Question 3: True/False - Ingredient check
    const randomIngredient = recipe.ingredients[Math.floor(Math.random() * recipe.ingredients.length)];
    const hasIngredient = Math.random() > 0.5;
    questions.push({
      id: generateId(),
      type: 'true-false',
      question: `A ${recipe.name} contains ${randomIngredient.name}. True or False?`,
      correctAnswer: 'true',
      explanation: `Yes, a ${recipe.name} includes ${randomIngredient.amount}${randomIngredient.unit} of ${randomIngredient.name}.`,
      points: 5,
    });
  });

  return {
    id: generateId(),
    title: title || `Quiz: ${recipes.map(r => r.name).join(', ')}`,
    description: `Test your knowledge of ${recipes.length} cocktail recipe${recipes.length > 1 ? 's' : ''}`,
    category: recipes[0]?.category || 'Mixed',
    questions: questions.slice(0, 10), // Limit to 10 questions
    timeLimit: 300, // 5 minutes
    passingScore: 70,
    createdAt: new Date(),
  };
};

/**
 * Generate ingredient matching data from recipes
 */
export const generateIngredientMatchFromRecipes = (recipes: DrinkRecipe[]) => {
  return recipes.slice(0, 4).map(recipe => ({
    recipeName: recipe.name,
    correctIngredients: recipe.ingredients.map(i => i.name),
    allIngredients: [
      ...recipe.ingredients.map(i => i.name),
      // Add some common distractors
      'Simple Syrup',
      'Bitters',
      'Soda Water',
      'Tonic Water',
      'Orange Juice',
      'Cranberry Juice',
    ].filter((v, i, arr) => arr.indexOf(v) === i), // Unique
  }));
};

/**
 * Bulk generate flashcards from all recipes
 */
export const bulkGenerateFlashcards = (recipes: DrinkRecipe[]): Flashcard[] => {
  const allFlashcards: Flashcard[] = [];
  recipes.forEach(recipe => {
    const flashcards = generateFlashcardsFromRecipe(recipe);
    allFlashcards.push(...flashcards);
  });
  return allFlashcards;
};

'use client';

import { useRouter } from 'next/navigation';
import { saveRecipe } from '@/lib/storage';
import { DrinkRecipe } from '@/types';
import RecipeForm from '@/components/recipes/RecipeForm';

export default function NewRecipePage() {
  const router = useRouter();

  const handleSubmit = (recipe: DrinkRecipe) => {
    saveRecipe(recipe);
    router.push('/recipes');
  };

  const handleCancel = () => {
    router.push('/recipes');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Recipe</h1>
          <p className="text-gray-600">Add a custom cocktail recipe to your collection</p>
        </div>

        <RecipeForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}

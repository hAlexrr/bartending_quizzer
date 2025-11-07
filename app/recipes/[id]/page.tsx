'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRecipes, saveRecipe } from '@/lib/storage';
import { DrinkRecipe } from '@/types';
import RecipeForm from '@/components/recipes/RecipeForm';

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<DrinkRecipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recipes = getRecipes();
    const found = recipes.find(r => r.id === params.id);
    setRecipe(found || null);
    setLoading(false);
  }, [params.id]);

  const handleSubmit = (updatedRecipe: DrinkRecipe) => {
    saveRecipe(updatedRecipe);
    router.push('/recipes');
  };

  const handleCancel = () => {
    router.push('/recipes');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600">Recipe not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Recipe</h1>
          <p className="text-gray-600">Update {recipe.name}</p>
        </div>

        <RecipeForm recipe={recipe} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}

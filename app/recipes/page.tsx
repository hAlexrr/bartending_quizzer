'use client';

import { useState, useEffect } from 'react';
import { DrinkRecipe } from '@/types';
import { getRecipes, deleteRecipe, getRecipesNeedingReview } from '@/lib/storage';
import { generateFlashcardsFromRecipe, generateQuizFromRecipes } from '@/lib/autoGenerate';
import { saveFlashcard, saveQuiz } from '@/lib/storage';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { Plus, Search, Filter, Download, Upload, Star, BookOpen, Trash2, Edit, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<DrinkRecipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<DrinkRecipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
  const [needsReviewCount, setNeedsReviewCount] = useState(0);

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchQuery, selectedCategory, selectedTags]);

  const loadRecipes = () => {
    const allRecipes = getRecipes();
    setRecipes(allRecipes);

    const needsReview = getRecipesNeedingReview();
    setNeedsReviewCount(needsReview.length);
  };

  const filterRecipes = () => {
    let filtered = recipes;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(r =>
        selectedTags.every(tag => r.tags.includes(tag))
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleDelete = (id: string) => {
    setRecipeToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (recipeToDelete) {
      deleteRecipe(recipeToDelete);
      loadRecipes();
      setShowDeleteModal(false);
      setRecipeToDelete(null);
    }
  };

  const handleGenerateFlashcards = (recipe: DrinkRecipe) => {
    const flashcards = generateFlashcardsFromRecipe(recipe);
    flashcards.forEach(f => saveFlashcard(f));
    alert(`Generated ${flashcards.length} flashcards for ${recipe.name}!`);
  };

  const handleGenerateQuizFromSelected = () => {
    if (filteredRecipes.length === 0) {
      alert('No recipes to generate quiz from!');
      return;
    }

    const quiz = generateQuizFromRecipes(filteredRecipes.slice(0, 5));
    saveQuiz(quiz);
    alert(`Generated quiz with ${quiz.questions.length} questions!`);
    router.push('/quizzes');
  };

  const categories = Array.from(new Set(recipes.map(r => r.category)));
  const allTags = Array.from(new Set(recipes.flatMap(r => r.tags)));

  const getConfidenceColor = (level: number) => {
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-blue-100 text-blue-800',
      5: 'bg-green-100 text-green-800',
    };
    return colors[level as keyof typeof colors] || colors[1];
  };

  const getConfidenceLabel = (level: number) => {
    const labels = {
      1: 'Need to Learn',
      2: 'Getting It',
      3: 'Pretty Good',
      4: 'Confident',
      5: 'Mastered',
    };
    return labels[level as keyof typeof labels] || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Recipe Manager</h1>
          <p className="text-gray-600">Manage your custom cocktail recipes and auto-generate study materials</p>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[200px] max-w-md">
            <Input
              type="text"
              placeholder="Search recipes, ingredients, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {needsReviewCount > 0 && (
              <Button
                variant="secondary"
                onClick={() => router.push('/recipes/review')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Review ({needsReviewCount})
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            <Button
              variant="secondary"
              onClick={handleGenerateQuizFromSelected}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Quiz
            </Button>

            <Button
              variant="secondary"
              onClick={() => router.push('/recipes/import-export')}
            >
              <Download className="w-4 h-4 mr-2" />
              Import/Export
            </Button>

            <Button
              onClick={() => router.push('/recipes/new')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Recipe
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6 p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={`cursor-pointer ${selectedCategory === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All
                  </Badge>
                  {categories.map(cat => (
                    <Badge
                      key={cat}
                      className={`cursor-pointer ${selectedCategory === cat ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      className={`cursor-pointer ${selectedTags.includes(tag) ? 'bg-accent-500 text-white' : 'bg-gray-200'}`}
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(selectedTags.filter(t => t !== tag));
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-gray-600">Total Recipes</div>
            <div className="text-2xl font-bold text-gray-900">{recipes.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Custom Recipes</div>
            <div className="text-2xl font-bold text-primary-600">
              {recipes.filter(r => r.isCustom).length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Needs Review</div>
            <div className="text-2xl font-bold text-orange-600">{needsReviewCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Mastered</div>
            <div className="text-2xl font-bold text-green-600">
              {recipes.filter(r => r.confidenceLevel === 5).length}
            </div>
          </Card>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <Card key={recipe.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{recipe.name}</h3>
                  <Badge className="bg-primary-100 text-primary-800">{recipe.category}</Badge>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: recipe.difficulty }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(recipe.confidenceLevel)}`}>
                  {getConfidenceLabel(recipe.confidenceLevel)}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Ingredients:</div>
                <ul className="text-sm space-y-1">
                  {recipe.ingredients.slice(0, 3).map((ing, i) => (
                    <li key={i} className="text-gray-700">
                      • {ing.amount}{ing.unit} {ing.name}
                    </li>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <li className="text-gray-500 italic">+ {recipe.ingredients.length - 3} more...</li>
                  )}
                </ul>
              </div>

              {recipe.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1">
                  {recipe.tags.map(tag => (
                    <Badge key={tag} className="bg-gray-100 text-gray-700 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/recipes/${recipe.id}`)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleGenerateFlashcards(recipe)}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Flashcards
                </Button>
                {recipe.isCustom && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recipes found. Try adjusting your filters.</p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Recipe"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this recipe? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { DrinkRecipe, Ingredient } from '@/types';
import { generateId } from '@/lib/storage';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Plus, X, Upload } from 'lucide-react';

interface RecipeFormProps {
  recipe?: DrinkRecipe;
  onSubmit: (recipe: DrinkRecipe) => void;
  onCancel: () => void;
}

export default function RecipeForm({ recipe, onSubmit, onCancel }: RecipeFormProps) {
  const [formData, setFormData] = useState<DrinkRecipe>(
    recipe || {
      id: generateId(),
      name: '',
      category: '',
      ingredients: [],
      instructions: [''],
      glassware: '',
      garnish: '',
      difficulty: 1,
      imageUrl: '',
      tags: [],
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      isCustom: true,
      confidenceLevel: 1,
      timesReviewed: 0,
      timesCorrect: 0,
    }
  );

  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({
    name: '',
    amount: 0,
    unit: 'oz',
  });

  const [newTag, setNewTag] = useState('');
  const [newInstruction, setNewInstruction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      updatedAt: new Date(),
    });
  };

  const addIngredient = () => {
    if (currentIngredient.name && currentIngredient.amount > 0) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, { ...currentIngredient }],
      });
      setCurrentIngredient({ name: '', amount: 0, unit: 'oz' });
    }
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const addInstruction = () => {
    if (newInstruction) {
      setFormData({
        ...formData,
        instructions: [...formData.instructions, newInstruction],
      });
      setNewInstruction('');
    }
  };

  const removeInstruction = (index: number) => {
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_, i) => i !== index),
    });
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...formData.instructions];
    updated[index] = value;
    setFormData({
      ...formData,
      instructions: updated,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipe Name *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            placeholder="e.g., Espresso Martini"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <Input
              type="text"
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
              placeholder="e.g., Vodka, Whiskey, Rum"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty *
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) as 1 | 2 | 3 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value={1}>Easy</option>
              <option value={2}>Medium</option>
              <option value={3}>Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Glassware *
            </label>
            <Input
              type="text"
              value={formData.glassware}
              onChange={(value) => setFormData({ ...formData, glassware: value })}
              placeholder="e.g., Coupe, Rocks Glass"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Garnish
            </label>
            <Input
              type="text"
              value={formData.garnish || ''}
              onChange={(value) => setFormData({ ...formData, garnish: value })}
              placeholder="e.g., Lemon twist"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </label>
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Recipe preview"
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h2>

        <div className="space-y-2">
          {formData.ingredients.map((ing, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <span className="flex-1">
                {ing.amount}{ing.unit} {ing.name}
                {ing.optional && <span className="text-gray-500 italic"> (optional)</span>}
              </span>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => removeIngredient(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-2">
            <Input
              type="number"
              step="0.25"
              value={currentIngredient.amount || ''}
              onChange={(value) => setCurrentIngredient({ ...currentIngredient, amount: parseFloat(value) || 0 })}
              placeholder="2"
            />
          </div>
          <div className="col-span-2">
            <select
              value={currentIngredient.unit}
              onChange={(e) => setCurrentIngredient({ ...currentIngredient, unit: e.target.value as any })}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="dash">dash</option>
              <option value="splash">splash</option>
              <option value="piece">piece</option>
              <option value="leaf">leaf</option>
              <option value="wedge">wedge</option>
            </select>
          </div>
          <div className="col-span-6">
            <Input
              type="text"
              value={currentIngredient.name}
              onChange={(value) => setCurrentIngredient({ ...currentIngredient, name: value })}
              placeholder="Ingredient name"
            />
          </div>
          <div className="col-span-2">
            <Button type="button" onClick={addIngredient} className="w-full">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>

        <div className="space-y-2">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-500 mt-2">{index + 1}.</span>
              <textarea
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={2}
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => removeInstruction(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            value={newInstruction}
            onChange={(value) => setNewInstruction(value)}
            placeholder="Add next step..."
          />
          <Button type="button" onClick={addInstruction}>
            <Plus className="w-4 h-4 mr-1" />
            Add Step
          </Button>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tags</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {formData.tags.map(tag => (
            <Badge key={tag} className="bg-primary-100 text-primary-800 flex items-center gap-1">
              {tag}
              <button type="button" onClick={() => removeTag(tag)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            value={newTag}
            onChange={(value) => setNewTag(value)}
            placeholder="Add tag (e.g., House Special, Summer Menu)"
          />
          <Button type="button" onClick={addTag}>
            <Plus className="w-4 h-4 mr-1" />
            Add Tag
          </Button>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Notes & Variations</h2>

        <textarea
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="Add personal notes, variations, or customer preferences..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {recipe ? 'Update Recipe' : 'Create Recipe'}
        </Button>
      </div>
    </form>
  );
}

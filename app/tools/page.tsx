'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DrinkRecipe, InventoryItem, IngredientSubstitution } from '@/types';
import { getRecipes } from '@/lib/storage';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import {
  Package,
  DollarSign,
  Scale,
  RefreshCw,
  Calculator,
  Search,
  Plus,
  Trash2,
  Download,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

type ToolType = 'inventory' | 'cost' | 'scaler' | 'substitutions' | null;

export default function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState<ToolType>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState<DrinkRecipe | null>(null);
  const [costs, setCosts] = useState<{ [key: string]: number }>({});
  const [sellPrice, setSellPrice] = useState(12);
  const [stockedIngredients, setStockedIngredients] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const tools = [
    {
      id: 'inventory' as ToolType,
      title: 'Inventory Manager',
      description: 'Track your bar stock, low inventory alerts, and see which recipes you can make',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'cost' as ToolType,
      title: 'Cost Calculator',
      description: 'Calculate pour cost, profit margins, and suggested pricing for each recipe',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'scaler' as ToolType,
      title: 'Batch Scaler',
      description: 'Scale recipes for batch production or catering events (50, 100, 200 servings)',
      icon: Scale,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'substitutions' as ToolType,
      title: 'Substitution Finder',
      description: 'Find ingredient substitutes for allergies, stock-outs, or budget alternatives',
      icon: RefreshCw,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  // Tool Hub View
  if (!selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Calculator className="w-10 h-10 text-primary-600" />
              Professional Tools
            </h1>
            <p className="text-gray-600">Essential calculators and utilities for bartenders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    hover
                    className="p-8 h-full cursor-pointer"
                    onClick={() => setSelectedTool(tool.id)}
                  >
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${tool.color} inline-block mb-4`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{tool.title}</h3>
                    <p className="text-gray-600 mb-6">{tool.description}</p>

                    <Button variant="outline" fullWidth>
                      Open Tool →
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="p-8 bg-gradient-to-br from-primary-50 to-accent-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Use These Tools?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">💰 Save Money</h3>
                  <p className="text-gray-600 text-sm">
                    Track costs and optimize pricing to maximize profit margins
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">📊 Stay Organized</h3>
                  <p className="text-gray-600 text-sm">
                    Never run out of key ingredients during service
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">⚡ Work Faster</h3>
                  <p className="text-gray-600 text-sm">
                    Instantly scale recipes for events and batch production
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">🔄 Be Flexible</h3>
                  <p className="text-gray-600 text-sm">
                    Find substitutes quickly when ingredients run out
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Batch Scaler Tool
  if (selectedTool === 'scaler') {
    const recipes = getRecipes();

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="secondary" onClick={() => setSelectedTool(null)} className="mb-6">
            ← Back to Tools
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Batch Recipe Scaler</h1>
            <p className="text-gray-600">Scale recipes for batch production or events</p>
          </div>

          <Card className="p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Select Recipe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`p-4 text-left rounded-lg border-2 transition-all ${
                    selectedRecipe?.id === recipe.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{recipe.name}</div>
                  <div className="text-sm text-gray-600">{recipe.category}</div>
                </button>
              ))}
            </div>
          </Card>

          {selectedRecipe && (
            <>
              <Card className="p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Batch Size</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[1, 10, 50, 100, 200].map((factor) => (
                    <Button
                      key={factor}
                      variant={scaleFactor === factor ? 'primary' : 'outline'}
                      onClick={() => setScaleFactor(factor)}
                    >
                      {factor}x
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Custom:</label>
                  <Input
                    type="number"
                    value={scaleFactor}
                    onChange={(value) => setScaleFactor(parseFloat(value) || 1)}
                    min="0.1"
                    step="0.1"
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600">servings</span>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900">
                    Scaled Recipe: {selectedRecipe.name} ({scaleFactor}x)
                  </h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-3">Ingredients</h4>
                  <div className="space-y-2">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-gray-700">{ing.name}</span>
                        <span className="font-bold text-primary-600">
                          {(ing.amount * scaleFactor).toFixed(2)} {ing.unit}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-bold text-gray-900 mb-2">Instructions</h4>
                    <p className="text-sm text-gray-600">
                      Follow the original recipe instructions, using the scaled ingredient amounts above.
                    </p>
                  </div>

                  {scaleFactor >= 50 && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">Large Batch Tips:</span>
                      </div>
                      <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                        <li>• Pre-batch and store in appropriate containers</li>
                        <li>• Label with recipe name and date</li>
                        <li>• Consider refrigeration for fresh ingredients</li>
                        <li>• Mix in smaller batches for better quality control</li>
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    );
  }

  // Cost Calculator Tool
  if (selectedTool === 'cost') {
    const recipes = getRecipes();

    const calculateRecipeCost = (recipe: DrinkRecipe) => {
      return recipe.ingredients.reduce((total, ing) => {
        const cost = costs[ing.name] || 0;
        return total + cost;
      }, 0);
    };

    const calculateMargin = (cost: number, price: number) => {
      return ((price - cost) / price) * 100;
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Button variant="secondary" onClick={() => setSelectedTool(null)} className="mb-6">
            ← Back to Tools
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Drink Cost Calculator</h1>
            <p className="text-gray-600">Calculate pour costs and profit margins</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Cost Input */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Set Ingredient Costs</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Array.from(
                  new Set(recipes.flatMap((r) => r.ingredients.map((i) => i.name)))
                ).map((ingredient) => (
                  <div key={ingredient} className="flex items-center gap-3">
                    <span className="flex-1 text-sm text-gray-700">{ingredient}</span>
                    <span className="text-sm text-gray-600">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={costs[ingredient] || ''}
                      onChange={(value) =>
                        setCosts({ ...costs, [ingredient]: parseFloat(value) || 0 })
                      }
                      placeholder="0.00"
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600">/oz</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Right: Recipe Costs */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Recipe Costs</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recipes.map((recipe) => {
                  const cost = calculateRecipeCost(recipe);
                  const margin = calculateMargin(cost, sellPrice);
                  return (
                    <div
                      key={recipe.id}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-gray-900">{recipe.name}</div>
                          <div className="text-sm text-gray-600">Cost: ${cost.toFixed(2)}</div>
                        </div>
                        <Badge
                          className={
                            margin >= 70
                              ? 'bg-green-100 text-green-800'
                              : margin >= 50
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {margin.toFixed(0)}% margin
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        Suggested price: ${(cost / 0.2).toFixed(2)} (80% margin)
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <Card className="mt-6 p-6 bg-blue-50">
            <h3 className="font-bold text-blue-900 mb-2">Industry Standards</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Target pour cost: 18-22% of sell price</li>
              <li>• Premium cocktails: 15-18% pour cost</li>
              <li>• Well drinks: 20-25% pour cost</li>
              <li>• Rule of thumb: Sell price = Cost ÷ 0.20 (for 80% margin)</li>
            </ul>
          </Card>
        </div>
      </div>
    );
  }

  // Inventory Manager Tool
  if (selectedTool === 'inventory') {
    const recipes = getRecipes();
    const allIngredients = Array.from(
      new Set(recipes.flatMap((r) => r.ingredients.map((i) => i.name)))
    ).sort();

    const toggleIngredient = (ingredient: string) => {
      const newSet = new Set(stockedIngredients);
      if (newSet.has(ingredient)) {
        newSet.delete(ingredient);
      } else {
        newSet.add(ingredient);
      }
      setStockedIngredients(newSet);
    };

    const canMakeRecipe = (recipe: DrinkRecipe) => {
      return recipe.ingredients.every((ing) => stockedIngredients.has(ing.name));
    };

    const availableRecipes = recipes.filter(canMakeRecipe);
    const unavailableRecipes = recipes.filter((r) => !canMakeRecipe(r));

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Button variant="secondary" onClick={() => setSelectedTool(null)} className="mb-6">
            ← Back to Tools
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Manager</h1>
            <p className="text-gray-600">Track your stock and see which drinks you can make</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Ingredient Checklist */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Your Inventory</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setStockedIngredients(new Set(allIngredients))}
                  >
                    Select All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setStockedIngredients(new Set())}
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allIngredients.map((ingredient) => (
                  <label
                    key={ingredient}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      stockedIngredients.has(ingredient)
                        ? 'bg-green-50 border-2 border-green-500'
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={stockedIngredients.has(ingredient)}
                      onChange={() => toggleIngredient(ingredient)}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span
                      className={`flex-1 ${
                        stockedIngredients.has(ingredient)
                          ? 'text-green-900 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      {ingredient}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>{stockedIngredients.size}</strong> of <strong>{allIngredients.length}</strong> ingredients in stock
                </div>
              </div>
            </Card>

            {/* Right: Available Recipes */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Can Make ({availableRecipes.length})
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {availableRecipes.length > 0 ? (
                    availableRecipes.map((recipe) => (
                      <div key={recipe.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="font-medium text-green-900">{recipe.name}</div>
                        <div className="text-xs text-green-700">{recipe.category}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Check ingredients to see available recipes
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Missing Ingredients ({unavailableRecipes.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {unavailableRecipes.map((recipe) => {
                    const missing = recipe.ingredients
                      .filter((ing) => !stockedIngredients.has(ing.name))
                      .map((ing) => ing.name);

                    return (
                      <div key={recipe.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="font-medium text-orange-900 mb-1">{recipe.name}</div>
                        <div className="text-xs text-orange-700">
                          Missing: {missing.join(', ')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Substitution Finder Tool
  if (selectedTool === 'substitutions') {
    const commonSubs: IngredientSubstitution[] = [
      {
        original: 'Simple Syrup',
        substitute: 'Honey + Water (1:1)',
        ratio: 1,
        notes: 'Heat equal parts honey and water',
        flavorImpact: 'minimal',
      },
      {
        original: 'Triple Sec',
        substitute: 'Cointreau',
        ratio: 1,
        notes: 'Premium alternative, slightly sweeter',
        flavorImpact: 'minimal',
      },
      {
        original: 'Angostura Bitters',
        substitute: 'Orange Bitters',
        ratio: 1,
        notes: 'Different flavor profile but works',
        flavorImpact: 'moderate',
      },
      {
        original: 'Vodka',
        substitute: 'White Rum',
        ratio: 1,
        notes: 'For mixed drinks with strong flavors',
        flavorImpact: 'moderate',
      },
      {
        original: 'Fresh Lime Juice',
        substitute: 'Fresh Lemon Juice',
        ratio: 1,
        notes: 'Less sweet, more tart',
        flavorImpact: 'moderate',
      },
      {
        original: 'Egg White',
        substitute: 'Aquafaba (chickpea water)',
        ratio: 1,
        notes: 'Vegan alternative, same texture',
        flavorImpact: 'minimal',
      },
      {
        original: 'Bourbon',
        substitute: 'Rye Whiskey',
        ratio: 1,
        notes: 'More spicy, less sweet',
        flavorImpact: 'moderate',
      },
      {
        original: 'Tonic Water',
        substitute: 'Soda Water + Simple Syrup',
        ratio: 1,
        notes: 'Add syrup to taste',
        flavorImpact: 'significant',
      },
    ];

    const filteredSubs = commonSubs.filter(
      (sub) =>
        sub.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.substitute.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="secondary" onClick={() => setSelectedTool(null)} className="mb-6">
            ← Back to Tools
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ingredient Substitution Finder</h1>
            <p className="text-gray-600">Find alternatives for out-of-stock or allergy ingredients</p>
          </div>

          <Card className="p-6 mb-6">
            <Input
              type="text"
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              placeholder="Search for an ingredient..."
              icon={<Search className="w-4 h-4" />}
            />
          </Card>

          <div className="space-y-4">
            {filteredSubs.map((sub, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-gray-900">{sub.original}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-bold text-primary-600">{sub.substitute}</span>
                    </div>
                    <p className="text-sm text-gray-600">{sub.notes}</p>
                  </div>
                  <Badge
                    className={
                      sub.flavorImpact === 'minimal'
                        ? 'bg-green-100 text-green-800'
                        : sub.flavorImpact === 'moderate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-orange-100 text-orange-800'
                    }
                  >
                    {sub.flavorImpact} impact
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">Ratio: {sub.ratio}:1</div>
              </Card>
            ))}
          </div>

          {filteredSubs.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-500">No substitutions found. Try a different search term.</p>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return null;
}

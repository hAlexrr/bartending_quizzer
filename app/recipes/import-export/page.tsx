'use client';

import { useState } from 'react';
import {
  exportAllData,
  importData,
  exportRecipesToCSV,
  importRecipesFromCSV,
  exportRecipeCollection,
  importRecipeCollection,
  getRecipes
} from '@/lib/storage';
import { ExportData, RecipeCollection } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Download, Upload, FileJson, FileSpreadsheet, Share2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ImportExportPage() {
  const router = useRouter();
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);

  const handleExportJSON = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bartending-quizzer-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data: ExportData = JSON.parse(event.target?.result as string, (key, value) => {
          // Revive dates
          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            return new Date(value);
          }
          return value;
        });

        if (confirm('This will merge the imported data with your existing data. Continue?')) {
          importData(data);
          alert('Data imported successfully!');
          router.push('/recipes');
        }
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const csv = exportRecipesToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recipes-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const recipes = importRecipesFromCSV(csv);
        alert(`Successfully imported ${recipes.length} recipes!`);
        router.push('/recipes');
      } catch (error) {
        alert('Error importing CSV. Please check the file format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleExportCollection = () => {
    if (selectedRecipeIds.length === 0) {
      alert('Please select at least one recipe to export.');
      return;
    }

    if (!collectionName) {
      alert('Please enter a collection name.');
      return;
    }

    const collection = exportRecipeCollection(
      selectedRecipeIds,
      collectionName,
      collectionDescription
    );

    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${collectionName.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setCollectionName('');
    setCollectionDescription('');
    setSelectedRecipeIds([]);
  };

  const handleImportCollection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const collection: RecipeCollection = JSON.parse(event.target?.result as string, (key, value) => {
          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            return new Date(value);
          }
          return value;
        });

        importRecipeCollection(collection);
        alert(`Successfully imported collection "${collection.name}" with ${collection.recipes.length} recipes!`);
        router.push('/recipes');
      } catch (error) {
        alert('Error importing collection. Please check the file format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const recipes = getRecipes();
  const toggleRecipeSelection = (id: string) => {
    if (selectedRecipeIds.includes(id)) {
      setSelectedRecipeIds(selectedRecipeIds.filter(recipeId => recipeId !== id));
    } else {
      setSelectedRecipeIds([...selectedRecipeIds, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="secondary" onClick={() => router.push('/recipes')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Import & Export</h1>
          <p className="text-gray-600">Backup your data or share recipe collections</p>
        </div>

        <div className="space-y-6">
          {/* Full Backup */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileJson className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Full Backup (JSON)</h2>
                <p className="text-gray-600 mb-4">
                  Export or import all your data including recipes, flashcards, quizzes, and progress.
                </p>
                <div className="flex gap-2">
                  <Button onClick={handleExportJSON}>
                    <Download className="w-4 h-4 mr-2" />
                    Export All Data
                  </Button>
                  <div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                      id="import-json"
                    />
                    <label htmlFor="import-json" className="cursor-pointer">
                      <span className="inline-flex items-center px-5 py-2.5 text-base font-semibold rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-200">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Data
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* CSV Export/Import */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Recipes CSV</h2>
                <p className="text-gray-600 mb-4">
                  Export recipes to CSV for editing in Excel/Sheets, or import recipes from CSV.
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={handleExportCSV}>
                    <Download className="w-4 h-4 mr-2" />
                    Export to CSV
                  </Button>
                  <div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImportCSV}
                      className="hidden"
                      id="import-csv"
                    />
                    <label htmlFor="import-csv" className="cursor-pointer">
                      <span className="inline-flex items-center px-5 py-2.5 text-base font-semibold rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-200">
                        <Upload className="w-4 h-4 mr-2" />
                        Import CSV
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recipe Collection Sharing */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent-100 rounded-lg">
                <Share2 className="w-6 h-6 text-accent-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Share Recipe Collection</h2>
                <p className="text-gray-600 mb-4">
                  Create a shareable collection of selected recipes to share with your team.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Collection Name
                    </label>
                    <Input
                      value={collectionName}
                      onChange={(value) => setCollectionName(value)}
                      placeholder="e.g., Summer Cocktails 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      value={collectionDescription}
                      onChange={(e) => setCollectionDescription(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      rows={2}
                      placeholder="Add a description for this collection..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Recipes ({selectedRecipeIds.length} selected)
                    </label>
                    <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4 space-y-2">
                      {recipes.map(recipe => (
                        <label key={recipe.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRecipeIds.includes(recipe.id)}
                            onChange={() => toggleRecipeSelection(recipe.id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-gray-700">{recipe.name}</span>
                          <span className="text-sm text-gray-500">({recipe.category})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleExportCollection}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Collection
                    </Button>
                    <div>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportCollection}
                        className="hidden"
                        id="import-collection"
                      />
                      <label htmlFor="import-collection" className="cursor-pointer">
                        <span className="inline-flex items-center px-5 py-2.5 text-base font-semibold rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-200">
                          <Upload className="w-4 h-4 mr-2" />
                          Import Collection
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2">Tips:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use Full Backup to save all your progress before switching devices</li>
              <li>• CSV exports are great for bulk editing recipes in spreadsheet software</li>
              <li>• Recipe Collections are perfect for sharing specialty drink menus with coworkers</li>
              <li>• All imports will merge with existing data (won't delete anything)</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

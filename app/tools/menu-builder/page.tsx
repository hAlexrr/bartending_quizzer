'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, MenuSection } from '@/types';
import {
  getMenus,
  getMenu,
  saveMenu,
  deleteMenu,
  createMenu,
  addSection,
  addRecipeToSection,
  removeRecipeFromSection,
  reorderSections,
  duplicateMenu,
} from '@/lib/menuBuilder';
import { getRecipes } from '@/lib/storage';
import Navigation from '@/components/layout/Navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import {
  Plus,
  Trash2,
  Edit,
  Download,
  Copy,
  GripVertical,
  BookOpen,
  ArrowUp,
  ArrowDown,
  FileText,
  Wine,
  ChevronRight,
} from 'lucide-react';

export default function MenuBuilderPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [currentSection, setCurrentSection] = useState<MenuSection | null>(null);
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const recipes = getRecipes();

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = () => {
    setMenus(getMenus());
  };

  const handleCreateMenu = () => {
    if (!menuName.trim()) return;

    const newMenu = createMenu(menuName, menuDescription);
    saveMenu(newMenu);
    setShowCreateModal(false);
    setMenuName('');
    setMenuDescription('');
    loadMenus();
    setSelectedMenu(newMenu);
  };

  const handleAddSection = () => {
    if (!selectedMenu || !sectionName.trim()) return;

    const newSection = addSection(selectedMenu, sectionName, sectionDescription);
    const updatedMenu = {
      ...selectedMenu,
      sections: [...selectedMenu.sections, newSection],
    };

    saveMenu(updatedMenu);
    setSelectedMenu(updatedMenu);
    setShowAddSectionModal(false);
    setSectionName('');
    setSectionDescription('');
    loadMenus();
  };

  const handleAddRecipesToSection = () => {
    if (!selectedMenu || !currentSection || selectedRecipes.length === 0) return;

    let updatedSection = currentSection;
    selectedRecipes.forEach(recipeId => {
      updatedSection = addRecipeToSection(updatedSection, recipeId);
    });

    const updatedMenu = {
      ...selectedMenu,
      sections: selectedMenu.sections.map(s =>
        s.id === currentSection.id ? updatedSection : s
      ),
    };

    saveMenu(updatedMenu);
    setSelectedMenu(updatedMenu);
    setShowAddRecipeModal(false);
    setSelectedRecipes([]);
    setSearchTerm('');
    loadMenus();
  };

  const handleRemoveRecipe = (sectionId: string, recipeId: string) => {
    if (!selectedMenu) return;

    const updatedMenu = {
      ...selectedMenu,
      sections: selectedMenu.sections.map(s =>
        s.id === sectionId ? removeRecipeFromSection(s, recipeId) : s
      ),
    };

    saveMenu(updatedMenu);
    setSelectedMenu(updatedMenu);
    loadMenus();
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!selectedMenu) return;

    const updatedMenu = {
      ...selectedMenu,
      sections: selectedMenu.sections.filter(s => s.id !== sectionId),
    };

    saveMenu(updatedMenu);
    setSelectedMenu(updatedMenu);
    loadMenus();
  };

  const handleDeleteMenu = (menuId: string) => {
    if (confirm('Are you sure you want to delete this menu?')) {
      deleteMenu(menuId);
      if (selectedMenu?.id === menuId) {
        setSelectedMenu(null);
      }
      loadMenus();
    }
  };

  const handleDuplicateMenu = (menu: Menu) => {
    const duplicated = duplicateMenu(menu);
    saveMenu(duplicated);
    loadMenus();
  };

  const handleMoveSectionUp = (index: number) => {
    if (!selectedMenu || index === 0) return;

    const updated = reorderSections(selectedMenu, index, index - 1);
    saveMenu(updated);
    setSelectedMenu(updated);
    loadMenus();
  };

  const handleMoveSectionDown = (index: number) => {
    if (!selectedMenu || index === selectedMenu.sections.length - 1) return;

    const updated = reorderSections(selectedMenu, index, index + 1);
    saveMenu(updated);
    setSelectedMenu(updated);
    loadMenus();
  };

  const filteredRecipes = recipes.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRecipeSelection = (recipeId: string) => {
    setSelectedRecipes(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const exportMenu = (menu: Menu) => {
    const json = JSON.stringify(menu, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${menu.name.replace(/\s+/g, '-').toLowerCase()}-menu.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!selectedMenu) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-primary-600" />
              Menu Builder
            </h1>
            <p className="text-gray-600">Create professional drink menus for your bar</p>
          </div>

          <div className="mb-6">
            <Button onClick={() => setShowCreateModal(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create New Menu
            </Button>
          </div>

          {menus.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Menus Yet</h2>
              <p className="text-gray-600 mb-6">
                Create your first drink menu to get started
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Menu
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu, index) => (
                <motion.div
                  key={menu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{menu.name}</h3>
                      {menu.description && (
                        <p className="text-sm text-gray-600 mb-3">{menu.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Badge>{menu.sections.length} sections</Badge>
                        <Badge>
                          {menu.sections.reduce((acc, s) => acc + s.recipeIds.length, 0)} drinks
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedMenu(menu)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicateMenu(menu)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportMenu(menu)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteMenu(menu.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Create Menu Modal */}
          <Modal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title="Create New Menu"
          >
            <div className="space-y-4">
              <Input
                label="Menu Name"
                value={menuName}
                onChange={(value) => setMenuName(value)}
                placeholder="e.g., Summer Cocktails 2024"
                required
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={menuDescription}
                  onChange={(e) => setMenuDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Describe this menu..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMenu} disabled={!menuName.trim()}>
                  Create Menu
                </Button>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    );
  }

  // Menu Editor View
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button variant="outline" onClick={() => setSelectedMenu(null)} className="mb-4">
              ← Back to Menus
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{selectedMenu.name}</h1>
            {selectedMenu.description && (
              <p className="text-gray-600">{selectedMenu.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportMenu(selectedMenu)}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowAddSectionModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </div>

        {/* Sections */}
        {selectedMenu.sections.length === 0 ? (
          <Card className="p-12 text-center">
            <Wine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Sections Yet</h2>
            <p className="text-gray-600 mb-6">
              Add sections to organize your drinks (e.g., Classics, House Specials, Seasonal)
            </p>
            <Button onClick={() => setShowAddSectionModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add First Section
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {selectedMenu.sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <GripVertical className="w-5 h-5 text-gray-400" />
                          <h3 className="text-2xl font-bold text-gray-900">{section.name}</h3>
                          <Badge>{section.recipeIds.length} drinks</Badge>
                        </div>
                        {section.description && (
                          <p className="text-gray-600 ml-8">{section.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMoveSectionUp(index)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMoveSectionDown(index)}
                          disabled={index === selectedMenu.sections.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setCurrentSection(section);
                            setShowAddRecipeModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Drinks
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteSection(section.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {section.recipeIds.length === 0 ? (
                      <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <p className="text-gray-600 mb-4">No drinks in this section yet</p>
                        <Button
                          size="sm"
                          onClick={() => {
                            setCurrentSection(section);
                            setShowAddRecipeModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Drinks
                        </Button>
                      </div>
                    ) : (
                      <div className="ml-8 space-y-2">
                        {section.recipeIds.map(recipeId => {
                          const recipe = recipes.find(r => r.id === recipeId);
                          if (!recipe) return null;

                          return (
                            <div
                              key={recipeId}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Wine className="w-5 h-5 text-gray-400" />
                                <div>
                                  <div className="font-medium text-gray-900">{recipe.name}</div>
                                  <div className="text-sm text-gray-600">{recipe.category}</div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveRecipe(section.id, recipeId)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Add Section Modal */}
        <Modal
          isOpen={showAddSectionModal}
          onClose={() => setShowAddSectionModal(false)}
          title="Add Menu Section"
        >
          <div className="space-y-4">
            <Input
              label="Section Name"
              value={sectionName}
              onChange={(value) => setSectionName(value)}
              placeholder="e.g., House Classics, Seasonal Specials"
              required
            />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all duration-200 resize-none"
                rows={2}
                placeholder="Describe this section..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowAddSectionModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSection} disabled={!sectionName.trim()}>
                Add Section
              </Button>
            </div>
          </div>
        </Modal>

        {/* Add Recipes Modal */}
        <Modal
          isOpen={showAddRecipeModal}
          onClose={() => {
            setShowAddRecipeModal(false);
            setSelectedRecipes([]);
            setSearchTerm('');
          }}
          title={`Add Drinks to ${currentSection?.name}`}
        >
          <div className="space-y-4">
            <Input
              type="text"
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              placeholder="Search recipes..."
            />

            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredRecipes.map(recipe => (
                <label
                  key={recipe.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedRecipes.includes(recipe.id)
                      ? 'bg-primary-50 border-2 border-primary-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRecipes.includes(recipe.id)}
                    onChange={() => toggleRecipeSelection(recipe.id)}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <Wine className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{recipe.name}</div>
                    <div className="text-sm text-gray-600">{recipe.category}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddRecipeModal(false);
                  setSelectedRecipes([]);
                  setSearchTerm('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddRecipesToSection}
                disabled={selectedRecipes.length === 0}
              >
                Add {selectedRecipes.length} Drink{selectedRecipes.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

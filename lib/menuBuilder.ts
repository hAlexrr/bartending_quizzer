import { Menu, MenuSection } from '@/types';
import { generateId } from './storage';

const STORAGE_KEY = 'bartending-quizzer-menus';

export function getMenus(): Menu[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return parsed.map((menu: any) => ({
      ...menu,
      createdAt: new Date(menu.createdAt),
      updatedAt: new Date(menu.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading menus:', error);
    return [];
  }
}

export function getMenu(id: string): Menu | undefined {
  return getMenus().find(m => m.id === id);
}

export function saveMenu(menu: Menu): void {
  const menus = getMenus();
  const existingIndex = menus.findIndex(m => m.id === menu.id);

  if (existingIndex >= 0) {
    menus[existingIndex] = { ...menu, updatedAt: new Date() };
  } else {
    menus.push({ ...menu, createdAt: new Date(), updatedAt: new Date() });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
}

export function deleteMenu(id: string): void {
  const menus = getMenus().filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
}

export function createMenu(name: string, description: string = ''): Menu {
  return {
    id: generateId(),
    name,
    description,
    recipeIds: [],
    sections: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function addSection(menu: Menu, sectionName: string, description: string = ''): MenuSection {
  const newSection: MenuSection = {
    id: generateId(),
    name: sectionName,
    description,
    recipeIds: [],
    order: menu.sections.length,
  };

  return newSection;
}

export function addRecipeToSection(section: MenuSection, recipeId: string): MenuSection {
  if (section.recipeIds.includes(recipeId)) {
    return section;
  }

  return {
    ...section,
    recipeIds: [...section.recipeIds, recipeId],
  };
}

export function removeRecipeFromSection(section: MenuSection, recipeId: string): MenuSection {
  return {
    ...section,
    recipeIds: section.recipeIds.filter(id => id !== recipeId),
  };
}

export function reorderSections(menu: Menu, fromIndex: number, toIndex: number): Menu {
  const sections = [...menu.sections];
  const [removed] = sections.splice(fromIndex, 1);
  sections.splice(toIndex, 0, removed);

  // Update order values
  sections.forEach((section, index) => {
    section.order = index;
  });

  return {
    ...menu,
    sections,
    updatedAt: new Date(),
  };
}

export function exportMenuToPDF(menu: Menu): void {
  // This would integrate with a PDF library like jsPDF
  console.log('Export to PDF:', menu);
  alert('PDF export feature coming soon!');
}

export function exportMenuToJSON(menu: Menu): string {
  return JSON.stringify(menu, null, 2);
}

export function duplicateMenu(menu: Menu): Menu {
  return {
    ...menu,
    id: generateId(),
    name: `${menu.name} (Copy)`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

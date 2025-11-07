import { WrongAnswer } from '@/types';

const STORAGE_KEY = 'bartending-quizzer-wrong-answers';

export function getWrongAnswers(): WrongAnswer[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    // Revive dates
    return parsed.map((wa: any) => ({
      ...wa,
      lastIncorrect: new Date(wa.lastIncorrect),
    }));
  } catch (error) {
    console.error('Error loading wrong answers:', error);
    return [];
  }
}

export function saveWrongAnswer(wrongAnswer: WrongAnswer): void {
  const wrongAnswers = getWrongAnswers();
  const existingIndex = wrongAnswers.findIndex(wa =>
    wa.itemId === wrongAnswer.itemId && wa.type === wrongAnswer.type
  );

  if (existingIndex >= 0) {
    // Update existing wrong answer
    wrongAnswers[existingIndex] = {
      ...wrongAnswers[existingIndex],
      incorrectCount: wrongAnswers[existingIndex].incorrectCount + 1,
      lastIncorrect: new Date(),
    };
  } else {
    // Add new wrong answer
    wrongAnswers.push(wrongAnswer);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(wrongAnswers));
}

export function removeWrongAnswer(id: string): void {
  const wrongAnswers = getWrongAnswers();
  const filtered = wrongAnswers.filter(wa => wa.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getTopWrongAnswers(limit: number = 10): WrongAnswer[] {
  const wrongAnswers = getWrongAnswers();
  return wrongAnswers
    .sort((a, b) => b.incorrectCount - a.incorrectCount)
    .slice(0, limit);
}

export function getWrongAnswersByType(type: WrongAnswer['type']): WrongAnswer[] {
  return getWrongAnswers().filter(wa => wa.type === type);
}

export function clearAllWrongAnswers(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}

export function markAsImproved(id: string): void {
  const wrongAnswers = getWrongAnswers();
  const index = wrongAnswers.findIndex(wa => wa.id === id);

  if (index >= 0) {
    wrongAnswers[index].incorrectCount = Math.max(0, wrongAnswers[index].incorrectCount - 1);

    // Remove if count reaches 0
    if (wrongAnswers[index].incorrectCount === 0) {
      wrongAnswers.splice(index, 1);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(wrongAnswers));
  }
}

export function getRecentWrongAnswers(days: number = 7): WrongAnswer[] {
  const wrongAnswers = getWrongAnswers();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return wrongAnswers.filter(wa => wa.lastIncorrect >= cutoffDate);
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WrongAnswer, DrinkRecipe, Flashcard, Question } from '@/types';
import {
  getWrongAnswers,
  getTopWrongAnswers,
  getWrongAnswersByType,
  removeWrongAnswer,
  clearAllWrongAnswers,
  markAsImproved,
} from '@/lib/wrongAnswerBank';
import { getRecipes, getFlashcards, getQuizzes } from '@/lib/storage';
import Navigation from '@/components/layout/Navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import {
  AlertTriangle,
  Target,
  TrendingDown,
  BookOpen,
  FileQuestion,
  Wine,
  CheckCircle,
  X,
  RefreshCw,
  Flame
} from 'lucide-react';

export default function WrongAnswersPage() {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [filter, setFilter] = useState<'all' | 'flashcard' | 'quiz' | 'recipe'>('all');
  const [showClearModal, setShowClearModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    loadWrongAnswers();
  }, [filter]);

  const loadWrongAnswers = () => {
    if (filter === 'all') {
      setWrongAnswers(getWrongAnswers().sort((a, b) => b.incorrectCount - a.incorrectCount));
    } else {
      setWrongAnswers(getWrongAnswersByType(filter));
    }
  };

  const handleRemove = (id: string) => {
    removeWrongAnswer(id);
    loadWrongAnswers();
  };

  const handleMarkImproved = (id: string) => {
    markAsImproved(id);
    loadWrongAnswers();
  };

  const handleClearAll = () => {
    clearAllWrongAnswers();
    setShowClearModal(false);
    loadWrongAnswers();
  };

  const getItemDetails = (wrongAnswer: WrongAnswer) => {
    switch (wrongAnswer.type) {
      case 'recipe':
        return getRecipes().find(r => r.id === wrongAnswer.itemId);
      case 'flashcard':
        return getFlashcards().find(f => f.id === wrongAnswer.itemId);
      case 'quiz':
        // For quiz questions, we'd need to get the quiz and find the question
        const quizzes = getQuizzes();
        for (const quiz of quizzes) {
          const question = quiz.questions.find(q => q.id === wrongAnswer.itemId);
          if (question) return { ...question, quizTitle: quiz.title };
        }
        return null;
      default:
        return null;
    }
  };

  const getIconForType = (type: WrongAnswer['type']) => {
    switch (type) {
      case 'recipe':
        return <Wine className="w-5 h-5 text-purple-600" />;
      case 'flashcard':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'quiz':
        return <FileQuestion className="w-5 h-5 text-green-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getColorForCount = (count: number): string => {
    if (count >= 10) return 'text-red-600 bg-red-100';
    if (count >= 5) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <AlertTriangle className="w-10 h-10 text-orange-600" />
            Wrong Answer Bank
          </h1>
          <p className="text-gray-600">
            Track your problem areas and focus your study time where it matters most
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-gray-600">Total Problem Areas</div>
            <div className="text-3xl font-bold text-gray-900">{wrongAnswers.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Most Missed</div>
            <div className="text-3xl font-bold text-red-600">
              {wrongAnswers.length > 0 ? wrongAnswers[0].incorrectCount : 0}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Flashcards</div>
            <div className="text-3xl font-bold text-blue-600">
              {wrongAnswers.filter(wa => wa.type === 'flashcard').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Recipes</div>
            <div className="text-3xl font-bold text-purple-600">
              {wrongAnswers.filter(wa => wa.type === 'recipe').length}
            </div>
          </Card>
        </div>

        {/* Filters & Actions */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'flashcard' ? 'primary' : 'outline'}
              onClick={() => setFilter('flashcard')}
            >
              Flashcards
            </Button>
            <Button
              variant={filter === 'quiz' ? 'primary' : 'outline'}
              onClick={() => setFilter('quiz')}
            >
              Quizzes
            </Button>
            <Button
              variant={filter === 'recipe' ? 'primary' : 'outline'}
              onClick={() => setFilter('recipe')}
            >
              Recipes
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowClearModal(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button onClick={loadWrongAnswers}>
              <Target className="w-4 h-4 mr-2" />
              Practice These
            </Button>
          </div>
        </div>

        {/* Wrong Answers List */}
        {wrongAnswers.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? "No Wrong Answers Yet!" : `No Wrong ${filter}s Yet!`}
            </h2>
            <p className="text-gray-600 mb-6">
              Keep practicing and track your mistakes to improve faster.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {wrongAnswers.map((wrongAnswer, index) => {
              const details = getItemDetails(wrongAnswer);

              return (
                <motion.div
                  key={wrongAnswer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getIconForType(wrongAnswer.type)}
                          <Badge className="capitalize">{wrongAnswer.type}</Badge>
                          <div className={`px-3 py-1 rounded-full font-bold ${getColorForCount(wrongAnswer.incorrectCount)}`}>
                            <Flame className="w-4 h-4 inline mr-1" />
                            {wrongAnswer.incorrectCount}x Missed
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {details ? (
                            wrongAnswer.type === 'recipe' ? (details as DrinkRecipe).name :
                            wrongAnswer.type === 'flashcard' ? (details as Flashcard).front :
                            wrongAnswer.type === 'quiz' ? (details as Question & { quizTitle: string }).question :
                            'Unknown Item'
                          ) : (
                            <span className="text-gray-500">Item not found</span>
                          )}
                        </h3>

                        {details && wrongAnswer.type === 'flashcard' && (
                          <p className="text-sm text-gray-600 mb-2">
                            Answer: {(details as Flashcard).back}
                          </p>
                        )}

                        {wrongAnswer.notes && (
                          <p className="text-sm text-gray-600 italic mb-2">
                            Note: {wrongAnswer.notes}
                          </p>
                        )}

                        <p className="text-xs text-gray-500">
                          Last missed: {wrongAnswer.lastIncorrect.toLocaleDateString()} at {wrongAnswer.lastIncorrect.toLocaleTimeString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMarkImproved(wrongAnswer.id)}
                          title="Mark as improved"
                        >
                          <TrendingDown className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedItem(details)}
                          title="View details"
                        >
                          <BookOpen className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleRemove(wrongAnswer.id)}
                          title="Remove from list"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tips for Improving Weak Areas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-bold text-gray-900 mb-2">Focus Practice</h3>
                <p className="text-sm text-gray-600">
                  Spend extra time on items you've missed 5+ times
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">📝</div>
                <h3 className="font-bold text-gray-900 mb-2">Add Notes</h3>
                <p className="text-sm text-gray-600">
                  Write why you got it wrong to remember better
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">🔄</div>
                <h3 className="font-bold text-gray-900 mb-2">Review Regularly</h3>
                <p className="text-sm text-gray-600">
                  Come back to this page daily to track improvement
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Clear All Modal */}
        <Modal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          title="Clear All Wrong Answers?"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to clear all {wrongAnswers.length} wrong answers? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowClearModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>
          </div>
        </Modal>

        {/* Item Details Modal */}
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title="Item Details"
        >
          {selectedItem && (
            <div className="space-y-4">
              {selectedItem.name && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Recipe Name</div>
                  <div className="font-bold text-gray-900">{selectedItem.name}</div>
                </div>
              )}
              {selectedItem.front && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Question</div>
                  <div className="font-bold text-gray-900">{selectedItem.front}</div>
                  <div className="text-sm text-gray-600 mt-2 mb-1">Answer</div>
                  <div className="text-gray-700">{selectedItem.back}</div>
                </div>
              )}
              {selectedItem.question && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Question</div>
                  <div className="font-bold text-gray-900">{selectedItem.question}</div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}

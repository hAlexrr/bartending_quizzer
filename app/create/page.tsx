'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import AddFlashcardForm from '@/components/flashcards/AddFlashcardForm';
import Card from '@/components/ui/Card';
import { PlusCircle, Check } from 'lucide-react';

export default function CreatePage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <PlusCircle className="w-10 h-10 text-primary-600" />
            Create Content
          </h1>
          <p className="text-gray-600">Add your own flashcards to customize your learning experience</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Card className="p-4 bg-green-50 border-2 border-green-200">
              <div className="flex items-center gap-3 text-green-800">
                <Check className="w-6 h-6" />
                <span className="font-semibold">Flashcard created successfully!</span>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Form */}
        <AddFlashcardForm onSuccess={handleSuccess} />

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-br from-primary-50 to-accent-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tips for Creating Great Flashcards</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Keep it concise</h3>
                  <p className="text-sm text-gray-600">
                    Write clear, focused questions and answers. Avoid lengthy paragraphs.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Be specific</h3>
                  <p className="text-sm text-gray-600">
                    Include exact measurements, ingredients, and techniques for recipes and procedures.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl">🏷️</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Use relevant tags</h3>
                  <p className="text-sm text-gray-600">
                    Add tags to help organize and filter your flashcards later (e.g., "classic", "vodka", "shaken").
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl">📊</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Set appropriate difficulty</h3>
                  <p className="text-sm text-gray-600">
                    Mark complex recipes or advanced techniques as "Hard" to track your progress better.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Examples Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Example Flashcards</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-primary-500 pl-4">
                <p className="font-semibold text-gray-800 mb-2">Front: What is a "dry shake"?</p>
                <p className="text-gray-600">
                  Back: A technique where ingredients (especially those with egg white) are shaken without ice first,
                  then shaken again with ice. This creates better foam and texture.
                </p>
                <div className="mt-2 flex gap-2 text-sm text-gray-500">
                  <span>Category: Technique</span>
                  <span>•</span>
                  <span>Tags: technique, advanced</span>
                </div>
              </div>

              <div className="border-l-4 border-accent-500 pl-4">
                <p className="font-semibold text-gray-800 mb-2">Front: Negroni Recipe</p>
                <p className="text-gray-600">
                  Back: Equal parts (1 oz each) Gin, Campari, and Sweet Vermouth. Build in rocks glass over ice,
                  stir gently. Garnish with orange peel.
                </p>
                <div className="mt-2 flex gap-2 text-sm text-gray-500">
                  <span>Category: Recipe</span>
                  <span>•</span>
                  <span>Tags: classic, gin, stirred</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Flashcard } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { saveFlashcard, generateId } from '@/lib/storage';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface AddFlashcardFormProps {
  onSuccess?: () => void;
}

export default function AddFlashcardForm({ onSuccess }: AddFlashcardFormProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [category, setCategory] = useState<Flashcard['category']>('terminology');
  const [tags, setTags] = useState('');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(2);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!front.trim()) {
      newErrors.front = 'Front side is required';
    }
    if (!back.trim()) {
      newErrors.back = 'Back side is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const newFlashcard: Flashcard = {
      id: generateId(),
      front: front.trim(),
      back: back.trim(),
      category,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      createdAt: new Date(),
      difficulty,
      reviewCount: 0,
      correctCount: 0,
    };

    saveFlashcard(newFlashcard);

    // Reset form
    setFront('');
    setBack('');
    setTags('');
    setCategory('terminology');
    setDifficulty(2);
    setErrors({});
    setIsSubmitting(false);

    onSuccess?.();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6 space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-100 rounded-lg">
          <Plus className="w-6 h-6 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Create New Flashcard</h2>
      </div>

      <Input
        label="Front Side (Question)"
        type="textarea"
        value={front}
        onChange={setFront}
        placeholder="e.g., What is a jigger?"
        error={errors.front}
        required
        rows={3}
      />

      <Input
        label="Back Side (Answer)"
        type="textarea"
        value={back}
        onChange={setBack}
        placeholder="e.g., A bartending tool used to measure liquid..."
        error={errors.back}
        required
        rows={4}
      />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Flashcard['category'])}
          className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all duration-200"
        >
          <option value="recipe">Recipe</option>
          <option value="technique">Technique</option>
          <option value="terminology">Terminology</option>
          <option value="measurement">Measurement</option>
          <option value="ingredient">Ingredient</option>
        </select>
      </div>

      <Input
        label="Tags (comma-separated)"
        type="text"
        value={tags}
        onChange={setTags}
        placeholder="e.g., tools, measurement, basics"
      />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Difficulty Level
        </label>
        <div className="flex gap-4">
          {[
            { value: 1, label: 'Easy', color: 'green' },
            { value: 2, label: 'Medium', color: 'yellow' },
            { value: 3, label: 'Hard', color: 'red' },
          ].map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setDifficulty(level.value as 1 | 2 | 3)}
              className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all duration-200 ${
                difficulty === level.value
                  ? `border-${level.color}-500 bg-${level.color}-50 text-${level.color}-700`
                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {isSubmitting ? 'Creating...' : 'Create Flashcard'}
        </Button>
      </div>
    </motion.form>
  );
}

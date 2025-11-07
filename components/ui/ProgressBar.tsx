'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: 'primary' | 'success' | 'accent';
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  progress,
  color = 'primary',
  height = 'md',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const colorStyles = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    accent: 'bg-gradient-to-r from-accent-400 to-accent-600',
  };

  const heightStyles = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightStyles[height]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${normalizedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`${heightStyles[height]} ${colorStyles[color]} flex items-center justify-center rounded-full`}
        >
          {showLabel && height !== 'sm' && (
            <span className="text-white text-xs font-bold">
              {normalizedProgress.toFixed(0)}%
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  gradient?: boolean;
}

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  gradient = false
}: CardProps) {
  const baseStyles = 'rounded-xl shadow-lg overflow-hidden';
  const backgroundStyles = gradient
    ? 'bg-gradient-to-br from-white to-gray-50'
    : 'bg-white';
  const interactiveStyles = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      className={`${baseStyles} ${backgroundStyles} ${interactiveStyles} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

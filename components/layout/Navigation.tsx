'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BookOpen, Brain, Gamepad2, PlusCircle, TrendingUp, ChefHat } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/recipes', label: 'Recipes', icon: ChefHat },
  { href: '/flashcards', label: 'Flashcards', icon: BookOpen },
  { href: '/quizzes', label: 'Quizzes', icon: Brain },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/create', label: 'Create', icon: PlusCircle },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-4xl">🍸</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Bartending Academy
              </h1>
              <p className="text-xs text-gray-500">Master the Art of Mixology</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href} className="relative">
                  <motion.div
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 ${
                      isActive
                        ? 'text-primary-600 font-semibold'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

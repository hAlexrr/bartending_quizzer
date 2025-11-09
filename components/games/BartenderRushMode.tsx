'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DrinkRecipe, BartenderRushOrder } from '@/types';
import { getRecipes } from '@/lib/storage';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Clock, Users, Flame, Trophy, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function BartenderRushMode() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'complete'>('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [orders, setOrders] = useState<BartenderRushOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<BartenderRushOrder | null>(null);
  const [recipes, setRecipes] = useState<DrinkRecipe[]>([]);
  const [lives, setLives] = useState(3);
  const [totalOrdersCompleted, setTotalOrdersCompleted] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const ordersRef = useRef<BartenderRushOrder[]>([]);

  // Update ref when orders change
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  useEffect(() => {
    const loadedRecipes = getRecipes().filter(r => r.ingredients && r.ingredients.length > 0);
    setRecipes(loadedRecipes);
    console.log('Loaded recipes:', loadedRecipes.length);
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      // Update order timers
      const timer = setInterval(() => {
        setOrders(prev => prev.map(order => {
          if (order.status === 'pending' || order.status === 'in-progress') {
            const elapsed = Date.now() - order.orderTime.getTime();
            const remaining = order.timeLimit - Math.floor(elapsed / 1000);

            if (remaining <= 0 && order.status !== 'failed') {
              // Order expired
              setLives(l => l - 1);
              setCombo(0);
              return { ...order, status: 'failed' as const };
            }
          }
          return order;
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState, orders]);

  useEffect(() => {
    if (lives <= 0 && gameState === 'playing') {
      setGameState('complete');
    }
  }, [lives, gameState]);

  const getMaxOrders = () => Math.min(3 + Math.floor(level / 2), 8);
  const getOrderInterval = () => Math.max(5000 - (level * 500), 2000);
  const getOrderTimeLimit = () => Math.max(30 - (level * 2), 15);

  const addNewOrder = useCallback(() => {
    if (recipes.length === 0) {
      console.log('No recipes available');
      return;
    }

    const recipe = recipes[Math.floor(Math.random() * recipes.length)];
    const newOrder: BartenderRushOrder = {
      id: `order-${Date.now()}-${Math.random()}`,
      recipeId: recipe.id,
      customerId: Math.floor(Math.random() * 10) + 1,
      orderTime: new Date(),
      status: 'pending',
      timeLimit: getOrderTimeLimit(),
    };

    console.log('Adding new order:', newOrder.id);
    setOrders(prev => [...prev, newOrder]);
  }, [recipes, level]);

  // Periodic order generation
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      const currentOrders = ordersRef.current;
      const activeOrders = currentOrders.filter(o => o.status === 'pending' || o.status === 'in-progress');
      const maxOrders = getMaxOrders();

      if (activeOrders.length < maxOrders) {
        console.log(`Adding order (${activeOrders.length}/${maxOrders})`);
        addNewOrder();
      }
    }, getOrderInterval());

    return () => clearInterval(interval);
  }, [gameState, level, addNewOrder]);

  const startGame = () => {
    console.log('Starting game with', recipes.length, 'recipes');
    setGameState('playing');
    setLevel(1);
    setScore(0);
    setCombo(0);
    setLives(3);
    setOrders([]);
    setTotalOrdersCompleted(0);
    setGameTime(0);

    // Add initial orders after a short delay to ensure state is updated
    setTimeout(() => {
      console.log('Adding initial orders');
      addNewOrder();
      setTimeout(() => addNewOrder(), 1000);
    }, 100);
  };

  const selectOrder = (order: BartenderRushOrder) => {
    if (order.status === 'pending') {
      setSelectedOrder(order);
      setOrders(prev => prev.map(o =>
        o.id === order.id ? { ...o, status: 'in-progress' as const } : o
      ));
    }
  };

  const completeOrder = (correct: boolean) => {
    if (!selectedOrder) return;

    const elapsed = Date.now() - selectedOrder.orderTime.getTime();
    const timeBonus = Math.max(0, Math.floor((selectedOrder.timeLimit * 1000 - elapsed) / 1000) * 10);

    if (correct) {
      const basePoints = 100;
      const comboBonus = combo * 25;
      const points = basePoints + comboBonus + timeBonus;

      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setTotalOrdersCompleted(prev => prev + 1);

      setOrders(prev => prev.map(o =>
        o.id === selectedOrder.id ? { ...o, status: 'completed' as const } : o
      ));

      // Remove completed order after animation
      setTimeout(() => {
        setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      }, 1000);

      // Level up every 5 orders
      if ((totalOrdersCompleted + 1) % 5 === 0) {
        setLevel(prev => prev + 1);
      }
    } else {
      setCombo(0);
      setLives(prev => prev - 1);

      setOrders(prev => prev.map(o =>
        o.id === selectedOrder.id ? { ...o, status: 'failed' as const } : o
      ));

      setTimeout(() => {
        setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      }, 1000);
    }

    setSelectedOrder(null);
  };

  const getRecipeForOrder = (order: BartenderRushOrder): DrinkRecipe | undefined => {
    return recipes.find(r => r.id === order.recipeId);
  };

  const getRemainingTime = (order: BartenderRushOrder): number => {
    const elapsed = Date.now() - order.orderTime.getTime();
    return Math.max(0, Math.floor((order.timeLimit * 1000 - elapsed) / 1000));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === 'menu') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Bartender Rush Mode</h1>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Simulate a busy bar shift! Manage multiple customer orders, build combos, and don't let orders expire.
              The pace increases as you level up!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-bold text-blue-900">Multiple Orders</div>
                <div className="text-sm text-blue-700">Manage up to 8 at once</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="font-bold text-orange-900">Combo System</div>
                <div className="text-sm text-orange-700">Chain successes for bonuses</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="font-bold text-purple-900">Time Pressure</div>
                <div className="text-sm text-purple-700">Orders expire if too slow</div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h3 className="font-bold text-yellow-900 mb-3">How to Play:</h3>
              <ul className="text-sm text-yellow-800 text-left max-w-md mx-auto space-y-2">
                <li>• Click on pending orders to select them</li>
                <li>• Correctly identify the recipe ingredients</li>
                <li>• Complete orders before time runs out</li>
                <li>• Build combos by completing consecutive orders correctly</li>
                <li>• You have 3 lives - don't let orders expire!</li>
              </ul>
            </div>

            <Button onClick={startGame} size="lg">
              <Flame className="w-5 h-5 mr-2" />
              Start Rush Mode
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'complete') {
    const accuracy = totalOrdersCompleted > 0 ? Math.round((totalOrdersCompleted / (totalOrdersCompleted + 3 - lives)) * 100) : 0;

    return (
      <div className="max-w-3xl mx-auto p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">
              {score >= 2000 ? '🏆' : score >= 1000 ? '🌟' : '💪'}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shift Complete!</h2>
            <p className="text-xl text-gray-600 mb-8">Final Score: {score}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-900">{totalOrdersCompleted}</div>
                <div className="text-sm text-blue-700">Orders Completed</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-purple-900">{level}</div>
                <div className="text-sm text-purple-700">Level Reached</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-900">{accuracy}%</div>
                <div className="text-sm text-green-700">Accuracy</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-orange-900">{formatTime(gameTime)}</div>
                <div className="text-sm text-orange-700">Time Survived</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="secondary" onClick={startGame}>
                Play Again
              </Button>
              <Button onClick={() => setGameState('menu')}>
                Back to Menu
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Playing state
  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header Stats */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Score</div>
            <div className="text-2xl font-bold text-gray-900">{score}</div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Level</div>
            <div className="text-2xl font-bold text-purple-600">{level}</div>
          </div>
          {combo > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-orange-100 px-4 py-2 rounded-lg shadow-sm"
            >
              <div className="text-sm text-orange-600 flex items-center gap-1">
                <Flame className="w-4 h-4" />
                Combo
              </div>
              <div className="text-2xl font-bold text-orange-900">{combo}x</div>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: i < lives ? 1 : 0.5, opacity: i < lives ? 1 : 0.3 }}
            >
              <div className={`w-8 h-8 rounded-full ${i < lives ? 'bg-red-500' : 'bg-gray-300'} flex items-center justify-center text-white font-bold`}>
                ♥
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Orders Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <AnimatePresence>
          {orders.map((order) => {
            const recipe = getRecipeForOrder(order);
            if (!recipe) return null;

            const remainingTime = getRemainingTime(order);
            const isUrgent = remainingTime <= 10;
            const isExpired = order.status === 'failed';
            const isCompleted = order.status === 'completed';

            return (
              <motion.div
                key={order.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`relative ${selectedOrder?.id === order.id ? 'ring-4 ring-primary-500' : ''}`}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    isCompleted ? 'bg-green-50 border-green-500' :
                    isExpired ? 'bg-red-50 border-red-500' :
                    isUrgent ? 'bg-red-100 border-red-400 animate-pulse' :
                    selectedOrder?.id === order.id ? 'bg-blue-50' :
                    'hover:shadow-md'
                  }`}
                  onClick={() => selectOrder(order)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-xs text-gray-500">Customer #{order.customerId}</div>
                      <div className="font-bold text-gray-900">{recipe.name}</div>
                    </div>
                    {isCompleted && <CheckCircle className="w-6 h-6 text-green-600" />}
                    {isExpired && <XCircle className="w-6 h-6 text-red-600" />}
                  </div>

                  {(order.status === 'pending' || order.status === 'in-progress') && (
                    <div className={`flex items-center gap-2 text-sm ${isUrgent ? 'text-red-600' : 'text-gray-600'}`}>
                      <Clock className="w-4 h-4" />
                      <span className="font-mono font-bold">{remainingTime}s</span>
                    </div>
                  )}

                  {order.status === 'in-progress' && (
                    <div className="mt-3 text-xs text-blue-600 font-medium">
                      ← Selected
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {orders.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Waiting for customers...</p>
          </div>
        )}
      </div>

      {/* Selected Order Details */}
      {selectedOrder && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Now Making: {getRecipeForOrder(selectedOrder)?.name}
              </h3>
              <p className="text-gray-600 text-sm">Identify the ingredients correctly</p>
            </div>

            <div className="bg-white p-4 rounded-lg mb-4">
              <h4 className="font-bold text-gray-900 mb-3">Ingredients:</h4>
              <div className="space-y-2">
                {getRecipeForOrder(selectedOrder)?.ingredients.map((ing, i) => (
                  <div key={i} className="text-gray-700">
                    • {ing.amount}{ing.unit} {ing.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => completeOrder(true)} className="flex-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Serve Correctly
              </Button>
              <Button onClick={() => completeOrder(false)} variant="danger" className="flex-1">
                <XCircle className="w-4 h-4 mr-2" />
                Made Wrong
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {!selectedOrder && orders.some(o => o.status === 'pending') && (
        <Card className="p-6 text-center bg-yellow-50">
          <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-yellow-800 font-medium">Click on a pending order to start making it!</p>
        </Card>
      )}
    </div>
  );
}

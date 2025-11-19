'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Keyboard } from 'lucide-react';

interface KeyboardTestProps {
  onComplete: (passed: boolean, details?: string) => void;
  onCancel: () => void;
}

const keyboardLayout = [
  ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl'],
];

export default function KeyboardTest({ onComplete, onCancel }: KeyboardTestProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [isActive, setIsActive] = useState(false);
  const [testedKeys, setTestedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const key = e.key === ' ' ? 'Space' : e.key;
      setPressedKeys(prev => new Set(prev).add(key));
      setTestedKeys(prev => new Set(prev).add(key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      const key = e.key === ' ' ? 'Space' : e.key;
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isActive]);

  const getKeyStatus = (key: string) => {
    const normalizedKey = key.toLowerCase();
    const normalizedTested = Array.from(testedKeys).map(k => k.toLowerCase());
    const normalizedPressed = Array.from(pressedKeys).map(k => k.toLowerCase());

    if (normalizedPressed.includes(normalizedKey)) {
      return 'pressed';
    } else if (normalizedTested.includes(normalizedKey)) {
      return 'tested';
    }
    return 'untested';
  };

  const getKeyClass = (status: string) => {
    switch (status) {
      case 'pressed':
        return 'bg-blue-500 text-white border-blue-600 shadow-lg scale-95';
      case 'tested':
        return 'bg-green-100 text-green-900 border-green-300';
      default:
        return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
    }
  };

  const totalKeys = keyboardLayout.flat().length;
  const testedCount = testedKeys.size;
  const progress = Math.round((testedCount / totalKeys) * 100);

  const markAsComplete = () => {
    const passed = testedCount >= totalKeys * 0.8; // 80% threshold
    onComplete(passed, `${testedCount}/${totalKeys} keys tested (${progress}%)`);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Keyboard className="w-6 h-6" />
        Keyboard Test
      </h3>

      {!isActive ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            This test will help you verify that all keyboard keys are working properly.
            Press each key to mark it as tested.
          </p>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => setIsActive(true)}>
              Start Keyboard Test
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-blue-900">
                Progress: {testedCount}/{totalKeys} keys tested
              </span>
              <span className="text-2xl font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-2">
              {keyboardLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1 justify-center">
                  {row.map((key) => {
                    const status = getKeyStatus(key);
                    const isWide = ['Backspace', 'Tab', 'CapsLock', 'Enter', 'Shift', 'Space'].includes(key);
                    const isExtraWide = key === 'Space';

                    return (
                      <div
                        key={key}
                        className={`
                          ${getKeyClass(status)}
                          ${isExtraWide ? 'px-20' : isWide ? 'px-6' : 'px-3'}
                          py-2 border-2 rounded font-mono text-sm font-semibold
                          transition-all duration-100 text-center min-w-[40px]
                        `}
                      >
                        {key}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
              <span>Untested</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
              <span>Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 border-2 border-blue-600 rounded"></div>
              <span>Pressed</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" onClick={markAsComplete}>
              Complete Test ({progress}%)
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsActive(false);
                setTestedKeys(new Set());
                setPressedKeys(new Set());
              }}
            >
              Restart
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

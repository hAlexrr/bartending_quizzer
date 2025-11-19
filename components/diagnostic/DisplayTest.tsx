'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { X } from 'lucide-react';

interface DisplayTestProps {
  onComplete: (passed: boolean) => void;
  onCancel: () => void;
}

const testColors = [
  { name: 'Red', color: '#FF0000' },
  { name: 'Green', color: '#00FF00' },
  { name: 'Blue', color: '#0000FF' },
  { name: 'White', color: '#FFFFFF' },
  { name: 'Black', color: '#000000' },
  { name: 'Cyan', color: '#00FFFF' },
  { name: 'Magenta', color: '#FF00FF' },
  { name: 'Yellow', color: '#FFFF00' },
];

export default function DisplayTest({ onComplete, onCancel }: DisplayTestProps) {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentColor = testColors[currentColorIndex];

  const nextColor = () => {
    if (currentColorIndex < testColors.length - 1) {
      setCurrentColorIndex(currentColorIndex + 1);
    } else {
      // Test completed
      setIsFullscreen(false);
      onComplete(true);
    }
  };

  const startFullscreenTest = () => {
    setIsFullscreen(true);
    document.documentElement.requestFullscreen?.();
  };

  const exitTest = () => {
    setIsFullscreen(false);
    document.exitFullscreen?.();
    onCancel();
  };

  if (isFullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ backgroundColor: currentColor.color }}
      >
        <div className="absolute top-4 left-0 right-0 text-center">
          <p
            className="text-2xl font-bold mb-2"
            style={{ color: currentColor.color === '#000000' ? '#FFFFFF' : '#000000' }}
          >
            {currentColor.name}
          </p>
          <p
            className="text-sm"
            style={{ color: currentColor.color === '#000000' ? '#FFFFFF' : '#000000' }}
          >
            Check for dead pixels and color accuracy
          </p>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={nextColor}
            className="bg-opacity-90"
          >
            {currentColorIndex < testColors.length - 1 ? 'Next Color' : 'Complete Test'}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={exitTest}
            className="bg-white bg-opacity-90"
          >
            <X className="w-5 h-5 mr-2" />
            Cancel
          </Button>
        </div>

        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2">
          {testColors.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentColorIndex
                  ? 'bg-blue-600'
                  : index < currentColorIndex
                  ? 'bg-green-600'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Display Test</h3>
      <p className="text-gray-600 mb-6">
        This test will cycle through different colors in fullscreen mode. Check for:
      </p>
      <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
        <li>Dead or stuck pixels</li>
        <li>Color accuracy and uniformity</li>
        <li>Screen brightness</li>
        <li>Any display artifacts or issues</li>
      </ul>

      <div className="flex gap-3">
        <Button variant="primary" onClick={startFullscreenTest}>
          Start Display Test
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}

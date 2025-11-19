'use client';

import { useState, useRef, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Camera, CameraOff } from 'lucide-react';

interface CameraTestProps {
  onComplete: (passed: boolean, details?: string) => void;
  onCancel: () => void;
}

export default function CameraTest({ onComplete, onCancel }: CameraTestProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      });

      setStream(mediaStream);
      setIsActive(true);
      setError('');

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to access camera';
      setError(errorMessage);
      onComplete(false, errorMessage);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
    }
  };

  const markAsPassed = () => {
    stopCamera();
    onComplete(true, 'Camera is working correctly');
  };

  const markAsFailed = () => {
    stopCamera();
    onComplete(false, 'Camera test failed - manual verification');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Camera className="w-6 h-6" />
        Camera Test
      </h3>

      {!isActive && !error && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Click the button below to test your camera. Make sure to allow camera permissions when prompted.
          </p>
          <div className="flex gap-3">
            <Button variant="primary" onClick={startCamera}>
              <Camera className="w-4 h-4 mr-2" />
              Start Camera Test
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="space-y-4">
          <div className="p-4 bg-red-100 border border-red-300 rounded-md">
            <div className="flex items-center gap-2 text-red-700">
              <CameraOff className="w-5 h-5" />
              <p className="font-medium">Camera Error</p>
            </div>
            <p className="text-sm text-red-600 mt-2">{error}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={startCamera}>
              Retry
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isActive && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto"
              style={{ maxHeight: '400px' }}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">Verify the following:</p>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>Image is clear and focused</li>
              <li>Colors appear accurate</li>
              <li>No distortion or artifacts</li>
              <li>Camera is capturing in real-time</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" onClick={markAsPassed}>
              Camera Works - Pass
            </Button>
            <Button variant="outline" onClick={markAsFailed}>
              Issues Found - Fail
            </Button>
            <Button variant="outline" onClick={() => { stopCamera(); onCancel(); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

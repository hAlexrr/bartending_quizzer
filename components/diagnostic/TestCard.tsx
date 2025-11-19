'use client';

import { TestResult } from '@/types/diagnostic';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CheckCircle2, XCircle, Clock, Loader2, Play, SkipForward } from 'lucide-react';

interface TestCardProps {
  test: TestResult;
  onRun: () => void;
  onSkip: () => void;
  disabled?: boolean;
}

export default function TestCard({ test, onRun, onSkip, disabled }: TestCardProps) {
  const getStatusIcon = () => {
    switch (test.status) {
      case 'passed':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'running':
        return <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />;
      case 'skipped':
        return <SkipForward className="w-6 h-6 text-gray-400" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (test.status) {
      case 'passed':
        return 'border-green-200 bg-green-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      case 'running':
        return 'border-blue-200 bg-blue-50';
      case 'skipped':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getStatusText = () => {
    switch (test.status) {
      case 'passed':
        return 'PASSED';
      case 'failed':
        return 'FAILED';
      case 'running':
        return 'RUNNING...';
      case 'skipped':
        return 'SKIPPED';
      default:
        return 'PENDING';
    }
  };

  return (
    <Card className={`p-6 border-2 transition-all ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-bold text-lg text-gray-800">{test.name}</h3>
            <p className="text-sm text-gray-600">{getStatusText()}</p>
          </div>
        </div>

        {test.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onRun}
              disabled={disabled}
            >
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSkip}
              disabled={disabled}
            >
              Skip
            </Button>
          </div>
        )}
      </div>

      {test.details && (
        <div className="mt-3 p-3 bg-white rounded-md border border-gray-200">
          <p className="text-sm text-gray-700">{test.details}</p>
        </div>
      )}

      {test.error && (
        <div className="mt-3 p-3 bg-red-100 rounded-md border border-red-300">
          <p className="text-sm text-red-700 font-medium">Error: {test.error}</p>
        </div>
      )}

      {test.data && (
        <div className="mt-3 p-3 bg-gray-100 rounded-md border border-gray-300">
          <pre className="text-xs text-gray-700 overflow-auto">
            {JSON.stringify(test.data, null, 2)}
          </pre>
        </div>
      )}

      {test.startTime && test.endTime && (
        <div className="mt-3 text-xs text-gray-500">
          Duration: {((test.endTime.getTime() - test.startTime.getTime()) / 1000).toFixed(2)}s
        </div>
      )}
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor, Cpu, HardDrive, Camera, Volume2, Keyboard,
  Wifi, Battery, Download, PlayCircle, RotateCcw, CheckCircle2, AlertCircle
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SystemInfoCard from '@/components/diagnostic/SystemInfoCard';
import TestCard from '@/components/diagnostic/TestCard';
import DisplayTest from '@/components/diagnostic/DisplayTest';
import CameraTest from '@/components/diagnostic/CameraTest';
import AudioTest from '@/components/diagnostic/AudioTest';
import KeyboardTest from '@/components/diagnostic/KeyboardTest';
import { TestResult, SystemInfo } from '@/types/diagnostic';
import {
  getSystemInfo,
  getBatteryInfo,
  testCPU,
  testMemory,
  testNetwork,
  generateReport,
  downloadReport
} from '@/lib/diagnosticUtils';

export default function DiagnosticPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [isRunningAll, setIsRunningAll] = useState(false);

  useEffect(() => {
    initializeDiagnostics();
  }, []);

  const initializeDiagnostics = async () => {
    // Get system information
    const sysInfo = await getSystemInfo();
    setSystemInfo(sysInfo);

    // Initialize test list
    const initialTests: TestResult[] = [
      { id: 'cpu', name: 'CPU Stress Test', status: 'pending' },
      { id: 'memory', name: 'Memory Test', status: 'pending' },
      { id: 'display', name: 'Display Test', status: 'pending' },
      { id: 'camera', name: 'Camera Test', status: 'pending' },
      { id: 'audio', name: 'Audio Test', status: 'pending' },
      { id: 'keyboard', name: 'Keyboard Test', status: 'pending' },
      { id: 'network', name: 'Network Connectivity', status: 'pending' },
    ];

    // Add battery test if supported
    if (sysInfo.batterySupported) {
      initialTests.push({ id: 'battery', name: 'Battery Health', status: 'pending' });
    }

    setTests(initialTests);
  };

  const updateTestStatus = (testId: string, updates: Partial<TestResult>) => {
    setTests(prev => prev.map(test =>
      test.id === testId ? { ...test, ...updates } : test
    ));
  };

  const runTest = async (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return;

    setCurrentTest(testId);
    updateTestStatus(testId, { status: 'running', startTime: new Date() });

    try {
      switch (testId) {
        case 'cpu':
          await runCPUTest();
          break;
        case 'memory':
          await runMemoryTest();
          break;
        case 'network':
          await runNetworkTest();
          break;
        case 'battery':
          await runBatteryTest();
          break;
        // Interactive tests are handled separately
        case 'display':
        case 'camera':
        case 'audio':
        case 'keyboard':
          // These will be handled by their respective components
          break;
        default:
          throw new Error('Unknown test');
      }
    } catch (error: any) {
      updateTestStatus(testId, {
        status: 'failed',
        endTime: new Date(),
        error: error.message,
      });
      setCurrentTest(null);
    }
  };

  const runCPUTest = async () => {
    try {
      const result = await testCPU(5000);
      updateTestStatus('cpu', {
        status: 'passed',
        endTime: new Date(),
        details: `Score: ${result.score} iterations/sec (${result.iterations} total iterations)`,
        data: result,
      });
      setCurrentTest(null);
    } catch (error: any) {
      throw error;
    }
  };

  const runMemoryTest = async () => {
    try {
      const result = await testMemory();
      const passed = result.available;
      updateTestStatus('memory', {
        status: passed ? 'passed' : 'failed',
        endTime: new Date(),
        details: result.deviceMemory
          ? `Device Memory: ${result.deviceMemory} GB`
          : 'Memory information not available',
        data: result,
      });
      setCurrentTest(null);
    } catch (error: any) {
      throw error;
    }
  };

  const runNetworkTest = async () => {
    try {
      const result = await testNetwork();
      const passed = result.online;
      const details = result.online
        ? `Online - ${result.effectiveType || 'Unknown'} (${result.downlink || 'N/A'} Mbps, ${result.rtt || 'N/A'}ms RTT)`
        : 'Offline';

      updateTestStatus('network', {
        status: passed ? 'passed' : 'failed',
        endTime: new Date(),
        details,
        data: result,
      });
      setCurrentTest(null);
    } catch (error: any) {
      throw error;
    }
  };

  const runBatteryTest = async () => {
    try {
      const result = await getBatteryInfo();
      if (!result) {
        throw new Error('Battery API not supported');
      }

      const passed = result.level > 20; // Consider passed if battery > 20%
      const details = `Level: ${result.level}%, ${result.charging ? 'Charging' : 'Discharging'}`;

      updateTestStatus('battery', {
        status: passed ? 'passed' : 'failed',
        endTime: new Date(),
        details,
        data: result,
      });
      setCurrentTest(null);
    } catch (error: any) {
      throw error;
    }
  };

  const skipTest = (testId: string) => {
    updateTestStatus(testId, {
      status: 'skipped',
      endTime: new Date(),
      details: 'Test skipped by user',
    });
    if (currentTest === testId) {
      setCurrentTest(null);
    }
  };

  const runAllTests = async () => {
    setIsRunningAll(true);

    // Run automated tests first
    const automatedTests = ['cpu', 'memory', 'network', 'battery'];
    for (const testId of automatedTests) {
      const test = tests.find(t => t.id === testId);
      if (test && test.status === 'pending') {
        await runTest(testId);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsRunningAll(false);
  };

  const resetAllTests = () => {
    setTests(prev => prev.map(test => ({
      ...test,
      status: 'pending',
      startTime: undefined,
      endTime: undefined,
      details: undefined,
      error: undefined,
      data: undefined,
    })));
    setCurrentTest(null);
  };

  const exportReport = () => {
    if (!systemInfo) return;
    const report = generateReport(systemInfo, tests);
    downloadReport(report);
  };

  const getTestIcon = (testId: string) => {
    const icons: Record<string, any> = {
      cpu: Cpu,
      memory: HardDrive,
      display: Monitor,
      camera: Camera,
      audio: Volume2,
      keyboard: Keyboard,
      network: Wifi,
      battery: Battery,
    };
    return icons[testId] || Monitor;
  };

  const stats = {
    total: tests.length,
    passed: tests.filter(t => t.status === 'passed').length,
    failed: tests.filter(t => t.status === 'failed').length,
    pending: tests.filter(t => t.status === 'pending').length,
  };

  const completionPercentage = Math.round(
    ((stats.passed + stats.failed) / stats.total) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Computer Diagnostic Tool
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive hardware testing for computer refurbishment
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetAllTests}
                disabled={isRunningAll || currentTest !== null}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
              <Button
                variant="primary"
                onClick={runAllTests}
                disabled={isRunningAll || currentTest !== null}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Run All Tests
              </Button>
            </div>
          </div>

          {/* Stats */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.passed}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{completionPercentage}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {completionPercentage === 100 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {stats.failed === 0 ? (
                  <Badge variant="success" size="lg">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    All Tests Passed!
                  </Badge>
                ) : (
                  <Badge variant="danger" size="lg">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {stats.failed} Test{stats.failed !== 1 ? 's' : ''} Failed
                  </Badge>
                )}
                <Button variant="primary" size="sm" onClick={exportReport}>
                  <Download className="w-4 h-4 mr-1" />
                  Export Report
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* System Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SystemInfoCard systemInfo={systemInfo} />
        </motion.div>

        {/* Interactive Test Modals */}
        {currentTest === 'display' && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl w-full"
            >
              <DisplayTest
                onComplete={(passed) => {
                  updateTestStatus('display', {
                    status: passed ? 'passed' : 'failed',
                    endTime: new Date(),
                    details: passed ? 'Display test completed successfully' : 'Display issues detected',
                  });
                  setCurrentTest(null);
                }}
                onCancel={() => skipTest('display')}
              />
            </motion.div>
          </div>
        )}

        {currentTest === 'camera' && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl w-full"
            >
              <CameraTest
                onComplete={(passed, details) => {
                  updateTestStatus('camera', {
                    status: passed ? 'passed' : 'failed',
                    endTime: new Date(),
                    details,
                  });
                  setCurrentTest(null);
                }}
                onCancel={() => skipTest('camera')}
              />
            </motion.div>
          </div>
        )}

        {currentTest === 'audio' && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl w-full"
            >
              <AudioTest
                onComplete={(passed, details) => {
                  updateTestStatus('audio', {
                    status: passed ? 'passed' : 'failed',
                    endTime: new Date(),
                    details,
                  });
                  setCurrentTest(null);
                }}
                onCancel={() => skipTest('audio')}
              />
            </motion.div>
          </div>
        )}

        {currentTest === 'keyboard' && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl w-full my-8"
            >
              <KeyboardTest
                onComplete={(passed, details) => {
                  updateTestStatus('keyboard', {
                    status: passed ? 'passed' : 'failed',
                    endTime: new Date(),
                    details,
                  });
                  setCurrentTest(null);
                }}
                onCancel={() => skipTest('keyboard')}
              />
            </motion.div>
          </div>
        )}

        {/* Tests Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <TestCard
                test={test}
                onRun={() => runTest(test.id)}
                onSkip={() => skipTest(test.id)}
                disabled={isRunningAll || (currentTest !== null && currentTest !== test.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

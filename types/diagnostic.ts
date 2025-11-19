export type TestStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';

export interface TestResult {
  id: string;
  name: string;
  status: TestStatus;
  startTime?: Date;
  endTime?: Date;
  details?: string;
  data?: any;
  error?: string;
}

export interface SystemInfo {
  platform: string;
  userAgent: string;
  cores: number;
  memory: number;
  screenResolution: string;
  colorDepth: number;
  pixelRatio: number;
  language: string;
  online: boolean;
  cookiesEnabled: boolean;
  batterySupported: boolean;
}

export interface DiagnosticReport {
  timestamp: Date;
  systemInfo: SystemInfo;
  tests: TestResult[];
  overallStatus: 'passed' | 'failed' | 'incomplete';
  duration: number;
}

export interface BatteryInfo {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
}

export interface AudioTestResult {
  speakersWorking: boolean;
  microphoneWorking: boolean;
  microphoneLevel?: number;
}

export interface NetworkTestResult {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

import { SystemInfo, BatteryInfo, NetworkTestResult } from '@/types/diagnostic';

export async function getSystemInfo(): Promise<SystemInfo> {
  const nav = navigator as any;

  // Get battery support
  let batterySupported = false;
  try {
    const battery = await nav.getBattery?.();
    batterySupported = !!battery;
  } catch {
    batterySupported = false;
  }

  return {
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    cores: navigator.hardwareConcurrency || 0,
    memory: (nav.deviceMemory || 0) * 1024, // Convert GB to MB
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    language: navigator.language,
    online: navigator.onLine,
    cookiesEnabled: navigator.cookieEnabled,
    batterySupported,
  };
}

export async function getBatteryInfo(): Promise<BatteryInfo | null> {
  try {
    const nav = navigator as any;
    if (!nav.getBattery) {
      return null;
    }

    const battery = await nav.getBattery();
    return {
      charging: battery.charging,
      level: Math.round(battery.level * 100),
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
    };
  } catch (error) {
    console.error('Battery API not supported:', error);
    return null;
  }
}

export async function testCPU(duration: number = 5000): Promise<{ score: number; iterations: number }> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    let iterations = 0;

    const calculate = () => {
      // CPU-intensive calculation
      for (let i = 0; i < 100000; i++) {
        Math.sqrt(Math.random() * 10000);
        Math.sin(Math.random() * Math.PI);
        Math.cos(Math.random() * Math.PI);
      }
      iterations++;

      const elapsed = performance.now() - startTime;
      if (elapsed < duration) {
        requestAnimationFrame(calculate);
      } else {
        const score = Math.round((iterations / duration) * 1000);
        resolve({ score, iterations });
      }
    };

    requestAnimationFrame(calculate);
  });
}

export async function testMemory(): Promise<{ available: boolean; deviceMemory?: number }> {
  const nav = navigator as any;
  return {
    available: 'deviceMemory' in navigator,
    deviceMemory: nav.deviceMemory || undefined,
  };
}

export async function testNetwork(): Promise<NetworkTestResult> {
  const nav = navigator as any;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
  };
}

export async function testCamera(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Stop the stream immediately
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Camera test failed:', error);
    return false;
  }
}

export async function testMicrophone(): Promise<{ available: boolean; level?: number }> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Create audio context to measure audio level
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Get audio level
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / bufferLength;

    // Clean up
    stream.getTracks().forEach(track => track.stop());
    audioContext.close();

    return { available: true, level: Math.round(average) };
  } catch (error) {
    console.error('Microphone test failed:', error);
    return { available: false };
  }
}

export function generateReport(systemInfo: SystemInfo, tests: any[]): string {
  const timestamp = new Date().toISOString();
  const passed = tests.filter(t => t.status === 'passed').length;
  const failed = tests.filter(t => t.status === 'failed').length;
  const total = tests.length;

  let report = `COMPUTER DIAGNOSTIC REPORT\n`;
  report += `Generated: ${timestamp}\n`;
  report += `${'='.repeat(80)}\n\n`;

  report += `SYSTEM INFORMATION\n`;
  report += `${'-'.repeat(80)}\n`;
  report += `Platform: ${systemInfo.platform}\n`;
  report += `CPU Cores: ${systemInfo.cores}\n`;
  report += `Memory: ${systemInfo.memory} MB\n`;
  report += `Screen Resolution: ${systemInfo.screenResolution}\n`;
  report += `Color Depth: ${systemInfo.colorDepth} bit\n`;
  report += `Pixel Ratio: ${systemInfo.pixelRatio}\n`;
  report += `Language: ${systemInfo.language}\n`;
  report += `Online: ${systemInfo.online ? 'Yes' : 'No'}\n`;
  report += `Cookies: ${systemInfo.cookiesEnabled ? 'Enabled' : 'Disabled'}\n\n`;

  report += `TEST RESULTS (${passed}/${total} passed, ${failed} failed)\n`;
  report += `${'-'.repeat(80)}\n`;

  tests.forEach(test => {
    const status = test.status.toUpperCase().padEnd(10);
    report += `[${status}] ${test.name}\n`;
    if (test.details) {
      report += `           ${test.details}\n`;
    }
    if (test.error) {
      report += `           Error: ${test.error}\n`;
    }
    report += `\n`;
  });

  report += `${'='.repeat(80)}\n`;
  report += `Overall Status: ${failed === 0 ? 'PASSED' : 'FAILED'}\n`;

  return report;
}

export function downloadReport(content: string, filename: string = 'diagnostic-report.txt') {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

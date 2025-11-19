'use client';

import { SystemInfo } from '@/types/diagnostic';
import Card from '@/components/ui/Card';
import { Monitor, Cpu, HardDrive, Globe } from 'lucide-react';

interface SystemInfoCardProps {
  systemInfo: SystemInfo | null;
}

export default function SystemInfoCard({ systemInfo }: SystemInfoCardProps) {
  if (!systemInfo) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">System Information</h2>
        <p className="text-gray-500">Loading system information...</p>
      </Card>
    );
  }

  const infoSections = [
    {
      icon: Cpu,
      title: 'Processor',
      items: [
        { label: 'Cores', value: systemInfo.cores },
        { label: 'Platform', value: systemInfo.platform },
      ],
    },
    {
      icon: HardDrive,
      title: 'Memory',
      items: [
        { label: 'Device Memory', value: systemInfo.memory ? `${systemInfo.memory} MB` : 'N/A' },
        { label: 'Cookies', value: systemInfo.cookiesEnabled ? 'Enabled' : 'Disabled' },
      ],
    },
    {
      icon: Monitor,
      title: 'Display',
      items: [
        { label: 'Resolution', value: systemInfo.screenResolution },
        { label: 'Color Depth', value: `${systemInfo.colorDepth} bit` },
        { label: 'Pixel Ratio', value: systemInfo.pixelRatio },
      ],
    },
    {
      icon: Globe,
      title: 'Network',
      items: [
        { label: 'Status', value: systemInfo.online ? 'Online' : 'Offline' },
        { label: 'Language', value: systemInfo.language },
      ],
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Monitor className="w-6 h-6 text-primary-600" />
        System Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Icon className="w-5 h-5 text-gray-500" />
                {section.title}
              </h3>
              <div className="space-y-2 pl-7">
                {section.items.map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.label}:</span>
                    <span className="font-medium text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 break-all">
          <span className="font-semibold">User Agent:</span> {systemInfo.userAgent}
        </div>
      </div>
    </Card>
  );
}

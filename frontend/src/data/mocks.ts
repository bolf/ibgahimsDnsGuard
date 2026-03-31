import { ControlledIP, BlockedResource, Stats } from '../types/dns';

export const MOCK_IPs: ControlledIP[] = [
  { ip: '192.168.1.10', addDate: '2023-10-01' },
  { ip: '192.168.1.15', addDate: '2023-10-05' },
  { ip: "192.168.1.11", addDate: '15-03-2026' },
  { ip: "192.168.1.13", addDate: '15-03-2026' },
  { ip: "192.168.1.15", addDate: '15-03-2026' },
  { ip: "192.168.1.17", addDate: '15-03-2026' },
];

export const MOCK_RESOURCES: BlockedResource[] = [
  { id: '1', resource: 'facebook.com', blockDate: '2023-10-02', requestCount: 42 },
  { id: '2', resource: 'instagram.com', blockDate: '2023-10-03', requestCount: 15 },
  { id: '1', resource: 'doubleclick.net', blockDate: '10.05.2024', requestCount: 1250 },
  { id: '2', resource: 'analytics.google.com', blockDate: '11.05.2024', requestCount: 840 },
  { id: '3', resource: 'facebook.com', blockDate: '12.05.2024', requestCount: 3100 }
];

export const MOCK_STATS: Stats = {
    active: true,
    blockedCount: 1243,
    totalQueries: 8540,
    uptime: "12ч 43м"
};
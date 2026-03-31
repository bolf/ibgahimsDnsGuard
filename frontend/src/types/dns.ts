export type DataType = 'ip' | 'resource';

export interface ControlledIP {
  ip: string;
  addDate: string;
}

export interface BlockedResource {
  id: string;
  resource: string;
  blockDate: string;
  requestCount: number;
}

export interface Stats {
  active: boolean,
  blockedCount: number,
  totalQueries: number,
  uptime: string
}

// Контракт для будущего сервиса (связь с backend)
export interface IDNSService {
  fetchIPs: () => Promise<ControlledIP[]>;
  fetchResources: () => Promise<BlockedResource[]>;
}

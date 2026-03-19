import './index.css';
import React, { useState } from 'react';
import DataTableWithBar from './components/DataTableWithBar';
import ConfirmModal from './components/ConfirmModal';
import InputModal from './components/InputModal';
import { isValidLocalIP } from './utils/validators';
import { Shield, Trash2, Activity, BarChart3, List, Globe } from 'lucide-react';

// Имитируем данные от нашего будущего Java-сердца
const MOCK_STATS = {
  active: true,
  blockedCount: 1243,
  totalQueries: 8540,
  uptime: "12ч 43м"
};

const MOCK_IPs = [
  { ip: "192.168.1.11", addDate: '15-03-2026' },
  { ip: "192.168.1.13", addDate: '15-03-2026' },
  { ip: "192.168.1.15", addDate: '15-03-2026' },
  { ip: "192.168.1.17", addDate: '15-03-2026' },
];

interface ControlledIP {
  ip: string;
  addDate: string;
}

interface BlockedResource {
  id: string;
  resource: string;
  blockDate: string;
  requestCount: number;
}

const MOCK_LOGS = [
  { id: 1, time: "14:20:01", domain: "doubleclick.net", status: "Blocked", client: "192.168.1.15" },
  { id: 2, time: "14:19:45", domain: "google.com", status: "Allowed", client: "192.168.1.10" },
  { id: 3, time: "14:18:12", domain: "track.evil.com", status: "Blocked", client: "127.0.0.1" },
];

const MOCK_RESOURCES: BlockedResource[] = [
  { id: '1', resource: 'doubleclick.net', blockDate: '10.05.2024', requestCount: 1250 },
  { id: '2', resource: 'analytics.google.com', blockDate: '11.05.2024', requestCount: 840 },
  { id: '3', resource: 'facebook.com', blockDate: '12.05.2024', requestCount: 3100 }
];

export default function Dashboard() {
  type DataType = 'ip' | 'resource';
  const [isActive, setIsActive] = useState(MOCK_STATS.active);
  const [ipToDelete, setIpToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ips, setIps] = useState<ControlledIP[]>(MOCK_IPs);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Состояние для модалки удаления
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, type: DataType } | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [blockedResources, setBlockedResources] = useState<BlockedResource[]>(MOCK_RESOURCES);

  const [isAddIpOpen, setIsAddIpOpen] = useState(false);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);

  const ipColumns = [
    { key: 'ip', label: 'IP АДРЕС' },
    {
      key: 'addDate',
      label: 'ДАТА ДОБАВЛЕНИЯ',
      render: (val: string) => <span className="text-slate-500">{val}</span>
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: ControlledIP) => (
        <button onClick={() => openDeleteModal(row.ip, 'ip')} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all active:scale-90">
          <Trash2 size={16} />
        </button>
      )
    }
  ];

  const blockedResourceColumns = [
    { key: 'resource', label: 'Ресурс' },
    { key: 'blockDate', label: 'Дата блокировки' },
    {
      key: 'requestCount',
      label: 'Заблокировано',
      render: (val: number) => (
        <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full text-xs font-mono">
          {val.toLocaleString()}
        </span>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: BlockedResource) => (
        <button
          onClick={() => openDeleteModal(row.id, 'resource')}
          className="text-slate-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      )
    }
  ];


  const handleAddIp = (newIp: string) => {
    const newEntry: ControlledIP = {
      ip: newIp,
      addDate: new Date().toLocaleDateString('ru-RU')
    };
    setIps(prev => [...prev, newEntry]);
    setIsAddModalOpen(false);
  };

  const openDeleteModal = (id: string, type: DataType) => {
    setDeleteTarget({ id, type });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    const { id, type } = deleteTarget;

    if (type === 'ip') {
      setIps(prev => prev.filter(item => item.ip !== id));
    } else if (type === 'resource') {
      setBlockedResources(prev => prev.filter(item => item.id !== id));
    }

    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleAddResource = (domain: string) => {
    const newResource: BlockedResource = {
      id: Date.now().toString(),
      resource: domain.toLowerCase(),
      blockDate: new Date().toLocaleDateString('ru-RU'),
      requestCount: 0
    };

    // Обновляем состояние (Immutability!)
    setBlockedResources(prev => [...prev, newResource]);

    // Закрываем портал
    setIsAddResourceOpen(false);
  };

  const confirmDelete = () => {
    if (ipToDelete) {
      setIps(prev => prev.filter(item => item.ip !== ipToDelete));
      setIpToDelete(null);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="text-emerald-400" /> IbrahimsDnsGuard
        </h1>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-6 py-2 rounded-full font-bold transition ${isActive ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
            }`}
        >
          {isActive ? 'ЗАЩИТА ВКЛ' : 'ЗАЩИТА ВЫКЛ'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<Activity />} title="Всего запросов" value={MOCK_STATS.totalQueries} color="blue" />
        <StatCard icon={<Shield />} title="Заблокировано" value={MOCK_STATS.blockedCount} color="emerald" />
        <StatCard icon={<BarChart3 />} title="Аптайм" value={MOCK_STATS.uptime} color="amber" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-6">
        <DataTableWithBar<ControlledIP>
          title="IP для контроля"
          icon={Shield}
          data={ips}
          columns={ipColumns}
          onAdd={() => setIsAddModalOpen(true)}
        />

        <div className="flex-1">
          <DataTableWithBar<BlockedResource>
            title="Блокируемые ресурсы"
            icon={Globe}
            data={blockedResources}
            columns={blockedResourceColumns}
            onAdd={() => setIsAddResourceOpen(true)}
          />
        </div>
      </div>

      <InputModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddIp}
        title="Добавить устройство"
        icon={Shield}
        placeholder="Напр. 192.168.1.50"
        // Передаем логику проверки прямо в пропсах
        validate={(val) =>
          isValidLocalIP(val)
            ? true
            : "Введите корректный локальный IP (192.168.x.x или 10.x.x.x)"
        }
      />

      <InputModal
        isOpen={isAddResourceOpen}
        onClose={() => setIsAddResourceOpen(false)}
        onSave={handleAddResource}
        title="Заблокировать домен"
        icon={Globe}
        placeholder="напр. doubleclick.net"
        validate={(val) => val.includes('.') ? true : "Введите корректный домен"}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete} 
        title="Подтверждение удаления"
        message={`Вы действительно хотите удалить ${deleteTarget?.type === 'ip' ? 'IP' : 'ресурс'} ${deleteTarget?.id}?`}
      />

      {/* Logs Table */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <List size={20} /> Последние события
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-sm">
                <th className="py-2">Время</th>
                <th>Домен</th>
                <th>Статус</th>
                <th>Клиент</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {MOCK_LOGS.map(log => (
                <tr key={log.id} className="hover:bg-slate-750 transition">
                  <td className="py-3 text-slate-400 text-sm">{log.time}</td>
                  <td className="font-mono text-sm">{log.domain}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.status === 'Blocked' ? 'bg-rose-900/50 text-rose-400' : 'bg-emerald-900/50 text-emerald-400'
                      }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="text-slate-400 text-sm">{log.client}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-500 transition cursor-default">
      <div className={`text-${color}-400 mb-2`}>{icon}</div>
      <div className="text-slate-400 text-sm">{title}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
    </div>
  );
}
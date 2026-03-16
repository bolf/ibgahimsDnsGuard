import React from 'react';
import { Plus, Trash2, RefreshCw, LucideIcon } from 'lucide-react';

interface Column<T> {
  key: keyof T | string; 
  label: string;         
  render?: (value: any, row: T) => React.ReactNode; // Кастомный рендер
}

// Описываем пропсы нашего компонента
interface DataTableProps<T> {
  title: string;
  icon?: LucideIcon;
  data: T[];
  columns: Column<T>[];
  onAdd?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
}

// Используем Generic <T>, чтобы компонент понимал тип любых данных
const DataTableWithBar = <T extends Record<string, any>>({
  title,
  icon: Icon,
  data,
  columns,
  onAdd,
  onDelete,
  onRefresh,
}: DataTableProps<T>) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl my-8">
      {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            {Icon && <Icon size={20} className="text-blue-400" />}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
            <p className="text-xs text-slate-500">{data.length} записей всего</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onDelete && (
            <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
              <Trash2 size={18} />
            </button>
          )}
          {onRefresh && (
            <button onClick={onRefresh} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
              <RefreshCw size={18} />
            </button>
          )}
          {onAdd && (
            <button onClick={onAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95 shadow-lg shadow-blue-900/20">
              <Plus size={18} />
              <span>Добавить</span>
            </button>
          )}
        </div>
      </div>

      {/* ТАБЛИЦА */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
              {columns.map((col) => (
                <th key={String(col.key)} className="pb-3 px-2 font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-700/30 transition-colors group">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="py-4 px-2 text-slate-300 text-sm">
                      {col.render 
                        ? col.render(row[col.key as keyof T], row) 
                        : String(row[col.key as keyof T] || '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-slate-500 italic">
                  Данных пока нет...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTableWithBar;
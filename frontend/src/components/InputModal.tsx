import React, { useState, useEffect } from 'react';
import { X, LucideIcon, AlertCircle } from 'lucide-react';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  title: string;
  placeholder?: string;
  icon: LucideIcon;
  // Наша "лямбда" для валидации (возвращает true или текст ошибки)
  validate: (value: string) => boolean | string;
}

const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  placeholder = "Введите значение...",
  icon: Icon,
  validate
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Сброс при закрытии/открытии
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const validationResult = validate(inputValue);
    
    if (validationResult === true) {
      onSave(inputValue);
      onClose();
    } else {
      // Если валидатор вернул строку — показываем её, если false — стандартную ошибку
      setError(typeof validationResult === 'string' ? validationResult : "Некорректный ввод");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Icon className="text-blue-400" size={24} />
            {title}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError(null);
              }}
              placeholder={placeholder}
              className={`w-full bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            {error && (
              <p className="mt-2 text-xs text-red-400 flex items-center gap-1 italic">
                <AlertCircle size={12} /> {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200">
              Отмена
            </button>
            <button 
              onClick={handleSave}
              disabled={!inputValue.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-medium transition-all active:scale-95"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputModal;
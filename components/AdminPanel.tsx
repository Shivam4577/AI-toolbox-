import React, { useState, useEffect } from 'react';
import { getToolUsage, clearToolUsage } from '../utils/analytics';
import { Tool } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { Icon } from './common/Icon';

const AdminPanel: React.FC = () => {
  const { t } = useLocalization();
  const [stats, setStats] = useState<{ [key in Tool]?: number }>({});
  
  useEffect(() => {
    setStats(getToolUsage());
  }, []);

  const handleClearStats = () => {
    if (window.confirm(t('admin.confirmClear'))) {
        clearToolUsage();
        setStats({});
    }
  };

  const toolEntries = Object.entries(stats);
  const totalUsage = toolEntries.reduce((acc, [, count]) => acc + (count || 0), 0);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-200">{t('admin.title')}</h2>
      </header>
      
      <div className="space-y-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">{t('admin.stats')}</h3>
             <button
                onClick={handleClearStats}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-red-500"
                aria-label={t('admin.clear')}
            >
                <Icon name="trash" className="w-4 h-4 mr-2" />
                {t('admin.clear')}
            </button>
          </div>
          {toolEntries.length > 0 ? (
            <div className="space-y-4">
              <ul className="divide-y divide-gray-700">
                {toolEntries.map(([tool, count]) => (
                  <li key={tool} className="py-3 flex justify-between items-center">
                    <span className="text-gray-300">{t(`tool.${tool as Tool}`)}</span>
                    <span className="font-bold text-indigo-400 text-lg">{count}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t-2 border-indigo-500 flex justify-between items-center font-bold text-white text-lg">
                <span>{t('admin.total')}</span>
                <span>{totalUsage}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">{t('admin.noData')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
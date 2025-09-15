import React, { useState } from 'react';
import { Tool } from '../types';
import { Icon } from './common/Icon';
import { useLocalization } from '../contexts/LocalizationContext';

interface SidebarProps {
  activeTool: Tool;
  onToolSelect: (tool: Tool) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tools: { id: Tool; icon: string }[];
}

// Define which tools will be moved to the bottom nav on mobile
const bottomNavToolIds = [Tool.CHAT, Tool.IMAGE_GEN, Tool.WEB_SEARCH];

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, onToolSelect, isOpen, setIsOpen, tools }) => {
  const { t } = useLocalization();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const shareData = {
      title: t('sidebar.share.title'),
      text: t('sidebar.share.text'),
      url: window.location.href,
    };
    navigator.clipboard.writeText(shareData.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside className={`w-64 bg-gray-800 p-4 flex flex-col shrink-0 fixed top-0 left-0 h-full z-30 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white hidden md:block">{t('sidebar.title')}</h1>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-gray-400 hover:text-white">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col space-y-2 flex-grow">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              className={`
                items-center p-3 rounded-lg transition-colors duration-200 text-left 
                ${bottomNavToolIds.includes(tool.id) ? 'hidden md:flex' : 'flex'}
                ${activeTool === tool.id ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
              `}
              aria-label={t('sidebar.aria.switchTo', { tool: t(`tool.${tool.id}`) })}
              aria-current={activeTool === tool.id}
            >
              <Icon name={tool.icon} className="w-5 h-5 mr-3" />
              <span>{t(`tool.${tool.id}`)}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto">
           <button
              onClick={handleShare}
              className="w-full p-3 rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
          >
              {copied ? t('sidebar.copied') : t('sidebar.share')}
          </button>
        </div>
      </aside>
    </>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Tool } from './types';
import ChatTool from './components/ChatTool';
import ImageGenerationTool from './components/ImageGenerationTool';
import ImageEditingTool from './components/ImageEditingTool';
import WebSearchTool from './components/WebSearchTool';
import RecipeGeneratorTool from './components/RecipeGeneratorTool';
import CodeGeneratorTool from './components/CodeGeneratorTool';
import StoryGeneratorTool from './components/StoryGeneratorTool';
import TextSummarizerTool from './components/TextSummarizerTool';
import AdminPanel from './components/AdminPanel';
import { Icon } from './components/common/Icon';
import { useLocalization } from './contexts/LocalizationContext';
import { logToolUsage } from './utils/analytics';
import { Spinner } from './components/common/Spinner';

// Fix: Add adsbygoogle to the Window interface to resolve TypeScript errors.
declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

const toolComponents: { [key in Tool]: React.FC } = {
  [Tool.CHAT]: ChatTool,
  [Tool.IMAGE_GEN]: ImageGenerationTool,
  [Tool.IMAGE_EDIT]: ImageEditingTool,
  [Tool.WEB_SEARCH]: WebSearchTool,
  [Tool.RECIPE_GEN]: RecipeGeneratorTool,
  [Tool.CODE_GEN]: CodeGeneratorTool,
  [Tool.STORY_GEN]: StoryGeneratorTool,
  [Tool.SUMMARIZER]: TextSummarizerTool,
  [Tool.ADMIN]: AdminPanel,
};

const tools = [
  { id: Tool.CHAT, icon: 'chat' },
  { id: Tool.IMAGE_GEN, icon: 'image' },
  { id: Tool.IMAGE_EDIT, icon: 'edit' },
  { id: Tool.WEB_SEARCH, icon: 'search' },
  { id: Tool.RECIPE_GEN, icon: 'book' },
  { id: Tool.CODE_GEN, icon: 'code' },
  { id: Tool.STORY_GEN, icon: 'story' },
  { id: Tool.SUMMARIZER, icon: 'summarize' },
  { id: Tool.ADMIN, icon: 'admin' },
];

const AdComponent: React.FC = () => {
    const { t } = useLocalization();
    const adContainerRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (!adContainerRef.current) return;

        const container = adContainerRef.current;
        container.innerHTML = ''; // Clear previous ad content
        setStatus('loading');
        let observer: MutationObserver | null = null;
        let timeoutId: number | null = null;

        try {
            const ins = document.createElement('ins');
            ins.className = 'adsbygoogle';
            ins.style.display = 'block';
            ins.style.width = '320px';
            ins.style.height = '480px';
            ins.setAttribute('data-ad-client', 'ca-pub-8294380251806932');
            ins.setAttribute('data-ad-slot', '1853216995');
            // Make the ad request more flexible to increase fill rate
            ins.setAttribute('data-ad-format', 'auto');
            ins.setAttribute('data-full-width-responsive', 'true');
            
            container.appendChild(ins);
            
            observer = new MutationObserver(() => {
                const adStatus = ins.getAttribute('data-ad-status');
                if (adStatus === 'filled') {
                    setStatus('success');
                    if (timeoutId) clearTimeout(timeoutId);
                    observer?.disconnect();
                } else if (adStatus === 'unfilled') {
                    setStatus('error');
                    if (timeoutId) clearTimeout(timeoutId);
                    observer?.disconnect();
                }
            });
            
            observer.observe(ins, { attributes: true });

            // Push to adsbygoogle
            (window.adsbygoogle = window.adsbygoogle || []).push({});

            timeoutId = window.setTimeout(() => {
                setStatus(currentStatus => {
                    if (currentStatus === 'loading') {
                        observer?.disconnect();
                        return 'error';
                    }
                    return currentStatus;
                });
            }, 10000); // 10-second timeout

        } catch (e) {
            console.error('Ad script error:', e);
            setStatus('error');
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            observer?.disconnect();
        };

    }, []);

    return (
        <div className="relative bg-gray-800 p-4 rounded-lg" style={{width: '320px', height: '480px'}}>
            {/* The ad container is always present in the DOM for the ad script */}
            <div ref={adContainerRef}></div>

            {/* Overlay for loading/error states */}
            {status !== 'success' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-white">
                    {status === 'loading' && (
                        <>
                            <Spinner />
                            <p className="mt-2">{t('ad.loading')}</p>
                        </>
                    )}
                    {status === 'error' && <p>{t('ad.error')}</p>}
                </div>
            )}
        </div>
    );
};


const FullScreenAdModal: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
    const { t } = useLocalization();

    if (!isVisible) {
        return null;
    }

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
            <div className="relative">
                <AdComponent />
                <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 p-1.5 bg-gray-700 text-white rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label={t('ad.close')}
                >
                    <Icon name="close" className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};


function App() {
  const { t } = useLocalization();
  const [activeTool, setActiveTool] = useState<Tool>(Tool.CHAT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullScreenAdVisible, setIsFullScreenAdVisible] = useState(false);

  useEffect(() => {
    const adInterval = setInterval(() => {
      setIsFullScreenAdVisible(true);
    }, 30000); // 30 seconds

    return () => {
      clearInterval(adInterval);
    };
  }, []);

  const handleToolSelect = (tool: Tool) => {
    setActiveTool(tool);
    logToolUsage(tool);
    setIsSidebarOpen(false); // Close sidebar on selection
  };
  
  const ActiveToolComponent = toolComponents[activeTool];

  return (
    <>
    <div className="flex h-screen bg-gray-900 text-white font-sans" aria-hidden={isFullScreenAdVisible}>
      <Sidebar
        activeTool={activeTool}
        onToolSelect={handleToolSelect}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        tools={tools}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
           {activeTool === Tool.CHAT ? (
              <button onClick={() => setIsSidebarOpen(true)} className="p-1" aria-label={t('header.toggleSidebar')}>
                <Icon name="menu" className="w-6 h-6" />
              </button>
            ) : (
              <button onClick={() => handleToolSelect(Tool.CHAT)} className="p-1" aria-label={t('header.backToChat')}>
                <Icon name="arrow-left" className="w-6 h-6" />
              </button>
            )}
           <h1 className="text-xl font-bold">{t(`tool.${activeTool}`)}</h1>
           <div className="w-6"></div>
        </header>
        <div className="flex-1 overflow-hidden">
          {ActiveToolComponent && <ActiveToolComponent />}
        </div>
      </main>
    </div>
    <FullScreenAdModal isVisible={isFullScreenAdVisible} onClose={() => setIsFullScreenAdVisible(false)} />
    </>
  );
}

export default App;
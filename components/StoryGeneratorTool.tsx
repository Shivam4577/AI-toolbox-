// Fix: Created the StoryGeneratorTool component.
import React, { useState } from 'react';
import { generateStory } from '../services/geminiService';
import { useLocalization } from '../contexts/LocalizationContext';
import { Spinner } from './common/Spinner';
import VoiceInput from './common/VoiceInput';

const StoryGeneratorTool: React.FC = () => {
    const { t } = useLocalization();
    const [prompt, setPrompt] = useState('');
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setStory('');

        try {
            const result = await generateStory(prompt);
            setStory(result);
        } catch (err) {
            setError(t('storyGen.error'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-8">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-200">{t('storyGen.title')}</h2>
            </header>
            
            <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }} className="relative mb-6">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('storyGen.prompt.placeholder')}
                    disabled={isLoading}
                    className="w-full bg-gray-800 text-white p-4 pr-32 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                    rows={3}
                />
                <VoiceInput currentValue={prompt} onTranscriptChange={setPrompt} disabled={isLoading} />
                 <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="absolute bottom-4 right-14 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600"
                >
                    {t('storyGen.generate')}
                </button>
            </form>
            
            {error && <p className="text-red-400 mb-4">{error}</p>}
            
            <div className="flex-1 overflow-y-auto bg-gray-800 rounded-lg p-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Spinner />
                        <p className="mt-4 text-gray-400">{t('storyGen.loading')}</p>
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap text-gray-300">{story || 'Your generated story will appear here.'}</p>
                )}
            </div>
        </div>
    );
};

export default StoryGeneratorTool;

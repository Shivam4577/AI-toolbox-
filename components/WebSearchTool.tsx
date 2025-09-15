import React, { useState } from 'react';
import { groundedSearch } from '../services/geminiService';
import { GroundingSource } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { Spinner } from './common/Spinner';
import VoiceInput from './common/VoiceInput';

const WebSearchTool: React.FC = () => {
    const { t } = useLocalization();
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState<{ text: string; sources: GroundingSource[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const searchResult = await groundedSearch(prompt);
            setResult(searchResult);
        } catch (err) {
            setError(t('webSearch.error'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-8">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-200">{t('webSearch.title')}</h2>
            </header>

            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative mb-8">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('webSearch.prompt.placeholder')}
                    disabled={isLoading}
                    className="w-full bg-gray-800 text-white p-4 pr-32 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <VoiceInput currentValue={prompt} onTranscriptChange={setPrompt} disabled={isLoading} />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600"
                >
                    {t('webSearch.search')}
                </button>
            </form>

            <div className="flex-1 overflow-y-auto bg-gray-800 rounded-lg p-6">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Spinner />
                        <p className="mt-4 text-gray-400">{t('webSearch.loading')}</p>
                    </div>
                )}
                {error && <p className="text-red-400 text-center">{error}</p>}
                {result && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-indigo-400">{t('webSearch.answer')}</h3>
                            <p className="text-gray-300 whitespace-pre-wrap">{result.text}</p>
                        </div>
                        {result.sources.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-indigo-400">{t('webSearch.sources')}</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    {result.sources.map((source, index) => (
                                        source.web?.uri && (
                                            <li key={index}>
                                                <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                    {source.web.title || source.web.uri}
                                                </a>
                                            </li>
                                        )
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebSearchTool;

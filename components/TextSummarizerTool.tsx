// Fix: Created the TextSummarizerTool component.
import React, { useState } from 'react';
import { summarizeText } from '../services/geminiService';
import { useLocalization } from '../contexts/LocalizationContext';
import { Spinner } from './common/Spinner';

type SummaryFormat = 'paragraph' | 'bullets';

const TextSummarizerTool: React.FC = () => {
    const { t } = useLocalization();
    const [inputText, setInputText] = useState('');
    const [summary, setSummary] = useState('');
    const [format, setFormat] = useState<SummaryFormat>('paragraph');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSummarize = async () => {
        if (!inputText.trim()) return;

        setIsLoading(true);
        setError(null);
        setSummary('');

        try {
            const result = await summarizeText(inputText, format);
            setSummary(result);
        } catch (err) {
            setError(t('summarizer.error'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-8">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-200">{t('summarizer.title')}</h2>
            </header>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto">
                {/* Input and Controls */}
                <div className="flex flex-col space-y-4">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t('summarizer.prompt.placeholder')}
                        disabled={isLoading}
                        className="w-full flex-grow bg-gray-800 text-white p-4 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                    />
                    <div>
                        <label htmlFor="summary-format" className="block mb-2 text-sm font-medium text-gray-400">
                            {t('summarizer.format.label')}
                        </label>
                        <select
                            id="summary-format"
                            value={format}
                            onChange={(e) => setFormat(e.target.value as SummaryFormat)}
                            disabled={isLoading}
                            className="w-full bg-gray-800 text-white p-2 rounded-lg"
                        >
                            <option value="paragraph">{t('summarizer.format.paragraph')}</option>
                            <option value="bullets">{t('summarizer.format.bullets')}</option>
                        </select>
                    </div>
                    <button
                        onClick={handleSummarize}
                        disabled={isLoading || !inputText.trim()}
                        className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-600"
                    >
                        {isLoading ? <Spinner /> : t('summarizer.summarize')}
                    </button>
                    {error && <p className="text-red-400 mt-2">{error}</p>}
                </div>

                {/* Summary Display */}
                <div className="bg-gray-800 rounded-lg p-6 flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-400">{t('summarizer.result.title')}</h3>
                    <div className="flex-grow overflow-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Spinner />
                            </div>
                        ) : (
                            <div className="whitespace-pre-wrap text-gray-300">
                                {summary || 'The summary will appear here...'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextSummarizerTool;

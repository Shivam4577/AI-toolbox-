// Fix: Created the CodeGeneratorTool component.
import React, { useState } from 'react';
import { generateCode } from '../services/geminiService';
import { useLocalization } from '../contexts/LocalizationContext';
import { Spinner } from './common/Spinner';
import VoiceInput from './common/VoiceInput';

const CodeGeneratorTool: React.FC = () => {
    const { t } = useLocalization();
    const [prompt, setPrompt] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setGeneratedCode('');
        
        try {
            const code = await generateCode(prompt);
            const cleanedCode = code.replace(/```[\w]*\n/g, '').replace(/```/g, '').trim();
            setGeneratedCode(cleanedCode);
        } catch (err) {
            setError(t('codeGen.error'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="h-full flex flex-col p-8">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-200">{t('codeGen.title')}</h2>
            </header>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto">
                {/* Controls */}
                <div className="flex flex-col space-y-4">
                    <div className="relative flex-grow flex flex-col">
                         <label htmlFor="code-prompt" className="mb-2 font-semibold text-gray-300">Prompt</label>
                        <textarea
                            id="code-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t('codeGen.prompt.placeholder')}
                            disabled={isLoading}
                            className="w-full flex-grow bg-gray-800 text-white p-4 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                        />
                        <VoiceInput currentValue={prompt} onTranscriptChange={setPrompt} disabled={isLoading} />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-600"
                    >
                        {isLoading ? <Spinner /> : t('codeGen.generate')}
                    </button>
                    {error && <p className="text-red-400 mt-2">{error}</p>}
                </div>

                {/* Code Display */}
                <div className="bg-gray-800 rounded-lg flex flex-col">
                    <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-t-lg">
                        <span className="text-sm text-gray-400">Generated Code</span>
                        <button
                            onClick={handleCopy}
                            disabled={!generatedCode}
                            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
                        >
                            {copied ? t('codeGen.copied') : t('codeGen.copy')}
                        </button>
                    </div>
                    <div className="flex-grow p-4 overflow-auto">
                         {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                               <Spinner />
                            </div>
                        ) : (
                        <pre className="whitespace-pre-wrap">
                            <code className="text-sm">{generatedCode || '// Your generated code will appear here...'}</code>
                        </pre>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeGeneratorTool;

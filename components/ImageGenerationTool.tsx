import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { useLocalization } from '../contexts/LocalizationContext';
import { Spinner } from './common/Spinner';
import VoiceInput from './common/VoiceInput';


const ImageGenerationTool: React.FC = () => {
    const { t } = useLocalization();
    const [prompt, setPrompt] = useState('');
    const [numImages, setNumImages] = useState(1);
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setImages([]);

        try {
            const generatedImages = await generateImage(prompt, aspectRatio, numImages);
            setImages(generatedImages);
        } catch (err) {
            setError(t('imageGen.error'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-8">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-200">{t('imageGen.title')}</h2>
            </header>
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Controls */}
                    <div className="space-y-6">
                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t('imageGen.prompt.placeholder')}
                                disabled={isLoading}
                                className="w-full bg-gray-800 text-white p-4 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                                rows={4}
                            />
                            <VoiceInput currentValue={prompt} onTranscriptChange={setPrompt} disabled={isLoading} />
                        </div>
                        <div>
                            <label htmlFor="numImages" className="block mb-2 text-sm font-medium text-gray-400">{t('imageGen.numImages.label')}</label>
                            <input
                                id="numImages"
                                type="number"
                                min="1"
                                max="4"
                                value={numImages}
                                onChange={(e) => setNumImages(parseInt(e.target.value))}
                                disabled={isLoading}
                                className="w-full bg-gray-800 text-white p-2 rounded-lg"
                            />
                        </div>
                        <div>
                            <label htmlFor="aspectRatio" className="block mb-2 text-sm font-medium text-gray-400">{t('imageGen.aspectRatio.label')}</label>
                            <select
                                id="aspectRatio"
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                                disabled={isLoading}
                                className="w-full bg-gray-800 text-white p-2 rounded-lg"
                            >
                                {aspectRatios.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt.trim()}
                            className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-600"
                        >
                            {isLoading ? t('imageGen.loading') : t('imageGen.generate')}
                        </button>
                        {error && <p className="text-red-400 mt-4">{error}</p>}
                    </div>
                    {/* Image Display */}
                    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                        {isLoading ? (
                            <div className="text-center">
                                <Spinner />
                                <p className="mt-4 text-gray-400">{t('imageGen.loading')}</p>
                            </div>
                        ) : (
                            <div className={`grid gap-4 ${numImages > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {images.map((imgSrc, index) => (
                                    <img key={index} src={imgSrc} alt={`${t('imageGen.altText.generated')} ${index + 1}`} className="rounded-lg object-contain max-h-96" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageGenerationTool;

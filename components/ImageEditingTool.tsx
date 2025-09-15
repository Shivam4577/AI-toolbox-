import React, { useState, useRef } from 'react';
import { editImage } from '../services/geminiService';
import { useLocalization } from '../contexts/LocalizationContext';
import { Spinner } from './common/Spinner';
import VoiceInput from './common/VoiceInput';

const ImageEditingTool: React.FC = () => {
    const { t } = useLocalization();
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setOriginalImageUrl(URL.createObjectURL(file));
            setEditedImageUrl(null); // Clear previous edit
            setError(null);
        }
    };

    const handleEdit = async () => {
        if (!prompt.trim() || !imageFile) return;

        setIsLoading(true);
        setError(null);
        setEditedImageUrl(null);

        try {
            const { imageUrl, text } = await editImage(prompt, imageFile);
            if (imageUrl) {
                setEditedImageUrl(imageUrl);
            } else {
                setError(t('imageEdit.error.noImage', { text: text || 'N/A' }));
            }
        } catch (err) {
            setError(t('imageEdit.error.general'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-8">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-200">{t('imageEdit.title')}</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 overflow-y-auto">
                {/* Inputs & Controls */}
                <div className="flex flex-col space-y-6">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500"
                    >
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        <p className="text-gray-400">{imageFile ? t('imageEdit.upload.selected', { fileName: imageFile.name }) : t('imageEdit.upload.label')}</p>
                    </div>

                    <div className="relative">
                       <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t('imageEdit.prompt.placeholder')}
                            disabled={isLoading || !imageFile}
                            className="w-full bg-gray-800 text-white p-4 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none disabled:opacity-50"
                            rows={3}
                        />
                         <VoiceInput currentValue={prompt} onTranscriptChange={setPrompt} disabled={isLoading || !imageFile} />
                    </div>

                    <button
                        onClick={handleEdit}
                        disabled={isLoading || !prompt.trim() || !imageFile}
                        className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? t('imageEdit.loading') : t('imageEdit.edit')}
                    </button>
                    {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
                </div>

                {/* Image Previews */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                        <h3 className="text-lg font-semibold mb-2">{t('imageEdit.original.title')}</h3>
                        <div className="w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
                            {originalImageUrl ?
                                <img src={originalImageUrl} alt="Original" className="max-w-full max-h-full object-contain rounded-lg" /> :
                                <p className="text-gray-500">{t('imageEdit.original.placeholder')}</p>}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <h3 className="text-lg font-semibold mb-2">{t('imageEdit.edited.title')}</h3>
                        <div className="w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
                            {isLoading ? <Spinner /> :
                             editedImageUrl ?
                                <img src={editedImageUrl} alt="Edited" className="max-w-full max-h-full object-contain rounded-lg" /> :
                                <p className="text-gray-500">{t('imageEdit.edited.placeholder')}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditingTool;

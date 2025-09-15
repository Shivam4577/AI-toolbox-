import React, { useState } from 'react';
import { generateRecipes } from '../services/geminiService';
import { Recipe } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { Spinner } from './common/Spinner';
import VoiceInput from './common/VoiceInput';

const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
    const { t } = useLocalization();
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-indigo-400 mb-2">{recipe.recipeName}</h3>
            <p className="text-gray-400 mb-4">{recipe.description}</p>
            <div className="flex space-x-4 mb-4 text-sm text-gray-300">
                <span><strong>{t('recipeCard.prep')}:</strong> {recipe.prepTime}</span>
                <span><strong>{t('recipeCard.cook')}:</strong> {recipe.cookTime}</span>
                <span><strong>{t('recipeCard.servings')}:</strong> {recipe.servings}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-lg mb-2">{t('recipeCard.ingredients')}</h4>
                    <ul className="list-disc list-inside text-gray-400 space-y-1">
                        {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-lg mb-2">{t('recipeCard.instructions')}</h4>
                    <ol className="list-decimal list-inside text-gray-400 space-y-2">
                        {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                </div>
            </div>
        </div>
    );
};


const RecipeGeneratorTool: React.FC = () => {
    const { t } = useLocalization();
    const [prompt, setPrompt] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetRecipes = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setRecipes([]);

        try {
            const generatedRecipes = await generateRecipes(prompt);
            setRecipes(generatedRecipes);
        } catch (err: any) {
            setError(err.message || t('recipeGen.error'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-8">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-200">{t('recipeGen.title')}</h2>
            </header>

            <form onSubmit={(e) => { e.preventDefault(); handleGetRecipes(); }} className="relative mb-8">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('recipeGen.prompt.placeholder')}
                    disabled={isLoading}
                    className="w-full bg-gray-800 text-white p-4 pr-32 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                 <VoiceInput currentValue={prompt} onTranscriptChange={setPrompt} disabled={isLoading} />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="absolute right-14 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600"
                >
                    {t('recipeGen.getRecipes')}
                </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-6">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Spinner />
                        <p className="mt-4 text-gray-400">{t('recipeGen.loading')}</p>
                    </div>
                )}
                {error && <p className="text-red-400 text-center">{error}</p>}
                {recipes.map((recipe, index) => (
                    <RecipeCard key={index} recipe={recipe} />
                ))}
            </div>
        </div>
    );
};

export default RecipeGeneratorTool;

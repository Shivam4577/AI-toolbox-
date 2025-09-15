// Fix: Implemented all Gemini API service functions according to guidelines.
import { GoogleGenAI, Chat, Type, Modality } from "@google/genai";
import { Recipe, GroundingSource } from '../types';

const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

// -- Chat --
export const createChat = (): Chat => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a helpful and friendly assistant.',
        },
    });
    return chat;
};

// -- Image Generation --
export const generateImage = async (prompt: string, aspectRatio: string, numberOfImages: number): Promise<string[]> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: numberOfImages,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio,
        },
    });

    return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
};

// -- Image Editing --
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const editImage = async (prompt: string, imageFile: File): Promise<{ imageUrl: string | null, text: string | null }> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    let imageUrl: string | null = null;
    let text: string | null = null;

    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
            text = part.text;
        } else if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    
    return { imageUrl, text };
};

// -- Web Search --
export const groundedSearch = async (prompt: string): Promise<{ text: string, sources: GroundingSource[] }> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const text = response.text;
    // Fix: Process grounding chunks to match the stricter GroundingSource type.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
        .filter(chunk => chunk.web?.uri)
        .map(chunk => ({
            web: {
                uri: chunk.web!.uri!,
                title: chunk.web!.title || chunk.web!.uri!,
            },
        }));

    return { text, sources };
};

// -- Recipe Generation --
const recipeSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            recipeName: { type: Type.STRING },
            description: { type: Type.STRING },
            prepTime: { type: Type.STRING },
            cookTime: { type: Type.STRING },
            servings: { type: Type.STRING },
            ingredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
            },
            instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
            },
        },
        required: ['recipeName', 'description', 'prepTime', 'cookTime', 'servings', 'ingredients', 'instructions']
    },
};

export const generateRecipes = async (prompt: string): Promise<Recipe[]> => {
    const fullPrompt = `Generate recipes based on the following request: "${prompt}". Ensure the output is a JSON array of recipe objects matching the provided schema.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
        },
    });

    try {
        let jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse recipes JSON:", e);
        console.error("Received text:", response.text);
        throw new Error("Could not understand the recipe format from the AI. Please try a different prompt.");
    }
};

// -- Code Generation --
export const generateCode = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: "You are a coding assistant. Generate clean, efficient, and well-documented code based on the user's request. Respond only with the code block.",
        },
    });
    return response.text;
};

// -- Story Generation --
export const generateStory = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: "You are a creative and engaging storyteller. Write a story based on the user's prompt.",
        },
    });

    let story = "";
    for await (const chunk of response) {
        story += chunk.text;
    }
    return story;
};


// -- Text Summarization --
export const summarizeText = async (textToSummarize: string, format: 'paragraph' | 'bullets'): Promise<string> => {
    const prompt = `Summarize the following text in ${format} format:\n\n${textToSummarize}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: "You are an expert summarizer. Provide concise and accurate summaries.",
            temperature: 0.2,
        },
    });
    return response.text;
};
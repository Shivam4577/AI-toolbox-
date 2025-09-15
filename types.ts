// Fix: Populated the file with necessary type definitions.
export enum Tool {
  CHAT = 'chat',
  IMAGE_GEN = 'imageGen',
  IMAGE_EDIT = 'imageEdit',
  WEB_SEARCH = 'webSearch',
  RECIPE_GEN = 'recipeGen',
  CODE_GEN = 'codeGen',
  STORY_GEN = 'storyGen',
  SUMMARIZER = 'summarizer',
  ADMIN = 'admin',
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GroundingSource {
    web?: {
        uri: string;
        title: string;
    }
}

export interface Recipe {
    recipeName: string;
    description: string;
    prepTime: string;
    cookTime: string;
    servings: string;
    ingredients: string[];
    instructions: string[];
}

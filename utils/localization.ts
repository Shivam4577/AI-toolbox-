// Fix: Created the localization file with all necessary translation strings.
export type Language = 'en' | 'es';

export const languages: { [key in Language]: string } = {
  en: 'English',
  es: 'Español',
};

export const defaultLang: Language = 'en';

export const translations: { [key in Language]: { [key: string]: string } } = {
  en: {
    'sidebar.title': 'AI Toolbox',
    'sidebar.share': 'Share App',
    'sidebar.copied': 'Link Copied!',
    'sidebar.share.title': 'Check out AI Toolbox!',
    'sidebar.share.text': 'A collection of useful tools powered by the Gemini API.',
    'sidebar.aria.switchTo': 'Switch to {{tool}}',

    'tool.chat': 'Chat',
    'tool.imageGen': 'Image Generation',
    'tool.imageEdit': 'Image Editing',
    'tool.webSearch': 'Web Search',
    'tool.recipeGen': 'Recipe Generator',
    'tool.codeGen': 'Code Generator',
    'tool.storyGen': 'Story Generator',
    'tool.summarizer': 'Text Summarizer',
    'tool.admin': 'Admin Panel',

    'chat.title': 'Chat with Gemini',
    'chat.placeholder': 'Type your message here...',
    'chat.send': 'Send',
    'chat.clear': 'Clear Chat',
    'chat.start': 'Start a conversation by typing a message below.',
    'chat.error': 'An error occurred while getting a response. Please try again.',
    
    'imageGen.title': 'Image Generation',
    'imageGen.prompt.placeholder': 'Describe the image you want to create...',
    'imageGen.numImages.label': 'Number of Images (1-4)',
    'imageGen.aspectRatio.label': 'Aspect Ratio',
    'imageGen.generate': 'Generate',
    'imageGen.loading': 'Generating...',
    'imageGen.error': 'An error occurred while generating images. Please try again.',
    'imageGen.altText.generated': 'Generated image',

    'imageEdit.title': 'Image Editing',
    'imageEdit.upload.label': 'Click here to upload an image',
    'imageEdit.upload.selected': 'Selected: {{fileName}}',
    'imageEdit.prompt.placeholder': 'Describe how you want to edit the image...',
    'imageEdit.edit': 'Edit Image',
    'imageEdit.loading': 'Editing...',
    'imageEdit.error.general': 'An error occurred while editing the image.',
    'imageEdit.error.noImage': 'The model did not return an image. It said: "{{text}}"',
    'imageEdit.original.title': 'Original',
    'imageEdit.original.placeholder': 'Upload an image to start.',
    'imageEdit.edited.title': 'Edited',
    'imageEdit.edited.placeholder': 'Your edited image will appear here.',

    'webSearch.title': 'Web Search',
    'webSearch.prompt.placeholder': 'Ask a question about recent events or topics...',
    'webSearch.search': 'Search',
    'webSearch.loading': 'Searching the web...',
    'webSearch.error': 'An error occurred during the search. Please try again.',
    'webSearch.answer': 'Answer',
    'webSearch.sources': 'Sources',

    'recipeGen.title': 'Recipe Generator',
    'recipeGen.prompt.placeholder': 'Enter ingredients or a dish name (e.g., "chicken and rice")...',
    'recipeGen.getRecipes': 'Get Recipes',
    'recipeGen.loading': 'Finding recipes...',
    'recipeGen.error': 'Could not generate recipes. Please try a different prompt.',

    'recipeCard.prep': 'Prep',
    'recipeCard.cook': 'Cook',
    'recipeCard.servings': 'Servings',
    'recipeCard.ingredients': 'Ingredients',
    'recipeCard.instructions': 'Instructions',

    'codeGen.title': 'Code Generator',
    'codeGen.prompt.placeholder': 'Describe the code you need (e.g., "a Python function to reverse a string")...',
    'codeGen.generate': 'Generate Code',
    'codeGen.loading': 'Generating...',
    'codeGen.error': 'An error occurred while generating code. Please try again.',
    'codeGen.copy': 'Copy Code',
    'codeGen.copied': 'Copied!',

    'storyGen.title': 'Story Generator',
    'storyGen.prompt.placeholder': 'Give me a topic for a story (e.g., "a brave knight and a friendly dragon")...',
    'storyGen.generate': 'Generate Story',
    'storyGen.loading': 'Writing...',
    'storyGen.error': 'An error occurred while generating the story. Please try again.',

    'summarizer.title': 'Text Summarizer',
    'summarizer.prompt.placeholder': 'Paste the text you want to summarize here...',
    'summarizer.summarize': 'Summarize',
    'summarizer.loading': 'Summarizing...',
    'summarizer.error': 'An error occurred while summarizing the text. Please try again.',
    'summarizer.format.label': 'Output Format',
    'summarizer.format.paragraph': 'Paragraph',
    'summarizer.format.bullets': 'Bullet Points',
    'summarizer.result.title': 'Summary',

    'admin.title': 'Admin Panel',
    'admin.stats': 'Tool Usage Statistics',
    'admin.clear': 'Clear Stats',
    'admin.confirmClear': 'Are you sure you want to clear all usage statistics? This cannot be undone.',
    'admin.total': 'Total Uses',
    'admin.noData': 'No usage data has been recorded yet.',
    
    'ad.loading': 'Loading Ad...',
    'ad.error': 'The ad could not be loaded.',
    'ad.close': 'Close ad',

    'voice.start': 'Start voice input',
    'voice.stop': 'Stop voice input',

    'header.toggleSidebar': 'Toggle sidebar',
    'header.backToChat': 'Back to Chat',
  },
  es: {
    'sidebar.title': 'Caja de IA',
    'sidebar.share': 'Compartir App',
    'sidebar.copied': '¡Enlace Copiado!',
    'sidebar.share.title': '¡Mira esta Caja de IA!',
    'sidebar.share.text': 'Una colección de herramientas útiles impulsadas por la API de Gemini.',
    'sidebar.aria.switchTo': 'Cambiar a {{tool}}',

    'tool.chat': 'Chat',
    'tool.imageGen': 'Generación de Imágenes',
    'tool.imageEdit': 'Edición de Imágenes',
    'tool.webSearch': 'Búsqueda Web',
    'tool.recipeGen': 'Generador de Recetas',
    'tool.codeGen': 'Generador de Código',
    'tool.storyGen': 'Generador de Historias',
    'tool.summarizer': 'Resumidor de Texto',
    'tool.admin': 'Panel de Admin',

    'chat.title': 'Chatea con Gemini',
    'chat.placeholder': 'Escribe tu mensaje aquí...',
    'chat.send': 'Enviar',
    'chat.clear': 'Limpiar Chat',
    'chat.start': 'Inicia una conversación escribiendo un mensaje.',
    'chat.error': 'Ocurrió un error al obtener una respuesta. Por favor, inténtalo de nuevo.',

    'admin.title': 'Panel de Administración',
    'admin.stats': 'Estadísticas de Uso de Herramientas',
    'admin.clear': 'Limpiar Estadísticas',
    'admin.confirmClear': '¿Estás seguro de que quieres borrar todas las estadísticas de uso? Esta acción no se puede deshacer.',
    'admin.total': 'Usos Totales',
    'admin.noData': 'Aún no se han registrado datos de uso.',

    'ad.loading': 'Cargando anuncio...',
    'ad.error': 'El anuncio no pudo cargarse.',
    'ad.close': 'Cerrar anuncio',

    'header.toggleSidebar': 'Alternar barra lateral',
    'header.backToChat': 'Volver al Chat',
  },
};
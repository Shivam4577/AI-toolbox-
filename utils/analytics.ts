import { Tool } from '../types';

const ANALYTICS_KEY = 'gemini-tool-analytics';

/**
 * Logs the usage of a specific tool by incrementing its counter in localStorage.
 * @param {Tool} tool The tool that was used.
 */
export const logToolUsage = (tool: Tool) => {
    try {
        const stats = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{}');
        stats[tool] = (stats[tool] || 0) + 1;
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(stats));
    } catch (error) {
        console.error('Failed to log tool usage:', error);
    }
};

/**
 * Retrieves all tool usage statistics from localStorage.
 * @returns { { [key in Tool]?: number } } An object containing usage counts for each tool.
 */
export const getToolUsage = (): { [key in Tool]?: number } => {
     try {
        return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{}');
    } catch (error) {
        console.error('Failed to get tool usage:', error);
        return {};
    }
}

/**
 * Clears all tool usage statistics from localStorage.
 */
export const clearToolUsage = () => {
    try {
        localStorage.removeItem(ANALYTICS_KEY);
    } catch (error) {
        console.error('Failed to clear tool usage:', error);
    }
};

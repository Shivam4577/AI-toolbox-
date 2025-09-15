import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import { createChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { Spinner } from './common/Spinner';
import VoiceInput from './common/VoiceInput';

const ChatTool: React.FC = () => {
    const { t } = useLocalization();
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setChat(createChat());
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !chat) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            // Fix: Corrected sendMessage call to match the required signature.
            const response = await chat.sendMessage({ message: input });
            const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response.text }] };
            setMessages(prev => [...prev, modelMessage]);
        } catch (err) {
            setError(t('chat.error'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleClearChat = () => {
        setMessages([]);
        setChat(createChat()); // Start a new chat session
    };

    return (
        <div className="h-full flex flex-col p-8">
            <header className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-200">{t('chat.title')}</h2>
                <button
                    onClick={handleClearChat}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    {t('chat.clear')}
                </button>
            </header>
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">{t('chat.start')}</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-500' : 'bg-gray-700'}`}>
                                <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 p-3 rounded-lg">
                            <Spinner />
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
            {error && <p className="text-red-400 mt-4">{error}</p>}
            <div className="mt-8">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={t('chat.placeholder')}
                        disabled={isLoading}
                        className="w-full bg-gray-800 text-white p-4 pr-24 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                        rows={1}
                    />
                    <VoiceInput currentValue={input} onTranscriptChange={setInput} disabled={isLoading} />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {t('chat.send')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatTool;

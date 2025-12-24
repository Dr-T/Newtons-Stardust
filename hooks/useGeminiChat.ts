import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export const useGeminiChat = (apiKey: string | undefined, systemInstruction: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;
        if (!apiKey) {
            setError("API Key is missing");
            return;
        }

        setIsLoading(true);
        setError(null);

        // Create new history with user message
        const newUserMsg: Message = { role: 'user', content: text };

        // Construct the new history synchronously using current 'messages' state
        const currentHistory = [...messages, newUserMsg];

        setMessages(currentHistory);

        try {
            const client = new GoogleGenAI({ apiKey });

            const apiContents = currentHistory.map(m => ({
                role: m.role,
                parts: [{ text: m.content }]
            }));

            const response = await client.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: apiContents,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7,
                }
            });

            // StardustPage.tsx treats response.text as a property/string
            // Note: In newer SDKs it might be a function, but sticking to user's observed pattern or property.
            // If response.text() is a function in the installed version, use that.
            // Safely check:
            const responseText = response.text;

            if (responseText) {
                const aiMsg: Message = { role: 'model', content: responseText };
                setMessages(prev => [...prev, aiMsg]);
            }

        } catch (err: any) {
            console.error("Gemini Chat Error:", err);
            setError(err.message || "Failed to send message");
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, systemInstruction, messages]);

    return {
        messages,
        sendMessage,
        isLoading,
        error,
        resetChat: () => setMessages([]),
        setMessages
    };
};

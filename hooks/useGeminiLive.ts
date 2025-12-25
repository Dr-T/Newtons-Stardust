import { useRef, useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ChatMessage } from '../types';

export const useGeminiLive = (apiKey: string | undefined, onMessage: (text: string) => void) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState<{ user: string, model: string }>({ user: '', model: '' });
    const [history, setHistory] = useState<ChatMessage[]>([]);

    // Store the active session object to close it properly
    const activeSessionRef = useRef<any>(null);

    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Audio playback queue
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    // Ref to track current turn transcript synchronously for history
    const transcriptRef = useRef<{ user: string, model: string }>({ user: '', model: '' });

    // Helper: Decode Audio
    const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
        const dataInt16 = new Int16Array(data.buffer);
        const frameCount = dataInt16.length;
        const buffer = ctx.createBuffer(1, frameCount, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i] / 32768.0;
        }
        return buffer;
    };

    // Helper: Base64 decode
    const base64ToUint8Array = (base64: string) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    // Helper: Encode PCM for sending
    const float32ToPCM16 = (float32: Float32Array) => {
        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
            int16[i] = Math.max(-1, Math.min(1, float32[i])) * 0x7FFF;
        }
        const uint8 = new Uint8Array(int16.buffer);
        let binary = '';
        const len = uint8.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(uint8[i]);
        }
        return btoa(binary);
    };

    const connect = useCallback(async (customSystemInstruction: string) => {
        if (!apiKey) {
            console.error("No API key provided");
            return null;
        }

        // Ensure thorough cleanup before starting
        await disconnect();

        setIsConnecting(true);
        setHistory([]); // Reset history on new connection
        transcriptRef.current = { user: '', model: '' };

        const baseUrl = (import.meta as any).env.VITE_GEMINI_BASE_URL;
        const ai = new GoogleGenAI({ apiKey, baseUrl } as any);

        // Create new AudioContexts for this session
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

        inputAudioContextRef.current = inputCtx;
        outputAudioContextRef.current = outputCtx;

        try {
            // Capture stream locally to avoid race conditions in closures
            const currentStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = currentStream;

            // Base Physics Context (Shared across all personas)
            const physicsContext = `
        知识库 (Knowledge Base):
        1. 开普勒第一定律 (Kepler's First Law): 所有行星绕太阳运动的轨道都是椭圆，太阳处在椭圆的一个焦点上。
        2. 开普勒第二定律 (Kepler's Second Law): 行星和太阳的连线在相等的时间内扫过相等的面积 (近日点快，远日点慢)。
        3. 开普勒第三定律 (Kepler's Third Law): 所有行星轨道的半长轴的三次方跟它的公转周期的二次方的比值都相等 (R^3 / T^2 = k)。k 值仅取决于中心天体(太阳)的质量。
        4. 万有引力定律 (Gravity): F = G * (m1 * m2) / r^2。万有引力提供向心力。
        5. 宇宙速度 (Cosmic Velocities): 第一宇宙速度 v1 = 7.9km/s (环绕速度), 第二 v2 = 11.2km/s (脱离速度), 第三 v3 = 16.7km/s (逃逸速度)。
        `;

            const config = {
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                    },
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: `
            [SYSTEM SETTINGS]
            LANGUAGE_MODE: SIMPLIFIED_CHINESE_ONLY (zh-CN)
            
            INSTRUCTIONS:
            1. 所有文本输出和语音生成必须使用简体中文。
            2. 禁止使用繁体汉字（例如：使用“体”而非“體”，使用“国”而非“國”）。
            3. 即使用户使用英语或其他语言交流，也必须使用简体中文进行回复。
            
            General Rules:
            1. 采用“苏格拉底式对话”，针对逻辑模糊、术语堆砌的地方，立即进行追问（例如：“为什么行星快慢会变？”或“苹果和月亮有什么关系？”）；针对逻辑跳跃（例如直接给出 F=GMm/r² 而没解释来源），通过启发式提问引导进行公式推导。
            2. 在对话过程中，每次回复和追问保持简洁（不超过2个问题），重点在于逼‘用户’输出。
            3. 整个会话情景需控制在 3-8 轮会话内结束，避免会话过长，最后一轮会话给出一句话点评（讲的很好/讲的太难懂…）。

            CONTEXT:
            ${physicsContext}

            ${customSystemInstruction}
            `,
                },
                callbacks: {
                    onopen: () => {
                        setIsConnected(true);
                        setIsConnecting(false);
                        console.log("Gemini Live Connected");

                        if (inputCtx.state === 'suspended') {
                            inputCtx.resume();
                        }

                        const source = inputCtx.createMediaStreamSource(currentStream);
                        const processor = inputCtx.createScriptProcessor(4096, 1, 1);

                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const base64PCM = float32ToPCM16(inputData);

                            // Send audio data only if session is active
                            if (activeSessionRef.current) {
                                try {
                                    const p = activeSessionRef.current.sendRealtimeInput({
                                        media: {
                                            mimeType: 'audio/pcm;rate=16000',
                                            data: base64PCM
                                        }
                                    });
                                    if (p && typeof p.catch === 'function') {
                                        p.catch((e: any) => {
                                            // Suppress common errors when session is closing
                                            if (!e.message?.includes("Session is closed")) {
                                                console.error("Error sending input", e);
                                            }
                                        });
                                    }
                                } catch (e) {
                                    // Sync error
                                    console.error("Sync error sending input", e);
                                }
                            }
                        };

                        source.connect(processor);
                        processor.connect(inputCtx.destination);
                    },
                    onmessage: async (msg: LiveServerMessage) => {
                        // Handle Transcription
                        const serverContent = msg.serverContent;
                        if (serverContent) {
                            if (serverContent.outputTranscription?.text) {
                                const text = serverContent.outputTranscription.text;
                                setTranscript(prev => ({ ...prev, model: prev.model + text }));
                                transcriptRef.current.model += text;
                            }
                            if (serverContent.inputTranscription?.text) {
                                const text = serverContent.inputTranscription.text;
                                setTranscript(prev => ({ ...prev, user: prev.user + text }));
                                transcriptRef.current.user += text;
                            }

                            if (serverContent.turnComplete) {
                                // Save to history
                                const userText = transcriptRef.current.user.trim();
                                const modelText = transcriptRef.current.model.trim();

                                if (userText || modelText) {
                                    setHistory(prev => [
                                        ...prev,
                                        ...(userText ? [{ role: 'user', text: userText } as ChatMessage] : []),
                                        ...(modelText ? [{ role: 'model', text: modelText } as ChatMessage] : [])
                                    ]);
                                }

                                setTranscript({ user: '', model: '' });
                                transcriptRef.current = { user: '', model: '' };
                            }
                        }

                        // Handle Audio Output
                        const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (audioData && outputAudioContextRef.current) {
                            setIsSpeaking(true);
                            const ctx = outputAudioContextRef.current;

                            // Decode handles raw data
                            try {
                                const buffer = await decodeAudioData(base64ToUint8Array(audioData), ctx);

                                const source = ctx.createBufferSource();
                                source.buffer = buffer;
                                source.connect(ctx.destination);

                                const currentTime = ctx.currentTime;
                                const start = Math.max(currentTime, nextStartTimeRef.current);
                                source.start(start);
                                nextStartTimeRef.current = start + buffer.duration;

                                sourcesRef.current.add(source);
                                source.onended = () => {
                                    sourcesRef.current.delete(source);
                                    if (sourcesRef.current.size === 0) setIsSpeaking(false);
                                };
                            } catch (e) {
                                console.error("Audio decode error", e);
                            }
                        }
                    },
                    onclose: () => {
                        console.log("Gemini Live Closed");
                        setIsConnected(false);
                        setIsConnecting(false);
                        setIsSpeaking(false);
                    },
                    onerror: (e: any) => {
                        console.error("Gemini Error", e);
                        setIsConnected(false);
                        setIsConnecting(false);
                    }
                }
            };

            const session = await ai.live.connect(config);
            activeSessionRef.current = session;
            // NOTE: The model will automatically start speaking based on system instructions 
            // and/or when it detects the first audio input (even background noise).

            return currentStream;
        } catch (e) {
            console.error("Connection failed", e);
            setIsConnected(false);
            setIsConnecting(false);

            // Clean up audio contexts if connection failed
            if (inputAudioContextRef.current) {
                if (inputAudioContextRef.current.state !== 'closed') {
                    try {
                        const p = inputAudioContextRef.current.close();
                        if (p && typeof p.catch === 'function') p.catch(e => console.warn(e));
                    } catch (e) { }
                }
                inputAudioContextRef.current = null;
            }
            if (outputAudioContextRef.current) {
                if (outputAudioContextRef.current.state !== 'closed') {
                    try {
                        const p = outputAudioContextRef.current.close();
                        if (p && typeof p.catch === 'function') p.catch(e => console.warn(e));
                    } catch (e) { }
                }
                outputAudioContextRef.current = null;
            }

            return null;
        }

    }, [apiKey]);

    const disconnect = useCallback(async () => {
        // Close the session explicitly to avoid Network Error on reconnect
        if (activeSessionRef.current) {
            try {
                (activeSessionRef.current as any).close();
            } catch (e) {
                console.warn("Error closing session", e);
            }
            activeSessionRef.current = null;
        }

        // Stop Microphone Stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        // Close Audio Contexts
        if (inputAudioContextRef.current) {
            if (inputAudioContextRef.current.state !== 'closed') {
                try {
                    const p = inputAudioContextRef.current.close();
                    if (p && typeof p.catch === 'function') p.catch(e => console.warn(e));
                } catch (e) { }
            }
            inputAudioContextRef.current = null;
        }
        if (outputAudioContextRef.current) {
            if (outputAudioContextRef.current.state !== 'closed') {
                try {
                    const p = outputAudioContextRef.current.close();
                    if (p && typeof p.catch === 'function') p.catch(e => console.warn(e));
                } catch (e) { }
            }
            outputAudioContextRef.current = null;
        }

        // Stop all playing audio sources
        sourcesRef.current.forEach(source => {
            try { source.stop(); } catch (e) { }
        });
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;

        setIsConnected(false);
        setIsConnecting(false);
        setIsSpeaking(false);
        setTranscript({ user: '', model: '' });
        transcriptRef.current = { user: '', model: '' };
    }, []);

    return { connect, disconnect, isConnected, isConnecting, isSpeaking, transcript, history, stream: streamRef.current };
};
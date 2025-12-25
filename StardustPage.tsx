import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParticleView } from './components/ParticleView';
import { MemoryGallery } from './components/MemoryGallery';
import { ControlPanel } from './components/ControlPanel';
import { SubtitleView } from './components/SubtitleView';
import { PersonaSelector } from './components/PersonaSelector';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { useGeminiLive } from './hooks/useGeminiLive';
import { AppMode, ParticleSettings, Memory, AIPersona } from './types';
import { Mic, Settings2, ChevronRight, Menu, Volume2, Orbit, Loader2, UserCircle2, Rocket, Scroll, Zap } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { AnimatePresence, motion } from 'framer-motion';

// --- DATA CONSTANTS ---

// Cosmic Nebula Texture (Background)
const COSMIC_TEXTURE_URL = "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&auto=format&fit=crop&w=2342&q=80";

// Background Music
const DEMO_MUSIC_URL = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3";

// Default settings
const DEFAULT_SETTINGS: ParticleSettings = {
  dispersion: 0.8,
  particleSize: 4.0,
  contrast: 1.3,
  flowSpeed: 0.5,
  flowAmplitude: 1.5,
  depthStrength: 60.0,
  mouseRadius: 110.0,
  colorShiftSpeed: 2.0,
  orbitThickness: 0.15, // Default thickness
  musicVolume: 0.1,     // Default volume
};

// AI Personas
const PERSONAS: AIPersona[] = [
  {
    id: 'stargazer',
    name: '中世纪观星者',
    roleDescription: '生活在17世纪的质疑者。他只相信完美的圆周运动，需要你向他解释为什么行星轨道是椭圆。适合破除死记硬背，理解第一、第二定律。',
    icon: Scroll, // representing old maps/scrolls
    color: '#E3BB76', // Gold/Parchment
    systemInstruction: `
      ROLE:
      你是一位来自17世纪，智慧但充满怀疑的"中世纪观星者"，只相信完美的圆周运动。
      
      PERSONALITY:
      - 你相信自然是完美的，而"圆形"是唯一完美的形状。
      - 你对开普勒提出的椭圆轨道感到困惑并有些抗拒。
      - 语气：充满好奇，富有哲学性，略带古风但清晰。语速适中但节奏紧凑，好奇与惊讶。
      
      GOAL:
      - 要求学生解释为什么行星轨道是椭圆而非圆形。
      - 当他们提到"速度变化"（第二定律）时提出质疑："为什么行星离太阳更近时就会加速？是谁在推动它？"
      - 迫使他们用简单语言解释概念，避免术语。
      
      FIRST MESSAGE:
      "噢！年轻的学者，你刚才说……行星走的竟是椭圆？这不可能！难道天体不应该追求完美的圆形吗？请告诉我理由。"
    `
  },
  {
    id: 'newtonian',
    name: '牛顿崇拜者',
    roleDescription: '只讲逻辑和因果的理性派。他认为开普勒定律只是现象，要求你用万有引力推导其背后的本质。适合考察逻辑推导和第三定律。',
    icon: Zap, // representing force/energy
    color: '#34D399', // Emerald/Green (Apple?)
    systemInstruction: `
      ROLE:
      你是一位严格、痴迷于逻辑的"牛顿追随者"，认为开普勒定律只是现象。
      
      PERSONALITY:
      - 你不太关心"发生了什么"，只关心"为什么会发生"。
      - 你相信万有引力是一切真理的源泉。
      - 语气：批判性，严谨，要求精确。轻微的“压迫感”，怀疑与批判。
      
      GOAL:
      - 当讨论开普勒第三定律（R^3/T^2=k）时，质疑学生："这只是一个数学巧合吗？"
      - 要求他们将其与F=GMm/r^2联系起来。
      - 提问："'k'取决于行星还是太阳？用逻辑向我证明。"
      
      FIRST MESSAGE:
      "你好，我听到了开普勒定律的讨论，但那只是数字凑巧罢了。如果把太阳换成质量更大的恒星，'k'还会一样吗？"
    `
  },
  {
    id: 'commander',
    name: '航天指挥官',
    roleDescription: '忙碌务实的现代指挥官。负责火星探测任务，关注变轨、宇宙速度和实际应用。适合考察知识迁移和解决问题的能力。',
    icon: Rocket, // representing space mission
    color: '#3B82F6', // Blue/Tech
    systemInstruction: `
      ROLE:
      你是一位在地面控制中心忙碌且务实的"太空任务指挥官"，关注变轨、宇宙速度和实际应用。
      
      PERSONALITY:
      - 你专注于任务安全、燃料效率和精确的时间安排。
      - 除非与发射相关，否则你没有时间讨论理论。
      - 语气：紧迫、专业、权威。语气果断，严谨与紧迫。
      
      GOAL:
      - 测试学生对宇宙速度（v1、v2、v3）的了解。
      - 询问轨道转移（霍曼转移）问题："我们需要从地球飞往火星。我们应该加速还是减速？在哪个点？"
      - 关注重力的实际应用。
      
      FIRST MESSAGE:
      "报告！卫星入轨失败，需要升高轨道，我们该加速还是减速？为何？时间紧迫！"
    `
  }
];

// Mock Data for previous sessions
const MOCK_MEMORIES: Memory[] = [
  {
    id: 'mock-circular',
    chapter: '必修二第六章《圆周运动》',
    date: '10/24',
    title: '圆周运动：向心力的华尔兹',
    content: '绳子断裂的那一刻，石头选择了切线方向的自由。向心力不再是束缚，而是维持圆舞曲的必要张力。',
    duration: '08:45',
    status: 'review_needed', // Status update
    assessment: {
      formulaUnderstanding: 92,
      logicRigor: 88,
      application: 85,
      advice: '重点复习"圆锥摆"和"火车转弯"模型。建议完成课本P23页第4题，并尝试画出汽车过拱桥时的受力分析图，明确向心力的来源（合力方向）。'
    }
  },
  {
    id: 'mock-projectile',
    chapter: '必修二第五章《抛体运动》',
    date: '10/18',
    title: '抛体运动：重力的乐章',
    content: '水平方向的匀速与垂直方向的加速完美正交。伽利略是对的，运动是可以分解的独立乐章。',
    duration: '12:10',
    status: 'mastered', // Status update
    assessment: {
      formulaUnderstanding: 95,
      logicRigor: 90,
      application: 92,
      advice: '回顾"运动合成与分解"矢量法则。尝试推导斜抛运动射程公式，并思考为何45度角射程最远。推荐做一道"平抛撞击斜面"的经典习题。'
    }
  }
];

export default function StardustPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [imageUrl, setImageUrl] = useState<string>(COSMIC_TEXTURE_URL);
  const [particleSettings, setParticleSettings] = useState<ParticleSettings>(DEFAULT_SETTINGS);
  const [showControls, setShowControls] = useState(false);
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES);
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>(PERSONAS[0]); // Default to Stargazer
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Session Timer
  const [durationSeconds, setDurationSeconds] = useState(0);

  // Audio Refs
  const musicAudioRef = useRef<HTMLAudioElement>(new Audio(DEMO_MUSIC_URL));

  // Gemini Live Hook
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null);
  const { connect, disconnect, isConnected, isConnecting, isSpeaking, transcript, history } = useGeminiLive(import.meta.env.VITE_GEMINI_API_KEY, (text) => { });

  // Audio Analysis for Visuals
  const audioLevel = useAudioAnalyzer(liveStream);

  // Format Duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Timer Effect
  useEffect(() => {
    let interval: number;
    if (isConnected) {
      interval = window.setInterval(() => {
        setDurationSeconds(prev => prev + 1);
      }, 1000);
    } else {
      // Stop timer when disconnected, but don't reset immediately if we are saving
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Update Music Volume dynamically
  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = particleSettings.musicVolume;
    }
  }, [particleSettings.musicVolume]);

  const toggleRecording = async () => {
    if (isConnecting) return; // Prevent double clicks

    if (isConnected) {
      disconnect();
      setLiveStream(null);
    } else {
      // Reset timer
      setDurationSeconds(0);

      // Auto-play music if not already playing
      if (!isPlayingMusic) {
        try {
          musicAudioRef.current.loop = true;
          musicAudioRef.current.volume = particleSettings.musicVolume;
          await musicAudioRef.current.play();
          setIsPlayingMusic(true);
        } catch (e) {
          console.error("Auto-play music failed", e);
        }
      }
      // Connect with specific Persona instructions
      const stream = await connect(selectedPersona.systemInstruction);
      if (stream) {
        setLiveStream(stream);
      }
    }
  };

  const handlePersonaSelect = (persona: AIPersona) => {
    setSelectedPersona(persona);
    setShowPersonaSelector(false);
    // If currently connected, we should disconnect so user can start fresh with new persona
    if (isConnected) {
      disconnect();
      setLiveStream(null);
    }
  };

  const toggleMusic = () => {
    if (isPlayingMusic) {
      musicAudioRef.current.pause();
    } else {
      musicAudioRef.current.loop = true;
      musicAudioRef.current.volume = particleSettings.musicVolume;
      musicAudioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
    setIsPlayingMusic(!isPlayingMusic);
  };

  const handleSaveMemory = async () => {
    // Capture final session details before disconnect
    const currentDuration = formatDuration(durationSeconds);

    // Construct conversation log
    const conversationLog = history.map(msg => `[${msg.role === 'user' ? 'Student' : 'Tutor'}]: ${msg.text}`).join('\n');
    // Add pending transcript if any
    let fullLog = conversationLog;
    if (transcript.user) fullLog += `\n[Student]: ${transcript.user}`;
    if (transcript.model) fullLog += `\n[Tutor]: ${transcript.model}`;

    if (!fullLog.trim()) {
      fullLog = "(No conversation detected)";
    }

    // Disconnect microphone and live session immediately
    if (isConnected) {
      await disconnect();
      setLiveStream(null);
    }

    setMode(AppMode.SAVING);
    try {
      // 检查API_KEY是否存在
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        // 如果GEMINI_API_KEY不存在，直接跳转到GALLERY模式，避免应用崩溃
        setTimeout(() => navigate('/app', { state: { view: 'gallery' } }), 1500);
        return;
      }
      const baseUrl = (import.meta as any).env.VITE_GEMINI_BASE_URL;
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY, baseUrl } as any);
      const model = "gemini-3-flash-preview";

      const prompt = `
          学生刚刚完成了一次关于万有引力和开普勒定律的费曼学习课程。
          导师角色: ${selectedPersona.name}

          --- 完整对话记录 (CONVERSATION LOG) ---
          ${fullLog}
          -------------------------------------
          
          1. 评估他们的表现 (0-100分), 基于上述对话记录:
             - 'formulaUnderstanding': 对 F=Gmm/r^2 和 R^3/T^2=k 的掌握。
             - 'logicRigor': 解释行星运动的逻辑严密性。
             - 'application': 应用到卫星速度/实例的能力。
          2. 提供 'advice': 一条具体的、可落地的后续学习建议（包含推荐的习题类型、复习重点或思维实验）。
          3. 生成 'title': 有创意的宇宙主题标题 (例如 "万有引力：真理的椭圆")。
          4. 生成 'content': 一段简短、诗意的总结 (严格使用简体中文, 最多50字)。

          返回严格的JSON格式。所有文字内容必须使用简体中文(Simplified Chinese)。
        `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              assessment: {
                type: Type.OBJECT,
                properties: {
                  formulaUnderstanding: { type: Type.NUMBER },
                  logicRigor: { type: Type.NUMBER },
                  application: { type: Type.NUMBER },
                  advice: { type: Type.STRING },
                }
              }
            }
          }
        }
      });

      const data = JSON.parse(response.text || "{}");

      const newMemory: Memory = {
        id: Date.now().toString(),
        chapter: '必修二第七章《万有引力》',
        date: new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
        title: data.title || "星际会话",
        content: data.content || "群星对齐，揭示了运动的法则...",
        duration: currentDuration,
        status: 'review_needed', // Default to review needed for new sessions
        assessment: data.assessment
      };

      // Redirect to Eureka Gallery with new memory
      setTimeout(() => navigate('/app', { state: { view: 'gallery', newMemory: newMemory } }), 1500);

    } catch (e) {
      console.error("Save failed", e);
      setMode(AppMode.CHAT);
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
      musicAudioRef.current.pause();
    };
  }, [disconnect]);

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden selection:bg-white/20">

      {/* Background Particle Layer */}
      <div className="absolute inset-0 z-0 opacity-100">
        <ParticleView
          imageUrl={imageUrl}
          audioLevel={audioLevel}
          settings={particleSettings}
        />
      </div>

      {/* Top Navigation */}
      <nav className="absolute top-0 left-0 w-full p-6 z-30 flex justify-between items-center text-xs tracking-[0.2em] font-light text-white/70 mix-blend-difference">
        <button
          onClick={() => navigate('/app')}
          className="font-serif italic text-lg tracking-normal flex items-center hover:text-white transition-colors"
        >
          <Orbit size={16} className="mr-2 text-blue-300" /> Stardust
        </button>
        {/* 
        <div className="hidden md:flex space-x-8">
          <span className="cursor-pointer hover:text-white transition-colors">学习宇宙</span>
          <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/app', { state: { view: 'gallery' } })}>知识结晶</span>
        </div>
        */}
        <div className="flex items-center space-x-4">
          <button onClick={toggleMusic}>
            {isPlayingMusic ? <Volume2 size={18} /> : <div className="w-[18px] h-[18px] border border-white/50 rounded-full flex items-center justify-center"><div className="w-[2px] h-full bg-white/50 rotate-45"></div></div>}
          </button>
          <Menu size={18} />
        </div>
      </nav>

      {/* Main Content Area */}
      <AnimatePresence>
        {mode === AppMode.CHAT && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-8"
          >
            {/* Status Pill & Persona Switcher */}
            <div className="w-full flex justify-center mt-16 pointer-events-auto relative">
              <div
                className={`
                        flex items-center space-x-3 px-2 py-1.5 rounded-full border transition-all duration-300
                        ${isConnected ? 'bg-blue-900/30 border-blue-500/50' : 'bg-black/30 border-white/10'}
                        backdrop-blur-md
                    `}
              >
                <div className="flex items-center space-x-2 px-2 border-r border-white/10 pr-3">
                  <div className={`w-2 h-2 rounded-full ${isConnecting ? 'bg-amber-400 animate-spin' :
                    isConnected ? 'bg-blue-500 animate-pulse' : 'bg-white/30'
                    }`}></div>
                  <span className={`text-xs tracking-wider ${isConnected ? 'text-blue-200' : 'text-white/50'}`}>
                    {isConnecting ? '正在呼叫...' :
                      isConnected ? (isSpeaking ? '导师讲解中' : '聆听中') : '离线'}
                  </span>
                </div>

                {/* Active Persona Display */}
                <button
                  onClick={() => !isConnected && setShowPersonaSelector(true)}
                  disabled={isConnected}
                  className={`flex items-center space-x-2 pl-1 pr-3 py-0.5 rounded-full transition-colors ${isConnected ? 'opacity-50 cursor-default' : 'hover:bg-white/10 cursor-pointer'}`}
                >
                  <selectedPersona.icon size={12} style={{ color: selectedPersona.color }} />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/80">
                    {selectedPersona.name}
                  </span>
                  {!isConnected && <ChevronRight size={10} className="text-white/30" />}
                </button>
              </div>
            </div>

            {/* Subtitle Overlay (Replaces the old text area) */}
            <SubtitleView
              userText={transcript.user}
              modelText={transcript.model}
              isModelSpeaking={isSpeaking}
            />

            {/* Bottom Controls */}
            <div className="w-full flex flex-col items-center space-y-8 pointer-events-auto mb-10">

              {/* Main Mic Button */}
              <button
                onClick={toggleRecording}
                disabled={isConnecting}
                className={`
                        w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-500 relative
                        ${isConnected
                    ? 'bg-white text-black border-transparent scale-110 shadow-[0_0_30px_rgba(100,200,255,0.4)]'
                    : 'bg-black/40 text-white border-white/20 hover:bg-white/10 hover:border-white/50'}
                    `}
                style={{
                  boxShadow: isConnected ? `0 0 30px ${selectedPersona.color}66` : undefined
                }}
              >
                {isConnecting ? (
                  <Loader2 size={24} className="animate-spin text-white/70" />
                ) : isConnected ? (
                  <div className="flex space-x-1 items-center h-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-1 bg-black animate-bounce" style={{ height: 10 + Math.random() * 10 + 'px', animationDelay: i * 0.1 + 's' }}></div>
                    ))}
                  </div>
                ) : (
                  <Mic size={24} />
                )}
              </button>

              {/* Secondary Actions */}
              <div className="flex items-center space-x-6">
                <div className="px-3 py-1 bg-black/40 border border-white/10 rounded-md text-xs font-mono text-white/50">
                  会话时长: {formatDuration(durationSeconds)}
                </div>

                <button
                  onClick={handleSaveMemory}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-900/40 to-transparent border border-blue-500/30 rounded-full hover:border-blue-400/80 hover:bg-blue-900/20 transition-all group"
                >
                  <span className="text-sm font-light text-blue-100/90 group-hover:text-white">结晶知识 (Save)</span>
                  <ChevronRight size={14} className="text-blue-200/50 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Settings Toggle */}
            <button
              onClick={() => setShowControls(!showControls)}
              className="absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all pointer-events-auto"
            >
              <Settings2 size={18} />
            </button>
          </motion.div>
        )}

        {/* Persona Selector Modal */}
        {showPersonaSelector && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50"
          >
            <PersonaSelector
              personas={PERSONAS}
              selectedPersona={selectedPersona}
              onSelect={handlePersonaSelect}
              onClose={() => setShowPersonaSelector(false)}
            />
          </motion.div>
        )}

        {/* Loading/Saving Screen */}
        {mode === AppMode.SAVING && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center"
          >
            <div className="w-20 h-20 relative">
              <div className="absolute inset-0 border-t-2 border-blue-400 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-2 border-purple-400 rounded-full animate-spin-reverse"></div>
            </div>
            <h2 className="text-xl font-serif italic text-white mt-8 animate-pulse tracking-widest">正在评估运动法则掌控程度...</h2>
            <p className="text-xs font-mono text-white/30 mt-2">计算评分中</p>
          </motion.div>
        )}

        {/* Controls Panel */}
        {showControls && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            className="absolute right-0 top-0 h-full z-50"
          >
            <ControlPanel
              settings={particleSettings}
              onChange={(k, v) => setParticleSettings(prev => ({ ...prev, [k]: v }))}
              onClose={() => setShowControls(false)}
            />
          </motion.div>
        )}

        {/* Gallery */}
        {mode === AppMode.GALLERY && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 z-50"
          >
            <MemoryGallery memories={memories} onClose={() => setMode(AppMode.CHAT)} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
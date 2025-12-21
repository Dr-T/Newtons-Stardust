import React, { useState, useEffect, useRef } from 'react';

// --- Icons (Inline SVGs to replace lucide-react and avoid runtime errors) ---

const IconWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {children}
  </svg>
);

const Atom = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <circle cx="12" cy="12" r="1" />
    <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
    <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
  </IconWrapper>
);

const Brain = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </IconWrapper>
);

const MessageSquare = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </IconWrapper>
);

const Target = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </IconWrapper>
);

const CheckCircle2 = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </IconWrapper>
);

const XCircle = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </IconWrapper>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <path d="m9 18 6-6-6-6" />
  </IconWrapper>
);

const BarChart3 = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </IconWrapper>
);

const Zap = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </IconWrapper>
);

const Send = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <line x1="22" x2="11" y1="2" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </IconWrapper>
);

const User = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </IconWrapper>
);


// --- Types & Mock Data ---

type ViewState = 'home' | 'chat' | 'practice' | 'dashboard';

interface Question {
  id: number;
  type: 'concept' | 'formula' | 'calculation';
  category: 'new' | 'review'; // 'new' (6) or 'review' (4)
  question: string;
  answer: string;
  options?: string[]; // For quick selection if needed
  placeholder: string;
  attempts: number;
  status: 'pending' | 'passed' | 'failed';
  feedback: string[]; // Specific feedback for errors
}

// Mock Data based on "化学公式学习.docx"
const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'concept',
    category: 'new',
    question: '请填写物质的量的定义：一定数目____的集合体。',
    answer: '微观粒子',
    placeholder: '请输入...',
    attempts: 0,
    status: 'pending',
    feedback: ['提示：不是具体的原子或分子，是统称。', '提示：包含原子、分子、离子等。']
  },
  {
    id: 2,
    type: 'calculation',
    category: 'new',
    question: '1mol氧气中约含有 ____ 个氧气分子。',
    answer: '6.02×10^23',
    placeholder: '科学计数法如 6.02×10^23',
    attempts: 0,
    status: 'pending',
    feedback: ['提示：这就是阿伏伽德罗常数的数值。', '提示：记住 6.02...']
  },
  {
    id: 3,
    type: 'formula',
    category: 'review', // "本学期曾经错过3次及以上"
    question: '气体摩尔体积计算公式：n = V / ____',
    answer: 'Vm',
    placeholder: '填写符号',
    attempts: 0,
    status: 'pending',
    feedback: ['提示：下标是m。', '提示：表示气体摩尔体积的符号。']
  },
  {
    id: 4,
    type: 'concept',
    category: 'new',
    question: '摩尔质量的单位是 ____ (请用中文填写)',
    answer: '克每摩尔',
    placeholder: '例如：千克每米',
    attempts: 0,
    status: 'pending',
    feedback: ['提示：质量(g)除以物质的量(mol)。', '提示：g/mol的中文读法。']
  }
];

// --- Components ---

// 1. Navigation & Layout
const Layout = ({ children, activeView, setView }: { children: React.ReactNode, activeView: ViewState, setView: (v: ViewState) => void }) => (
  <div className="flex flex-col h-screen bg-slate-950 text-white font-sans overflow-hidden">
    {/* Header */}
    <header className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Atom className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Eureka <span className="text-xs text-slate-400 font-normal tracking-wider">真理之眼</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs text-amber-400 font-bold">128 能量</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Xiaoming" alt="User" />
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="flex-1 overflow-y-auto relative">
      {children}
    </main>

    {/* Bottom Nav */}
    <nav className="h-16 bg-slate-900 border-t border-white/5 grid grid-cols-4 px-2">
      <NavButton active={activeView === 'home'} onClick={() => setView('home')} icon={Target} label="任务" />
      <NavButton active={activeView === 'practice'} onClick={() => setView('practice')} icon={Brain} label="修炼" />
      <NavButton active={activeView === 'chat'} onClick={() => setView('chat')} icon={MessageSquare} label="灵犀" />
      <NavButton active={activeView === 'dashboard'} onClick={() => setView('dashboard')} icon={BarChart3} label="大盘" />
    </nav>
  </div>
);

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${active ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
  >
    <Icon className={`w-5 h-5 ${active ? 'fill-cyan-400/20' : ''}`} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

// 2. Home View (Mission Control)
const HomeView = ({ onStartPractice }: { onStartPractice: () => void }) => {
  return (
    <div className="p-6 space-y-8">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-1">早安，小明</h2>
          <p className="text-slate-400 text-sm mb-6">根据艾宾浩斯曲线，今日你需要巩固 10 个知识点。</p>
          
          <div className="flex items-end gap-2 mb-6">
            <span className="text-5xl font-black text-white">4</span>
            <span className="text-lg text-slate-400 mb-1">/ 10 待通关</span>
          </div>

          <button 
            onClick={onStartPractice}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 fill-white" />
            开始今日充能
          </button>
        </div>
      </div>

      {/* Mission Breakdown */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">今日任务配比 (6+4模式)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-emerald-400 font-bold">新知巩固</span>
            </div>
            <div className="text-2xl font-bold text-white">6 <span className="text-sm text-slate-500 font-normal">个</span></div>
            <p className="text-xs text-slate-500 mt-1">近15天新学内容</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-rose-400"></div>
              <span className="text-rose-400 font-bold">高频错题</span>
            </div>
            <div className="text-2xl font-bold text-white">4 <span className="text-sm text-slate-500 font-normal">个</span></div>
            <p className="text-xs text-slate-500 mt-1">历史错误率 &gt; 3次</p>
          </div>
        </div>
      </div>
      
      {/* Recommended Context */}
      <div className="bg-slate-900/80 p-4 rounded-xl border-l-4 border-cyan-500">
        <h4 className="text-white font-bold text-sm mb-1">正在学习章节</h4>
        <p className="text-slate-400 text-xs">必修一 / 2.3 物质的量</p>
      </div>
    </div>
  );
};

// 3. Practice View (Core Logic Engine)
const PracticeView = ({ questions, setQuestions, goBack }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  // Fuzzy matching for demo purposes
  const checkAnswer = () => {
    // Simple normalization: remove spaces, lowercase
    const normalizedInput = inputValue.replace(/\s+/g, '').toLowerCase();
    const normalizedAnswer = currentQ.answer.replace(/\s+/g, '').toLowerCase();
    
    // In a real app, use Levenshtein distance or backend validation
    // For demo, we check simple inclusion or strict equality
    const isCorrect = normalizedInput === normalizedAnswer || normalizedInput.includes(normalizedAnswer);

    const newQuestions = [...questions];
    const q = newQuestions[currentIndex];

    if (isCorrect) {
      setFeedback('correct');
      // Logic from doc:
      // 1. 1st try correct -> Pass
      // 2. 1st fail, 2nd/3rd correct -> Pass
      if (q.attempts < 2) {
        q.status = 'passed';
      } else {
        // Logic: "错误前2次，正确第3次，视为不通关" -> It means they got it right eventually, but status is FAIL for the long term record.
        q.status = 'failed'; 
      }
    } else {
      setFeedback('wrong');
      q.attempts += 1;
      
      // Logic: "错误3次，视为不通关"
      if (q.attempts >= 3) {
        q.status = 'failed';
        setShowExplanation(true); // Force move on
      }
    }
    setQuestions(newQuestions);
  };

  const handleNext = () => {
    // If correct or failed out (3 attempts), move next
    if (feedback === 'correct' || currentQ.attempts >= 3) {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setInputValue('');
        setFeedback('idle');
        setShowExplanation(false);
      } else {
        // Finished all available questions
        setCurrentIndex(prev => prev + 1);
      }
    } else {
      // Retry same question
      setInputValue('');
      setFeedback('idle');
    }
  };

  if (isFinished) {
    const passedCount = questions.filter((q:any) => q.status === 'passed').length;
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-cyan-500/30">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">修炼完成</h2>
        <p className="text-slate-400 mb-8">今日通关率: {Math.round((passedCount/questions.length)*100)}%</p>
        <button onClick={goBack} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-bold transition-colors">
          返回主页
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-full">
          <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
        </button>
        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 transition-all duration-500"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          ></div>
        </div>
        <span className="text-xs text-slate-400 font-mono">{currentIndex + 1}/{questions.length}</span>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
        <div className="mb-2 flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded border ${currentQ.category === 'new' ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'}`}>
                {currentQ.category === 'new' ? '新知' : '高频错题'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded border border-slate-700 text-slate-400">
                {currentQ.type === 'concept' ? '概念记忆' : currentQ.type === 'formula' ? '公式拼写' : '数值计算'}
            </span>
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed mb-8">
            {currentQ.question.split('____').map((part, i, arr) => (
                <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                        <span className="inline-block min-w-[60px] border-b-2 border-cyan-500/50 mx-1"></span>
                    )}
                </React.Fragment>
            ))}
        </h2>

        {/* Input Area */}
        <div className="relative mb-6">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentQ.placeholder}
                disabled={feedback === 'correct'}
                className={`w-full bg-slate-800/50 border-2 ${feedback === 'wrong' ? 'border-rose-500' : feedback === 'correct' ? 'border-emerald-500' : 'border-slate-700 focus:border-cyan-500'} rounded-xl px-4 py-4 text-lg text-white placeholder-slate-500 outline-none transition-all`}
            />
            {feedback === 'correct' && (
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
            )}
            {feedback === 'wrong' && (
                <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500" />
            )}
        </div>

        {/* Feedback / Hint Area */}
        <div className="min-h-[60px] mb-6">
            {feedback === 'wrong' && currentQ.attempts < 3 && (
                <div className="flex items-start gap-2 text-rose-400 bg-rose-500/10 p-3 rounded-lg text-sm animate-pulse">
                    <Brain className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{currentQ.feedback[currentQ.attempts - 1] || '再试一次，注意审题。'}</p>
                </div>
            )}
            {currentQ.attempts >= 3 && feedback === 'wrong' && (
                <div className="text-slate-300 bg-slate-800 p-3 rounded-lg text-sm">
                    <p className="font-bold text-rose-400 mb-1">本题未通关</p>
                    <p>正确答案：<span className="text-emerald-400 font-mono select-all">{currentQ.answer}</span></p>
                </div>
            )}
            {feedback === 'correct' && (
                 <div className="text-emerald-400 bg-emerald-500/10 p-3 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <p>{currentQ.attempts === 0 ? '完美！一遍过！' : '不错，掌握了！'}</p>
                </div>
            )}
        </div>

        {/* Action Button */}
        <button
            onClick={feedback === 'correct' || currentQ.attempts >= 3 ? handleNext : checkAnswer}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                feedback === 'correct' || currentQ.attempts >= 3
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
            }`}
        >
            {feedback === 'correct' || currentQ.attempts >= 3 ? (currentIndex < questions.length - 1 ? '下一题' : '查看结果') : '提交答案'}
        </button>

        {/* Attempts Indicator logic from doc: "单日知识点作答次数限制：3次" */}
        <div className="mt-4 flex justify-center gap-1">
            {[1, 2, 3].map(i => (
                <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${
                        i <= currentQ.attempts 
                        ? 'bg-rose-500' 
                        : 'bg-slate-800'
                    }`}
                />
            ))}
        </div>
      </div>
    </div>
  );
};

// 4. Chat View (Socratic AI)
const ChatView = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: '你好小明！我是阿伏伽德罗。今天刚学了“物质的量”，有什么想问我的吗？' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsTyping(true);

        // Simple Rule-based response for Demo
        setTimeout(() => {
            let aiResponse = '';
            if (userMsg.includes('物质的量') && (userMsg.includes('什么') || userMsg.includes('定义'))) {
                aiResponse = '物质的量是化学中一个非常重要的基本概念，用来表示微观粒子（如原子、分子、离子等）的数量多少。它是国际单位制的七个基本物理量之一，符号为 n，单位是 摩尔（mol）。';
            } else if (userMsg.includes('用处') || userMsg.includes('为什么')) {
                aiResponse = '这就好比我们去买米。米粒太小了（就像原子），我们不会一颗颗数着买，而是论“斤”或者论“袋”买。摩尔就是微观世界里的那个“袋子”，它把看不见摸不着的微观粒子，和我们能称量的宏观质量（克）联系起来了。';
            } else if (userMsg.includes('公式')) {
                 aiResponse = '目前我们主要掌握核心公式：n = N/NA (粒子数相关) 和 n = m/M (质量相关)。你想试试推导吗？';
            } else {
                aiResponse = '这是个好问题。关于这个概念，你可以试着联想一下生活中“打一打铅笔”或者“一箱苹果”的概念。';
            }
            
            setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-slate-950">
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'ai' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                {m.role === 'ai' ? <Atom className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                                m.role === 'ai' 
                                ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' 
                                : 'bg-cyan-600 text-white rounded-tr-none'
                            }`}>
                                {m.content}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                         <div className="flex gap-3 max-w-[85%]">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                <Atom className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex gap-1">
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 bg-slate-900 border-t border-white/5">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="向阿伏伽德罗提问..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-3 text-white focus:border-cyan-500 outline-none placeholder-slate-500"
                    />
                    <button onClick={handleSend} className="w-12 h-12 bg-cyan-600 hover:bg-cyan-500 rounded-full flex items-center justify-center transition-colors">
                        <Send className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// 5. Dashboard View (Teacher Data Loop)
const DashboardView = () => {
    // Mock Data based on Doc
    const students = [
        { name: '小明', id: '001', errorRate: 60, status: 'warning', weakPoint: '气体摩尔体积' },
        { name: '张伟', id: '002', errorRate: 15, status: 'good', weakPoint: '-' },
        { name: '李华', id: '003', errorRate: 45, status: 'attention', weakPoint: '阿伏伽德罗常数' },
        { name: '韩梅梅', id: '004', errorRate: 80, status: 'warning', weakPoint: '物质的量浓度' },
    ];

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-cyan-500" />
                教师端 · 15天阶段报告
            </h2>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800 p-4 rounded-xl border border-white/5">
                    <p className="text-slate-400 text-xs mb-1">班级平均通关率</p>
                    <p className="text-2xl font-bold text-emerald-400">82%</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-white/5">
                    <p className="text-slate-400 text-xs mb-1">高频预警人数</p>
                    <p className="text-2xl font-bold text-rose-400">3 <span className="text-sm text-slate-500">人</span></p>
                </div>
            </div>

            {/* Student List */}
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-white/10">
                <div className="p-4 border-b border-white/10 bg-slate-800/50">
                    <h3 className="font-bold text-slate-300">学情预警名单</h3>
                </div>
                <div className="divide-y divide-white/5">
                    {students.map((s) => (
                        <div key={s.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${s.status === 'warning' ? 'bg-rose-500 animate-pulse' : s.status === 'attention' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                <div>
                                    <p className="text-white font-medium">{s.name}</p>
                                    <p className="text-xs text-slate-500">薄弱点: {s.weakPoint}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${s.errorRate >= 60 ? 'text-rose-400' : s.errorRate >= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {s.errorRate}%
                                </p>
                                <p className="text-[10px] text-slate-500">错误率</p>
                            </div>
                            {s.errorRate >= 60 && (
                                <button className="ml-2 px-3 py-1 bg-rose-500/20 text-rose-400 text-xs rounded border border-rose-500/30 hover:bg-rose-500/30">
                                    一键干预
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-4 p-4 bg-indigo-900/30 border border-indigo-500/30 rounded-xl">
                 <h4 className="text-indigo-300 text-sm font-bold mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4" /> 
                    AI 分析建议
                 </h4>
                 <p className="text-xs text-slate-400 leading-relaxed">
                    本周“气体摩尔体积” (2.2) 错误率偏高，建议在周五的习题课中重点安排关于“标准状况(STP)”条件限制的变式训练。
                 </p>
            </div>
        </div>
    );
};

// --- Main App Entry ---

export default function EurekaApp() {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);

  const handleStartPractice = () => {
    setActiveView('practice');
  };

  return (
    <Layout activeView={activeView} setView={setActiveView}>
      {activeView === 'home' && <HomeView onStartPractice={handleStartPractice} />}
      {activeView === 'practice' && <PracticeView questions={questions} setQuestions={setQuestions} goBack={() => setActiveView('home')} />}
      {activeView === 'chat' && <ChatView />}
      {activeView === 'dashboard' && <DashboardView />}
    </Layout>
  );
}
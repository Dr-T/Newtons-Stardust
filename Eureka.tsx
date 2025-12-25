import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MemoryGallery } from './components/MemoryGallery';
import { Memory } from './types';

// --- Icons (Imported from components/Icons) ---
import {
  Atom,
  Brain,
  MessageSquare,
  Target,
  CheckCircle2,
  XCircle,
  ChevronRight,
  BarChart3,
  Zap,
  Send,
  User,
  Library
} from './components/Icons';


// --- Types & Mock Data ---

type ViewState = 'home' | 'chat' | 'practice' | 'dashboard' | 'loading' | 'gallery';

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

// Mock Data based on "物理公式学习.docx"
const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'concept',
    category: 'new',
    question: '开普勒第一定律：所有行星绕太阳运动的轨道都是____，太阳处在椭圆的一个焦点上。',
    answer: '椭圆',
    placeholder: '请输入形状名称',
    attempts: 0,
    status: 'pending',
    feedback: ['提示：不是圆，是另一种几何形状。', '提示：行星轨道的主要特征。']
  },
  {
    id: 2,
    type: 'formula',
    category: 'new',
    question: '万有引力定律公式：F = G ____ / r²',
    answer: 'Mm',
    placeholder: '填写质量符号',
    attempts: 0,
    status: 'pending',
    feedback: ['提示：两个物体的质量乘积。', '提示：大M和小m。']
  },
  {
    id: 3,
    type: 'calculation',
    category: 'review',
    question: '若地球质量为M，半径为R，近地卫星的速度 v = √____',
    answer: 'GM/R',
    placeholder: '输入公式表达式',
    attempts: 0,
    status: 'pending',
    feedback: ['提示：万有引力提供向心力。', '提示：F=mv²/R。']
  },
  {
    id: 4,
    type: 'concept',
    category: 'new',
    question: '卡文迪许通过____实验测出了引力常量G的数值。',
    answer: '扭秤',
    placeholder: '请输入实验名称',
    attempts: 0,
    status: 'pending',
    feedback: ['提示：利用微小形变放大的原理。', '提示：一种精密的力学实验装置。']
  }
];

const MOCK_MEMORIES: Memory[] = [
  {
    id: 'mock-circular',
    chapter: '必修二第六章《圆周运动》',
    date: '10/24',
    title: '圆周运动：向心力的华尔兹',
    content: '绳子断裂的那一刻，石头选择了切线方向的自由。向心力不再是束缚，而是维持圆舞曲的必要张力。',
    duration: '08:45',
    status: 'review_needed',
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
    status: 'mastered',
    assessment: {
      formulaUnderstanding: 95,
      logicRigor: 90,
      application: 92,
      advice: '回顾"运动合成与分解"矢量法则。尝试推导斜抛运动射程公式，并思考为何45度角射程最远。推荐做一道"平抛撞击斜面"的经典习题。'
    }
  }
];

// --- Components ---

// 1. Navigation & Layout
const Layout = ({ children, activeView, setView, userRole, setUserRole }: {
  children: React.ReactNode,
  activeView: ViewState,
  setView: (v: ViewState) => void,
  userRole: 'student' | 'teacher',
  setUserRole: (r: 'student' | 'teacher') => void
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-md border-b border-white/10 z-[60] relative">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 hover:scale-105 transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-shadow">
            <Atom className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Eureka <span className="text-xs text-slate-400 font-normal tracking-wider group-hover:text-cyan-400 transition-colors ml-2">AI 认知伴侣</span>
          </span>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs text-amber-400 font-bold">128 能量</span>
          </div>

          {/* Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            >
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Xiaoming" alt="User" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-xs text-slate-500">切换身份</p>
                </div>
                <button
                  onClick={() => {
                    setUserRole('student');
                    if (activeView === 'dashboard') setView('home');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-800 flex items-center justify-between group"
                >
                  <span className={userRole === 'student' ? 'text-cyan-400 font-bold' : 'text-slate-300'}>学生版</span>
                  {userRole === 'student' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </button>
                <button
                  onClick={() => {
                    setUserRole('teacher');
                    setView('dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-800 flex items-center justify-between group"
                >
                  <span className={userRole === 'teacher' ? 'text-cyan-400 font-bold' : 'text-slate-300'}>教师版</span>
                  {userRole === 'teacher' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative" onClick={() => setIsMenuOpen(false)}>
        {children}
      </main>

      {/* Bottom Nav */}
      {userRole === 'student' && (
        <nav className="h-16 bg-slate-900 border-t border-white/5 grid grid-cols-3 px-2">
          <NavButton active={activeView === 'home'} onClick={() => setView('home')} icon={Target} label="任务" />
          <NavButton active={activeView === 'chat'} onClick={() => setView('chat')} icon={MessageSquare} label="灵犀" />
          <NavButton active={activeView === 'gallery'} onClick={() => setView('gallery')} icon={Library} label="结晶" />
        </nav>
      )}
    </div>
  );
};

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
const HomeView = ({ onStartPractice, onNavigate }: { onStartPractice: () => void, onNavigate: (path: string) => void }) => {
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
        <p className="text-slate-400 text-xs">必修二 / 第六章 万有引力与航天</p>
      </div>

      {/* Navigation Modules */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">探索更多</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('/lesson')}
            className="bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/30 hover:bg-indigo-900/50 transition-colors text-left group"
          >
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Atom className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="text-white font-bold text-sm">Sandbox AI Lab</div>
            <p className="text-xs text-slate-400 mt-1">互动式沙盒仿真课程</p>
          </button>
          <button
            onClick={() => onNavigate('/stardust')}
            className="bg-purple-900/30 p-4 rounded-xl border border-purple-500/30 hover:bg-purple-900/50 transition-colors text-left group"
          >
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-white font-bold text-sm">Stardust AI Mentor</div>
            <p className="text-xs text-slate-400 mt-1">沉浸式费曼学习伙伴</p>
          </button>
        </div>
      </div>
    </div>
  );
};

// 2a. Loading View (AI Generation)
const LoadingView = ({ onComplete }: { onComplete: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    '正在提取知识库',
    '交互场景生成中',
    '动态模型构建中',
    'AI导师已经就绪'
  ];

  useEffect(() => {
    // Total 8s, 4 steps -> 2s (2000ms) per step
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < steps.length) return prev + 1;
        return prev;
      });
    }, 2000);

    const totalTimer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(totalTimer);
    };
  }, []);

  return (
    <div className="h-full flex flex-col justify-center items-center bg-slate-950 px-8 relative overflow-hidden">
      {/* Background Ambient */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>

      <div className="w-20 h-20 relative mb-8 z-10">
        <div className="absolute inset-0 border-t-2 border-blue-400 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-2 border-purple-400 rounded-full animate-spin-reverse"></div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-10 relative z-10">
        <span>互动式仿真课程生成中...</span>
      </h2>

      <p className="text-slate-400 text-sm mb-8 relative z-10 -mt-6">
        由 AI Agent 根据测评薄弱点、教学知识库生成互动式深潜学习内容
      </p>

      <div className="space-y-6 relative z-10 pl-2">
        {steps.map((label, index) => {
          const status = index < activeStep ? 'done' : index === activeStep ? 'active' : 'pending';
          return (
            <div key={index} className="flex items-center gap-4 relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`absolute left-[11px] top-8 w-0.5 h-10 ${index < activeStep ? 'bg-emerald-500/50' : 'bg-slate-800'
                  }`}></div>
              )}

              {/* Icon Status */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-500 ${status === 'done' ? 'bg-emerald-500 border-emerald-500' :
                status === 'active' ? 'bg-cyan-500/20 border-cyan-400' :
                  'bg-slate-900 border-slate-700'
                }`}>
                {status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                {status === 'active' && <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>}
              </div>

              {/* Text */}
              <span className={`text-lg font-medium transition-colors duration-300 ${status === 'pending' ? 'text-slate-600' :
                status === 'active' ? 'text-cyan-400' : 'text-slate-300'
                }`}>
                {label} {status === 'active' && <span className="animate-pulse">...</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. Practice View (Core Logic Engine)
const PracticeView = ({ questions, setQuestions, goBack, onFinish }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleNext = () => {
    // Save current answer
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: inputValue }));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setInputValue(''); // Clear input for next question
    } else {
      setIsFinished(true); // Finish practice
    }
  };

  if (isFinished) {
    // Calculate results
    let correctCount = 0;
    const wrongQuestions: any[] = [];

    questions.forEach((q: Question) => {
      const userAnswer = userAnswers[q.id] || '';
      // Simple normalization
      const normalizedInput = userAnswer.replace(/\s+/g, '').toLowerCase();
      const normalizedAnswer = q.answer.replace(/\s+/g, '').toLowerCase();
      const isCorrect = normalizedInput === normalizedAnswer || normalizedInput.includes(normalizedAnswer);

      if (isCorrect) {
        correctCount++;
      } else {
        wrongQuestions.push({ ...q, userAnswer });
      }
    });

    return (
      <div className="h-full flex flex-col p-6 overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-wider">练习完成!</h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900/80 p-6 rounded-2xl flex flex-col items-center justify-center border border-white/5 shadow-xl">
            <span className="text-5xl font-black text-cyan-400 mb-2">{correctCount}</span>
            <span className="text-slate-400 text-sm">答对题数</span>
          </div>
          <div className="bg-slate-900/80 p-6 rounded-2xl flex flex-col items-center justify-center border border-white/5 shadow-xl">
            <span className="text-5xl font-black text-blue-500 mb-2">{questions.length}</span>
            <span className="text-slate-400 text-sm">总题数</span>
          </div>
        </div>

        {/* Wrong Answers Section */}
        {wrongQuestions.length > 0 && (
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">错题回顾 (点击进入深度学习)</h3>
            {wrongQuestions.map((q) => (
              <div key={q.id} className="bg-slate-800/50 rounded-xl p-5 border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                <h4 className="text-white font-bold text-lg mb-3">
                  {q.question.split('____').map((part: string, i: number, arr: string[]) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="inline-block min-w-[40px] border-b border-white/30 mx-1"></span>
                      )}
                    </React.Fragment>
                  ))}
                </h4>
                <div className="space-y-1">
                  <p className="text-emerald-400 font-medium text-sm">
                    正确答案: <span className="font-mono">{q.answer}</span>
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {q.feedback[0] || '请复习相关概念。'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {wrongQuestions.length === 0 && (
          <div className="mb-8 p-6 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-emerald-400 font-bold text-lg">全对！太棒了！</p>
            <p className="text-slate-400 text-xs mt-1">你的物理基础非常扎实。</p>
          </div>
        )}

        {/* Action Button */}
        {/* Action Bottom Sheet */}
        <div className="mt-auto pt-6 pb-2">
          <button
            onClick={onFinish}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white font-bold text-lg shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            前往互动仿真课程
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-xl mt-4 flex items-start gap-3">
            <Brain className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-200 leading-relaxed">
              由 AI Agent 根据测评薄弱点、教学知识库生成互动式深潜学习内容
            </p>
          </div>


        </div>
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
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <span className="text-xs text-slate-400 font-mono">{currentIndex + 1}/{questions.length}</span>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
        <div className="mb-4 flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded border ${currentQ.category === 'new' ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'}`}>
            {currentQ.category === 'new' ? '新知' : '高频错题'}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded border border-slate-700 text-slate-400">
            {currentQ.type === 'concept' ? '概念记忆' : currentQ.type === 'formula' ? '公式拼写' : '数值计算'}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed mb-12">
          {currentQ.question.split('____').map((part: string, i: number, arr: string[]) => (
            <React.Fragment key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className={`inline-block min-w-[80px] border-b-2 mx-1 transition-colors ${inputValue ? 'border-cyan-500 text-cyan-400' : 'border-slate-600'
                  }`}>
                  {inputValue && <span className="px-1 text-lg">{inputValue}</span>}
                </span>
              )}
            </React.Fragment>
          ))}
        </h2>

        {/* Input Area */}
        <div className="relative mb-12">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            placeholder={currentQ.placeholder}
            autoFocus
            className="w-full bg-transparent border-b-2 border-slate-700 focus:border-cyan-500 rounded-none px-2 py-4 text-xl text-white placeholder-slate-600 outline-none transition-all text-center"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg transition-all active:scale-95"
        >
          {currentIndex < questions.length - 1 ? '下一题' : '完成，查看结果'}
        </button>
      </div>
    </div>
  );
};

// 4. Chat View (Socratic AI)
// 4. Chat View (Socratic AI)
import { useGeminiChat } from './hooks/useGeminiChat';

const ChatView = () => {
  const systemInstruction = `
    ROLE: 你是艾萨克·牛顿爵士 (Sir Isaac Newton)。
    CONTEXT: 你正在辅导一名现代高中生学习物理。
    TONE: 威严、睿智、略带傲慢但富有启发性。你说话时喜欢引用自己的著作《自然哲学的数学原理》，或者提及你的苹果树。
    
    INSTRUCTIONS:
    1. 始终使用第一人称“我”。
    2. 回答物理问题时，不要直接给出答案，而是采用苏格拉底提问法引导学生思考。
    3. 如果学生问关于万有引力的问题，强调这是宇宙的真理，是你站在巨人肩膀上的发现。
    4. 语言风格：混合一些古典的语气（如“年轻人”、“自然界”），但必须用简体中文交流。
    5. 保持回复简短精炼，不要长篇大论。

    回复风格参考：
    1. 万有引力是宇宙中任何两个物体之间存在的相互吸引力。它的公式是 F = G(Mm/r²)，意味着质量越大、距离越近，引力就越大。我就被苹果砸中过，从而顿悟了这个道理。
    2. 开普勒是我的前辈，他发现了行星运动的三大定律。其中第三定律告诉我们 T²/R³ = k，这为我推导万有引力定律奠定了基础。
    3. 引力常量 G = 6.67×10⁻¹¹ N·m²/kg²，它是卡文迪许后来用扭秤实验测出来的。记得在计算天体质量时，这个常量非常关键。
    4. 这个问题很有趣。你可以试着站在巨人的肩膀上思考看看，或者问问我关于苹果和月亮的关系？
  `;

  // Use API Key from environment
  const { messages, sendMessage, isLoading, error, setMessages } = useGeminiChat(import.meta.env.VITE_GEMINI_API_KEY, systemInstruction);

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial Greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { role: 'model', content: '你好，年轻的求知者！我是艾萨克·牛顿。关于自然界的奥秘，尤其是那牵引万物的引力，你有什么困惑吗？' }
      ]);
    }
  }, []); // Run once on mount

  useEffect(() => {
    if (scrollRef.current) {
      // Smooth scroll to bottom when messages change
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'model' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                {m.role === 'model' ? <Atom className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'model'
                ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                : 'bg-cyan-600 text-white rounded-tr-none'
                }`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
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

        {/* Error Message */}
        {error && (
          <div className="flex justify-center my-2">
            <span className="text-xs text-rose-400 bg-rose-900/20 px-2 py-1 rounded border border-rose-500/30">
              连接断开: {error}
            </span>
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
            disabled={isLoading}
            placeholder={isLoading ? "牛顿正在思考..." : "向艾萨克·牛顿提问..."}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-3 text-white focus:border-cyan-500 outline-none placeholder-slate-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
          >
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
    { name: '小明', id: '001', errorRate: 60, status: 'warning', weakPoint: '黄金代换公式' },
    { name: '张伟', id: '002', errorRate: 15, status: 'good', weakPoint: '-' },
    { name: '李华', id: '003', errorRate: 45, status: 'attention', weakPoint: '近地/同步卫星判别' },
    { name: '韩梅梅', id: '004', errorRate: 80, status: 'warning', weakPoint: '第一宇宙速度推导' },
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
          本周“第一宇宙速度”错误率偏高，建议在周五的习题课中重点安排关于“轨道半径 vs 地球半径”区别的辨析训练。
        </p>
      </div>
    </div>
  );
};

// --- Main App Entry ---

// --- Main App Entry ---

export default function EurekaApp() {
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle routing state from other pages (e.g., Stardust)
  useEffect(() => {
    if (location.state) {
      const state = location.state as { view?: ViewState; newMemory?: Memory };

      if (state.view) {
        setActiveView(state.view);
      }

      if (state.newMemory) {
        setMemories(prev => {
          // Prevent duplicate addition if strict mode runs twice
          if (prev.some(m => m.id === state.newMemory!.id)) return prev;
          return [state.newMemory!, ...prev];
        });

        // Clear state to prevent re-adding on refresh (optional but good practice)
        // navigate(location.pathname, { replace: true, state: {} }); 
        // Note: Clearing state might reset view if we strictly rely on it, but here we set local state.
        // We'll leave it for now to ensure it persists during the immediate transition.
      }
    }
  }, [location.state]);

  const handleStartPractice = () => {
    setActiveView('practice');
  };

  return (
    <Layout activeView={activeView} setView={setActiveView} userRole={userRole} setUserRole={setUserRole}>
      {activeView === 'home' && <HomeView onStartPractice={handleStartPractice} onNavigate={navigate} />}
      {activeView === 'practice' && (
        <PracticeView
          questions={questions}
          setQuestions={setQuestions}
          goBack={() => setActiveView('home')}
          onFinish={() => setActiveView('loading')}
        />
      )}
      {activeView === 'loading' && <LoadingView onComplete={() => navigate('/lesson')} />}
      {activeView === 'chat' && <ChatView />}
      {activeView === 'dashboard' && <DashboardView />}
      {activeView === 'gallery' && <MemoryGallery memories={memories} onClose={() => setActiveView('home')} />}
    </Layout>
  );
}
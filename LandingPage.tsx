import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Atom, Brain, Target, MessageSquare, Zap, Play, Repeat, CheckCircle2, ChevronRight, User, Users, GraduationCap, Layers, BrainCircuit, MessageCircle, Microscope, Rocket, ArrowRight, BookOpen, Tablet, Bot, BarChart3, Phone, XCircle } from './components/Icons';



const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                setScrolled(scrollContainerRef.current.scrollTop > 50);
            }
        };
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => container?.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div ref={scrollContainerRef} className="h-screen overflow-y-auto bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[4s]"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
                {/* Simple Starfield using CSS */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150"></div>
            </div>

            {/* Header */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToTop}>
                        <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Atom className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Eureka <span className="font-normal text-slate-400 text-sm hidden md:inline-block ml-1">激发兴趣 · 培养习惯</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400 absolute left-1/2 -translate-x-1/2">
                        <a href="#problem" className="hover:text-white transition-colors">痛点</a>
                        <a href="#solution" className="hover:text-white transition-colors">解决方案</a>
                        <a href="#lesson" className="hover:text-white transition-colors">精品课例</a>
                        <a href="#companion" className="hover:text-white transition-colors">思维伙伴</a>
                        <a href="#tech" className="hover:text-white transition-colors">技术亮点</a>
                        <a href="#competitor" className="hover:text-white transition-colors">竞品分析</a>
                        <a href="#scenarios" className="hover:text-white transition-colors">商业前景</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/Dr-T/Eureka/blob/main/README.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden md:block"
                        >
                            文档
                        </a>
                        <button
                            onClick={() => navigate('/app')}
                            className="bg-white text-slate-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-cyan-50 transition-colors shadow-lg shadow-white/10"
                        >
                            启动演示
                        </button>
                    </div>
                </div>
            </header>


            {/* Hero Section */}
            <section className="relative pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
                        <Zap className="w-3 h-3" />
                        AI Native Learning
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 animate-fade-in-up delay-100 flex flex-col gap-1 md:gap-2 items-center">
                        <span>拒绝假懂，<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">拒绝死记。</span></span>
                        <span>让知识在孩子脑中<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-breathe">“活”</span>过来。</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
                        Eureka 是基于<b> 费曼学习法 </b>与 <b>Agentic UI</b> 的 <span className="text-white font-bold">AI 认知伴侣。</span><br />通过智能诊断、交互深潜和角色互换，构建从“假懂”到“真知”的认知闭环。
                    </p>
                    {/* Stats Row */}
                    <div className="mb-16 pt-4 grid grid-cols-3 gap-2 md:gap-12 animate-fade-in-up delay-300">
                        <div className="flex flex-col items-center">
                            <div className="text-3xl md:text-5xl font-bold text-white mb-2 font-mono">
                                4<span className="text-lg md:text-1xl ml-1 text-slate-500 font-sans">类</span>
                            </div>
                            <div className="text-sm md:text-base font-bold text-cyan-400 mb-1">交互模态</div>
                            <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider flex flex-col gap-1 opacity-80">
                                <span>眼：手写公式识别</span>
                                <span>手：AI 接管界面</span>
                                <span>耳：实时倾听语音</span>
                                <span>口：反讲追问探究</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center border-l border-white/5">
                            <div className="text-3xl md:text-5xl font-bold text-white mb-2 font-mono">
                                3<span className="text-lg md:text-1xl ml-1 text-slate-500 font-sans">大</span>
                            </div>
                            <div className="text-sm md:text-base font-bold text-indigo-400 mb-1">AI Agent</div>
                            <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider flex flex-col gap-1 opacity-80">
                                <span>测：诊断助教</span>
                                <span>教：GUI 导师</span>
                                <span>验：费曼小白</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center border-l border-white/5">
                            <div className="text-3xl md:text-5xl font-bold text-white mb-2 font-mono">
                                3<span className="text-lg md:text-1xl ml-1 text-slate-500 font-sans">种</span>
                            </div>
                            <div className="text-sm md:text-base font-bold text-purple-400 mb-1">科学学习法</div>
                            <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider flex flex-col gap-1 opacity-80">
                                <span>艾宾浩斯遗忘曲线</span>
                                <span>费曼学习法</span>
                                <span>认知负荷理论</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/app')}
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full font-bold text-lg shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 flex items-center gap-2">
                            <Zap className="w-5 h-5 fill-current" />
                            立即体验 Demo
                        </button>
                        <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold text-lg border border-slate-700 transition-all flex items-center gap-2">
                            <Play className="w-5 h-5" />
                            观看概念视频
                        </button>
                    </div>

                </div>

                {/* Star Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-full pointer-events-none opacity-40">
                    <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-spin-slow">
                        <circle cx="400" cy="400" r="300" fill="none" stroke="url(#gradient)" strokeWidth="1" strokeDasharray="4 8" />
                        <circle cx="400" cy="400" r="200" fill="none" stroke="url(#gradient)" strokeWidth="1" strokeDasharray="2 6" />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                                <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </section>

            {/* Pain Points */}
            <section id="problem" className="py-20 bg-slate-900/50 border-y border-white/5 scroll-mt-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">为什么现在的孩子学得这么累？</h2>
                        <p className="text-slate-400">传统的“填鸭式”教学，制造了大量的“认知泡沫”。</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Layers, title: "元认知错觉", desc: "以为听懂了，其实只是记住了符号排列。一做题就废，缺乏直觉模型。" },
                            { icon: BrainCircuit, title: "抽象概念断层", desc: "课本是二维静态的，而理科概念（如摩尔、场）是三维动态的，难以内化。" },
                            { icon: MessageCircle, title: "缺乏输出验证", desc: "没有“讲出来”的机会。只有被动输入，没有主动建构，知识留存率极低。" }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all group">
                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/10 transition-colors">
                                    <item.icon className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Eureka Loop */}
            <section id="solution" className="py-24 bg-slate-900/50 border-y border-white/5 relative scroll-mt-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Eureka 认知闭环</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            传统的学习是线性的，而 Eureka 是闭环的。<br />我们独创的“测-看-讲-评”四步认知法，让知识像晶体一样在脑海中生长。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/20 via-cyan-500/50 to-indigo-500/20 z-0"></div>

                        {[
                            {
                                icon: Target,
                                color: 'emerald',
                                title: '01 智能诊断',
                                sub: 'AI Radar',
                                desc: '基于 6+4 动态复习算法与艾宾浩斯曲线，精准捕捉“即将遗忘”的临界点。'
                            },
                            {
                                icon: Atom,
                                color: 'cyan',
                                title: '02 交互深潜',
                                sub: 'Agentic UI',
                                desc: 'AI 接管界面，拒绝枯燥文本，通过可视化探究，把抽象公式变成可操作的实验。'
                            },
                            {
                                icon: MessageSquare,
                                color: 'indigo',
                                title: '03 费曼反讲',
                                sub: 'Role Reversal',
                                desc: '角色互换，学生当老师，AI 演小白。只有教会 AI，才算真的懂了。'
                            },
                            {
                                icon: Brain,
                                color: 'purple',
                                title: '04 认知闭环',
                                sub: 'Memory Crystal',
                                desc: '构建知识图谱，生成记忆晶体。教师端可查看思维漏洞报告，实现数据闭环。'
                            }
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 group">
                                <div className={`w-24 h-24 mx-auto bg-slate-900 border-4 border-${item.color}-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transition-transform group-hover:scale-110 group-hover:border-${item.color}-500`}>
                                    <item.icon className={`w-10 h-10 text-${item.color}-500`} />
                                </div>
                                <div className="text-center px-4">
                                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                    <p className={`text-xs font-bold uppercase tracking-wider text-${item.color}-400 mb-3`}>{item.sub}</p>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Demos */}
            <section id="lesson" className="py-24 bg-slate-900/50 border-y border-white/5 relative scroll-mt-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">精品课例展示</h2>
                        <p className="text-slate-400">真正的 AI Native 体验。AI 不再只是对话框里的文字，它拥有“手”，能直接操作界面。</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Chemistry Card */}
                        <div
                            onClick={() => navigate('/lesson-chemistry')}
                            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 hover:border-cyan-500/50 transition-all cursor-pointer"
                        >
                            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=1000&auto=format&fit=crop')" }}></div>
                                <Microscope className="w-16 h-16 text-cyan-500 relative z-10" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xl font-bold text-white">微观探秘：1 mol 氧气</h3>
                                    <span className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/20">必修一</span>
                                </div>
                                <p className="text-slate-400 text-sm mb-4">利用宏微观可视切换与直观类比，解决“摩尔”概念抽象难懂的痛点。包含 AI 控场挑战。</p>
                                <button className="text-white font-bold text-sm flex items-center gap-1 group-hover:text-cyan-400 transition-colors">
                                    查看 Demo <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Physics Card */}
                        <div
                            onClick={() => navigate('/lesson')}
                            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 hover:border-indigo-500/50 transition-all cursor-pointer"
                        >
                            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop')" }}></div>
                                <Rocket className="w-16 h-16 text-indigo-500 relative z-10" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xl font-bold text-white">星际航行：万有引力</h3>
                                    <span className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20">必修二</span>
                                </div>
                                <p className="text-slate-400 text-sm mb-4">复刻牛顿大炮思想实验，通过模拟发射调整速度，直观理解宇宙速度与变轨原理。</p>
                                <button className="text-white font-bold text-sm flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                                    查看 Demo <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Personas */}
            <section id="companion" className="py-24 bg-slate-900/50 border-y border-white/5 relative scroll-mt-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6">
                                <User className="w-3 h-3" />
                                Multi-Persona AI
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                不是冰冷的机器，<br />而是有温度的<span className="text-amber-400">思维伙伴</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                Eureka 搭载了具有鲜明性格的 AI 导师矩阵。从严谨的逻辑狂人，到务实的航天指挥官，不同的思维视角碰撞出真理的火花。
                            </p>

                            <div className="space-y-4">
                                {[
                                    { name: "中世纪观星者", role: "怀疑论者", desc: "只相信完美的圆，需要你用椭圆理论说服他。", color: "rose" },
                                    { name: "牛顿崇拜者", role: "逻辑狂人", desc: "痴迷于数学推导，不接受任何凭空想象的结论。", color: "amber" },
                                    { name: "航天指挥官", role: "实践派", desc: "关注变轨计算与燃料损耗，一切为了任务成功。", color: "cyan" }
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:bg-slate-800 transition-colors group/card">
                                        <div className={`w-12 h-12 rounded-full bg-${p.color}-500/20 flex items-center justify-center border border-${p.color}-500/30`}>
                                            <span className={`text-${p.color}-400 font-bold text-lg`}>{p.name[0]}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white">{p.name} <span className="text-xs font-normal text-slate-500 px-2 py-0.5 rounded bg-white/5 ml-2">{p.role}</span></h4>
                                            <p className="text-sm text-slate-400">{p.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => navigate('/stardust')}
                                            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-500 transition-all"
                                            title="拨打语音通话"
                                        >
                                            <Phone className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-amber-500/10 rounded-full blur-[80px]"></div>
                            {/* Mock Interface showing Chat Context */}
                            <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700">
                                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">N</div>
                                    <div>
                                        <div className="text-sm font-bold text-white">牛顿崇拜者</div>
                                        <div className="text-xs text-amber-400">正在与你进行苏格拉底式对话...</div>
                                    </div>
                                </div>
                                <div className="space-y-4 mb-6">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 shrink-0"></div>
                                        <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none text-sm text-slate-300 w-3/4">
                                            所以开普勒第二定律意味着行星在近日点跑得更快？
                                        </div>
                                    </div>
                                    <div className="flex gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-full bg-amber-600 shrink-0"></div>
                                        <div className="bg-amber-900/30 border border-amber-500/30 p-3 rounded-2xl rounded-tr-none text-sm text-amber-200">
                                            不仅仅是“更快”。你想想，如果扫过的面积要相等，当距离半径变短时，弧长必须如何变化才能补偿面积的损失？试着写出数学关系。
                                        </div>
                                    </div>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full w-full overflow-hidden">
                                    <div className="h-full bg-amber-500 w-2/3"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Highlights */}
            <section id="tech" className="py-24 bg-slate-900/50 border-t border-white/5 scroll-mt-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">技术创新亮点</h2>
                        <p className="text-slate-400 max-w-2xl">这不只是另一个 Chatbot，而是集成了 Agentic Control 与认知科学的下一代教育系统。</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Agentic UI */}
                        <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all group h-full flex flex-col">
                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 transition-colors">
                                <Zap className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Agentic UI (AI 控场)</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                                传统的 AI 只能“说话”，我们的 Agent 拥有“手”。通过 <strong>Tool Calling</strong> 协议，AI 能够直接操作 React 组件状态，实时调整实验参数、拖动滑块、遮挡答案，实现 GUI 级别的深度教学干预。
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                <span className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-500">Function Calling</span>
                                <span className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-500">React State Control</span>
                            </div>
                        </div>

                        {/* Multi-Agent Collaboration */}
                        <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition-all group h-full flex flex-col">
                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/10 transition-colors">
                                <Users className="w-6 h-6 text-slate-400 group-hover:text-purple-400 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">多 Agent 协作网络</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                                不再是单打独斗。<strong>“诊断助教”</strong>负责挖掘艾宾浩斯数据，<strong>“苏格拉底导师”</strong>负责启发式提问，<strong>“费曼小白”</strong>负责模拟学生进行反向测试。多角色协同，还原真实的 1vN 教学场。
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                <span className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-500">Role-Playing</span>
                                <span className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-500">Collaborative Swarm</span>
                            </div>
                        </div>

                        {/* Learning Science Matrix */}
                        <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition-all group h-full flex flex-col">
                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/10 transition-colors">
                                <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-amber-400 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">科学学习法矩阵</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                                每一个功能点都有坚实的心理学支撑：利用<strong>艾宾浩斯曲线</strong>确定复习时机，利用<strong>费曼技巧</strong>解决元认知错觉，利用<strong>认知负荷理论</strong>设计可视化模型。不做技术堆砌，只做有效教育。
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                <span className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-500">Metacognition</span>
                                <span className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-500">Scaffolding</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Competitive Landscape */}
            <section id="competitor" className="py-24 bg-slate-900/50 border-t border-white/5 scroll-mt-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            竞品分析
                        </h2>
                        <p className="text-slate-400">Eureka 不做“题海战术”的搬运工，也不做“从零开始”的讲课老师。Eureka 专注做 <span className="text-transparent bg-clip-text bg-gradient-to-r text-white">“课后到考前”</span>的那一公里</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 items-stretch">
                        {/* Left: What We Are Good At */}
                        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-3xl p-8 flex flex-col">
                            <h3 className="text-cyan-400 text-xl font-bold mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-6 h-6" />
                                Eureka 擅长
                            </h3>
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h4 className="text-white text-lg font-bold mb-2">破解“元认知错觉”</h4>
                                    <p className="text-slate-400">学生自以为懂了，但反讲卡壳。Eureka 立刻捕捉逻辑断点，判定“未掌握”。</p>
                                </div>
                                <div>
                                    <h4 className="text-white text-lg font-bold mb-2">抽象概念“可视化”</h4>
                                    <p className="text-slate-400">擅用直觉，用微观粒子容器讲“1mol 氧气”、用模拟发射卫星讲“万有引力”。</p>
                                </div>
                                <div>
                                    <h4 className="text-white text-lg font-bold mb-2">精准的“防遗忘”管理</h4>
                                    <p className="text-slate-400">拒绝题海战术。基于 6+4 策略与艾宾浩斯曲线，只推“马上要忘”的那道题。</p>
                                </div>
                                <div>
                                    <h4 className="text-white text-lg font-bold mb-2">极强的情绪价值</h4>
                                    <p className="text-slate-400">AI 可以是“笨蛋小白”也可以是“严谨牛顿”，利用胜负欲与表现欲驱动学习。</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: What We Are NOT Good At */}
                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-8 flex flex-col">
                            <h3 className="text-rose-400 text-xl font-bold mb-6 flex items-center gap-2">
                                <XCircle className="w-6 h-6" />
                                Eureka 不擅长
                            </h3>
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h4 className="text-slate-300 text-lg font-bold mb-2">零基础系统授课</h4>
                                    <p className="text-slate-400 mb-2">Eureka 不擅长从0到1的知识讲授，若无概念雏形，费曼反讲会受挫。</p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-sm">
                                        <ArrowRight className="w-4 h-4" />
                                        推荐：<strong className="text-slate-300">学而思网校</strong>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-slate-300 text-lg font-bold mb-2">海量刷题与搜题</h4>
                                    <p className="text-slate-400 mb-3">Eureka 不擅长高强度的题量与速度训练，不提供直接的答案搜索。</p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-sm">
                                        <ArrowRight className="w-4 h-4" />
                                        推荐：<strong className="text-slate-300">猿题库、作业帮</strong>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-slate-300 text-lg font-bold mb-2">文科主观题批改</h4>
                                    <p className="text-slate-400 mb-2">Eureka 专精于理科逻辑链，暂不覆盖作文/政治等主观题。</p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-sm">
                                        <ArrowRight className="w-4 h-4" />
                                        推荐：<strong className="text-slate-300">批改网、阅卷星</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Business Scenarios */}
            <section id="scenarios" className="py-24 bg-slate-950 border-t border-white/5 scroll-mt-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">商业应用前景</h2>
                        <p className="text-slate-400">打通课内与课外，覆盖教与学的全链路。</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">

                        {/* To C Scenario */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-cyan-500/20 transition-all"></div>

                            <div className="flex-1 space-y-6">
                                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center">
                                    <Tablet className="w-7 h-7 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">To C：学习机杀手级应用</h3>
                                    <div className="h-1 w-12 bg-cyan-500 rounded mb-4"></div>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                        可嵌入<strong>好未来学习机</strong>，利用硬件优势（手写笔、摄像头）实现<strong>多模态费曼反讲</strong>。学生在屏幕上画图，AI 识别轨迹并给予反馈（“哦！原来你是这个意思”），建立极强的情绪价值与陪伴感。
                                    </p>
                                    <ul className="space-y-2 text-sm text-slate-300">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div> 个性化认知伴侣</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div> 极强的情绪价值与粘性</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="w-full md:w-48 h-64 bg-slate-800 rounded-2xl border border-slate-700 relative overflow-hidden flex items-center justify-center shadow-xl">
                                {/* Mockup UI */}
                                <div className="absolute inset-2 bg-slate-900 rounded-xl flex flex-col p-2">
                                    <div className="flex-1 bg-slate-800 rounded-lg mb-2 relative overflow-hidden">
                                        <Bot className="absolute bottom-2 right-2 w-8 h-8 text-white opacity-20" />
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded w-2/3 mb-1"></div>
                                    <div className="h-2 bg-slate-800 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>

                        {/* To B Scenario */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-indigo-500/20 transition-all"></div>

                            <div className="flex-1 space-y-6">
                                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center">
                                    <BarChart3 className="w-7 h-7 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">To B：精准教学驾驶舱</h3>
                                    <div className="h-1 w-12 bg-indigo-500 rounded mb-4"></div>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                        不只是看分数，更看懂“思维漏洞”。为教师提供可视化的<strong>学情归因分析</strong>。从“全班知识热力图”中一键定位共性薄弱点，实现数据驱动的精准教研。
                                    </p>
                                    <ul className="space-y-2 text-sm text-slate-300">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> 认知断点可视化</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> 减负增效，精准干预</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="w-full md:w-48 h-64 bg-slate-800 rounded-2xl border border-slate-700 relative overflow-hidden flex items-center justify-center shadow-xl">
                                {/* Mockup Chart */}
                                <div className="absolute inset-4 flex items-end gap-2 px-2 pb-2">
                                    <div className="w-1/4 bg-indigo-500/30 h-[40%] rounded-t"></div>
                                    <div className="w-1/4 bg-indigo-500/60 h-[70%] rounded-t"></div>
                                    <div className="w-1/4 bg-indigo-500 h-[50%] rounded-t"></div>
                                    <div className="w-1/4 bg-indigo-400 h-[80%] rounded-t"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-slate-950 border-t border-white/5 text-center">
                <div className="flex items-center justify-center gap-2 mb-6 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <Atom className="w-6 h-6 text-cyan-500" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Eureka
                    </span>
                </div>
                <p className="text-slate-500 text-sm mb-6">好未来 AI 大赛参赛项目 · 致力于让 AI 更有温度</p>
                <div className="text-slate-600 text-xs">
                    © 2025 Eureka Team. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

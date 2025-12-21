import React, { useState, useEffect, useRef } from 'react';

// --- Inline Icons ---

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

const Telescope = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.536a.934.934 0 0 1 .702-1.108l6.18-1.318a.934.934 0 0 1 1.108.702l.537 2.536a.934.934 0 0 1-.702 1.108Z" />
    <path d="m13.482 16.15 6.18-1.318a.934.934 0 0 0 .702-1.108l-.537-2.536a.934.934 0 0 0-1.108-.702l-6.18 1.318" />
    <path d="M14.5 16.5 3 21" />
  </IconWrapper>
);

const Planet = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 2v20" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12a15.3 15.3 0 0 1 10-4 15.3 15.3 0 0 1 10 4 15.3 15.3 0 0 1-10 4 15.3 15.3 0 0 1-10-4z" />
  </IconWrapper>
);

const Rocket = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </IconWrapper>
);

const ArrowLeft = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </IconWrapper>
);

const Bot = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <rect width="18" height="10" x="3" y="11" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" x2="8" y1="16" y2="16" />
    <line x1="16" x2="16" y1="16" y2="16" />
  </IconWrapper>
);

const Ruler = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
    <path d="m14.5 12.5 2-2" />
    <path d="m11.5 9.5 2-2" />
    <path d="m8.5 6.5 2-2" />
    <path d="m17.5 15.5 2-2" />
  </IconWrapper>
);

const Play = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </IconWrapper>
);

const Pause = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </IconWrapper>
);

const RotateCcw = ({ className }: { className?: string }) => (
  <IconWrapper className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </IconWrapper>
);

// --- Types & Physics Constants ---

// Simplified Physics Scale
// Earth Radius = 100 units (6400 km)
const R_EARTH = 100; 
// First Cosmic Velocity = 7.9 km/s. In our scale, let's map 7.9 to 5.
const V1 = 5; 
// Second Cosmic Velocity = 11.2 km/s.
const V2 = V1 * Math.sqrt(2); 

type SimulationState = 'idle' | 'running' | 'crashed' | 'escaped';

// --- Main Page Component ---
export default function GravityOrbitLesson() {
  // State
  const [velocity, setVelocity] = useState(0); // km/s (mapped)
  const [simState, setSimState] = useState<SimulationState>('idle');
  
  // Agent State
  const [isAiControlling, setIsAiControlling] = useState(false);
  const [aiMessage, setAiMessage] = useState("准备好了吗？让我们看看多快才能飞出地球！");
  const [challengeMode, setChallengeMode] = useState(false);
  
  // Animation Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const satellitePos = useRef({ x: 0, y: -R_EARTH }); // Start at North Pole equivalent relative to center
  const angleRef = useRef(0);
  const pathRef = useRef<{x: number, y: number}[]>([]);

  // --- Physics Engine (Simplified) ---
  const updatePhysics = () => {
    if (simState !== 'running') return;

    // Real-time speed relative to V1
    // If v < 7.9, spiral in or ellipse that intersects earth
    // If v = 7.9, circle
    // If 7.9 < v < 11.2, ellipse
    // If v >= 11.2, hyperbola/escape

    // Simplified Animation Logic for Demo Visualization
    // We are animating based on "Launch Speed"
    const speedRatio = velocity / 7.9;
    
    let newAngle = angleRef.current;
    let newRadius = R_EARTH;
    
    // Angular velocity w = v / r (simplified for circular start)
    const angularVelocity = (speedRatio * 0.05); 

    if (velocity < 7.9) {
      // Crash Logic: Radius decreases
      newAngle -= angularVelocity;
      // Decay radius to simulate falling
      const decay = (7.9 - velocity) * 0.5;
      satellitePos.current.y += decay; // Move towards center roughly
      satellitePos.current.x = Math.sin(newAngle) * (Math.abs(satellitePos.current.y));
      // Simple crash check
      const dist = Math.sqrt(satellitePos.current.x**2 + satellitePos.current.y**2);
      if (dist < R_EARTH) {
        setSimState('crashed');
        setAiMessage("哎呀！速度太慢，卫星被万有引力拽回地球了！(v < 7.9 km/s)");
        cancelAnimationFrame(requestRef.current!);
        return;
      }
    } else if (Math.abs(velocity - 7.9) < 0.1) {
      // Circular Orbit
      newAngle -= angularVelocity;
      satellitePos.current.x = Math.cos(newAngle - Math.PI/2) * (R_EARTH + 20); // +20 for altitude
      satellitePos.current.y = Math.sin(newAngle - Math.PI/2) * (R_EARTH + 20);
    } else if (velocity < 11.2) {
      // Elliptical Orbit
      newAngle -= angularVelocity * (1 + 0.5 * Math.cos(newAngle)); // Keplers 2nd Law simulation (faster at perigee)
      // Ellipse logic approximation
      const eccentricity = (velocity - 7.9) / 5;
      const r = (R_EARTH + 20) * (1 + eccentricity) / (1 + eccentricity * Math.cos(newAngle - Math.PI/2));
      satellitePos.current.x = Math.cos(newAngle - Math.PI/2) * r;
      satellitePos.current.y = Math.sin(newAngle - Math.PI/2) * r;
    } else {
      // Escape
      newAngle -= angularVelocity;
      satellitePos.current.x += (satellitePos.current.x > 0 ? 2 : -2) * speedRatio;
      satellitePos.current.y -= 2 * speedRatio;
       const dist = Math.sqrt(satellitePos.current.x**2 + satellitePos.current.y**2);
       if (dist > 400) { // Screen bounds
         setSimState('escaped');
         setAiMessage("成功逃逸！它将飞向太阳系深处！(v ≥ 11.2 km/s)");
         cancelAnimationFrame(requestRef.current!);
         return;
       }
    }

    angleRef.current = newAngle;
    pathRef.current.push({ ...satellitePos.current });
    if (pathRef.current.length > 100) pathRef.current.shift(); // Trail limit

    draw();
    requestRef.current = requestAnimationFrame(updatePhysics);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Draw Earth
    const grad = ctx.createRadialGradient(cx, cy, R_EARTH * 0.3, cx, cy, R_EARTH);
    grad.addColorStop(0, '#3b82f6');
    grad.addColorStop(1, '#1e3a8a');
    ctx.beginPath();
    ctx.arc(cx, cy, R_EARTH, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Atmosphere/Gravity Well Hint
    ctx.beginPath();
    ctx.arc(cx, cy, R_EARTH + 40, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.stroke();

    // Draw Trail
    ctx.beginPath();
    pathRef.current.forEach((p, i) => {
        const alpha = i / pathRef.current.length;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        if (i === 0) ctx.moveTo(cx + p.x, cy + p.y);
        else ctx.lineTo(cx + p.x, cy + p.y);
    });
    ctx.stroke();

    // Draw Satellite
    // If idle, draw at launch pad (North Pole)
    let sx = cx, sy = cy - R_EARTH; 
    if (simState !== 'idle') {
        sx = cx + satellitePos.current.x;
        sy = cy + satellitePos.current.y;
    }
    
    ctx.save();
    ctx.translate(sx, sy);
    // Rotate satellite to face movement direction roughly
    if (simState === 'running') {
        // ctx.rotate(angleRef.current);
    }
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#f59e0b';
    ctx.restore();
  };

  useEffect(() => {
    draw(); // Initial draw
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  useEffect(() => {
    if (simState === 'running') {
      requestRef.current = requestAnimationFrame(updatePhysics);
    }
    return () => cancelAnimationFrame(requestRef.current!);
  }, [simState, velocity]);


  // --- Controls ---
  const launch = () => {
    if (velocity <= 0) {
        setAiMessage("速度是 0 怎么飞？加油门啊！");
        return;
    }
    setSimState('running');
    // Reset pos for new launch
    satellitePos.current = { x: 0, y: -(R_EARTH + 20) };
    angleRef.current = 0;
    pathRef.current = [];
    
    if (velocity < 7.9) setAiMessage("发射！... 感觉速度不够啊...");
    else if (velocity < 11.2) setAiMessage("发射！进入环绕轨道！");
    else setAiMessage("发射！全速前进，脱离地球！");
  };

  const reset = () => {
    setSimState('idle');
    pathRef.current = [];
    satellitePos.current = { x: 0, y: -(R_EARTH + 20) };
    draw();
    setAiMessage("准备就绪。请设定发射速度。");
  };

  // --- Agent Logic ---
  const startChallenge = () => {
    setIsAiControlling(true);
    setChallengeMode(true);
    reset();
    setAiMessage("我要考考你：请把速度调整到“第一宇宙速度”，让卫星既不掉下来，也不飞走。");
    
    // AI moves slider to random wrong position first
    setTimeout(() => {
        setVelocity(4.5); 
        setIsAiControlling(false);
    }, 500);
  };

  const checkAnswer = () => {
      if (Math.abs(velocity - 7.9) < 0.2) {
          setAiMessage("太棒了！7.9 km/s 正是第一宇宙速度。完美入轨！");
          launch();
          setTimeout(() => setChallengeMode(false), 3000);
      } else if (velocity < 7.9) {
          setAiMessage("太慢了！这会变成“高空抛物”的。再快点！");
          launch();
      } else {
          setAiMessage("太快了！我们要环绕地球，不是去火星。慢一点！");
          launch();
      }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-400" />
                </button>
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                    星际航行：万有引力
                </h1>
            </div>
            <div className="text-xs text-slate-400 border border-slate-700 px-3 py-1 rounded-full">
                必修二 / 第三章 天体运动
            </div>
        </header>

        <main className="max-w-4xl mx-auto p-6 space-y-12">

            {/* Section 1: The Hook */}
            <section className="text-center space-y-4 pt-8">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                    卫星为什么不会掉下来？
                </h2>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                    300年前，牛顿在山上架起了一门大炮。<br/>
                    他发现，只要炮弹飞得<span className="text-amber-400 font-bold">足够快</span>，地球就永远抓不住它。
                </p>
            </section>

            {/* Section 2: Interactive Simulation (Newton's Cannon) */}
            <section className="relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col md:flex-row">
                
                {/* Visual Area */}
                <div className="relative flex-1 h-[400px] md:h-[500px] bg-slate-950">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
                    <canvas 
                        ref={canvasRef} 
                        width={600} 
                        height={500} 
                        className="absolute inset-0 w-full h-full"
                    />
                    
                    {/* Status HUD */}
                    <div className="absolute top-4 left-4 space-y-2">
                         <div className="bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
                            状态: <span className={`font-bold ${simState === 'running' ? 'text-emerald-400' : simState === 'crashed' ? 'text-rose-400' : 'text-slate-400'}`}>
                                {simState === 'idle' ? '准备发射' : simState === 'running' ? '飞行中' : simState === 'crashed' ? '坠毁' : '逃逸'}
                            </span>
                         </div>
                         <div className="bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
                            F引: <span className="font-mono text-amber-400">GMm/r²</span>
                         </div>
                    </div>
                </div>

                {/* Control Panel */}
                <div className="w-full md:w-80 bg-slate-800/50 backdrop-blur border-l border-slate-700 p-6 flex flex-col gap-6 relative">
                    
                    {/* Agent Bubble */}
                    <div className="flex items-start gap-3">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${isAiControlling ? 'bg-amber-500 animate-bounce' : 'bg-indigo-600'}`}>
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div className="bg-slate-700/50 p-3 rounded-xl rounded-tl-none text-sm text-slate-200 border border-slate-600">
                            {aiMessage}
                        </div>
                    </div>

                    {/* Slider Control */}
                    <div className="space-y-4 mt-auto">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                <Rocket className="w-4 h-4" /> 发射速度 (v)
                            </span>
                            <span className="text-2xl font-mono font-bold text-white">
                                {velocity.toFixed(1)} <span className="text-sm text-slate-500">km/s</span>
                            </span>
                        </div>
                        
                        <div className="relative pt-6">
                            {/* Ruler Marks */}
                            <div className="absolute top-0 left-0 right-0 flex justify-between text-[10px] text-slate-500 font-mono px-1">
                                <span>0</span>
                                <span className="text-emerald-400 font-bold">7.9</span>
                                <span className="text-amber-400 font-bold">11.2</span>
                                <span>16.7</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="13" 
                                step="0.1" 
                                value={velocity}
                                onChange={(e) => setVelocity(parseFloat(e.target.value))}
                                disabled={simState === 'running' || isAiControlling}
                                className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all ${isAiControlling ? 'accent-amber-500' : ''}`}
                            />
                            {/* Key Velocity Markers on Slider Track */}
                            <div className="absolute top-7 left-[60.7%] w-0.5 h-3 bg-emerald-500/50 -translate-x-1/2" title="第一宇宙速度"></div>
                            <div className="absolute top-7 left-[86.1%] w-0.5 h-3 bg-amber-500/50 -translate-x-1/2" title="第二宇宙速度"></div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        {challengeMode ? (
                             <button 
                                onClick={checkAnswer}
                                disabled={simState === 'running'}
                                className="col-span-2 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                确认发射
                            </button>
                        ) : (
                            <>
                                <button 
                                    onClick={simState === 'running' ? reset : launch}
                                    className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${simState === 'running' ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'}`}
                                >
                                    {simState === 'running' ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                                    {simState === 'running' ? '重置' : '发射'}
                                </button>
                                <button 
                                    onClick={startChallenge}
                                    className="py-3 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-500/30 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                >
                                    <Bot className="w-4 h-4" />
                                    考考我
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Section 3: Theory & Formulas */}
            <section className="grid md:grid-cols-2 gap-8 items-start">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
                    <div className="flex items-center gap-2 text-indigo-400">
                        <Telescope className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-wider text-sm">宇宙速度阶梯</span>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors border-l-4 border-emerald-500">
                            <div className="text-2xl font-black text-white w-12 text-center">v₁</div>
                            <div>
                                <div className="text-emerald-400 font-bold">7.9 km/s</div>
                                <div className="text-xs text-slate-400">第一宇宙速度 (环绕速度)</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors border-l-4 border-amber-500">
                            <div className="text-2xl font-black text-white w-12 text-center">v₂</div>
                            <div>
                                <div className="text-amber-400 font-bold">11.2 km/s</div>
                                <div className="text-xs text-slate-400">第二宇宙速度 (脱离速度)</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors border-l-4 border-rose-500">
                            <div className="text-2xl font-black text-white w-12 text-center">v₃</div>
                            <div>
                                <div className="text-rose-400 font-bold">16.7 km/s</div>
                                <div className="text-xs text-slate-400">第三宇宙速度 (逃逸速度)</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
                    <div className="flex items-center gap-2 text-indigo-400">
                        <Ruler className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-wider text-sm">核心公式推导</span>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                            <p className="text-xs text-slate-500 mb-2">万有引力提供向心力</p>
                            <div className="flex items-center justify-center text-lg md:text-xl font-mono text-white">
                                G<span className="frac mx-1">Mm<span className="symbol">/</span>r²</span> = m<span className="frac mx-1">v²<span className="symbol">/</span>r</span>
                            </div>
                        </div>
                        
                        <div className="text-center text-slate-500 text-sm">↓ 约去 m 和 r，解出 v</div>

                        <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30">
                            <p className="text-xs text-indigo-300 mb-2">环绕速度公式</p>
                            <div className="flex items-center justify-center text-2xl font-mono text-indigo-100 font-bold">
                                v = <span className="mx-2">√</span><span className="border-t border-white inline-block pt-1">GM / r</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            由此可见：轨道半径 <span className="font-mono text-white">r</span> 越小，需要的环绕速度 <span className="font-mono text-white">v</span> 就越大。近地卫星需要最大的发射速度。
                        </p>
                    </div>
                </div>
            </section>

             {/* Footer Quiz */}
             <div className="text-center pt-8 border-t border-slate-800">
                <p className="text-slate-500 mb-4">学懂了吗？思考一下：</p>
                <div className="inline-block bg-slate-800 px-6 py-3 rounded-full text-slate-300 hover:text-white transition-colors cursor-help">
                    ❓ 如果我想发射一颗同步卫星，它的速度应该比 7.9 km/s 大还是小？
                </div>
            </div>

        </main>
    </div>
  );
}
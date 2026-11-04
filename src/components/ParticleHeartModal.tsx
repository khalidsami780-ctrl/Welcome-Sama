import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { Language } from '../types';
import { X, Play, Pause, RefreshCw, Sparkles, Laugh } from './Icons';

interface ParticleHeartModalProps {
  language: Language;
  onClose: () => void;
}

interface Particle {
  t: number;             // parametric angle on heart curve [0, 2pi)
  layerOffset: number;   // virtual layer index (-1 to 7)
  jitterR: number;       // radial jitter
  size: number;          // particle radius
  colorType: 'cyan' | 'blue' | 'accentRose' | 'coreWhite';
  speedMul: number;      // individual flow speed
  // Assembly interpolation coordinates:
  originX: number;
  originY: number;
  assembled: boolean;
}

export const ParticleHeartModal: React.FC<ParticleHeartModalProps> = ({
  language,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // States
  const [phase, setPhase] = useState<'intro' | 'assembling' | 'infinite_zoom'>('intro');
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [intensity, setIntensity] = useState<'normal' | 'luminous'>('luminous');

  // Animation tracking refs
  const phaseRef = useRef<'intro' | 'assembling' | 'infinite_zoom'>('intro');
  const isPausedRef = useRef(false);
  const speedRef = useRef(1.0);
  const intensityRef = useRef<'normal' | 'luminous'>('luminous');
  const zoomTimeRef = useRef(0);
  const assemblyStartRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Keep refs in sync with state
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  const isAr = language === 'ar';

  // Mathematical Heart Parametric Curve:
  // x(t) = 16 * sin^3(t)
  // y(t) = -(13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t)) - 2.54 (centered vertically)
  const heartPoint = useCallback((t: number) => {
    const sinT = Math.sin(t);
    const x = 16 * Math.pow(sinT, 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) - 2.54;
    return { x, y };
  }, []);

  // Generate particle systems for nested hearts
  const createParticles = useCallback((width: number, height: number): Particle[] => {
    const list: Particle[] = [];
    const layerCount = 8; // layers 0 to 7
    const countPerLayer = intensityRef.current === 'luminous' ? 140 : 90;

    for (let l = 0; l < layerCount; l++) {
      for (let i = 0; i < countPerLayer; i++) {
        const t = (i / countPerLayer) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
        const colorRand = Math.random();
        let colorType: Particle['colorType'] = 'cyan';
        if (colorRand < 0.22) {
          colorType = 'accentRose'; // Rose ruby spark connecting to THE RED ROOM theme
        } else if (colorRand < 0.55) {
          colorType = 'cyan';       // Electric vibrant cyan
        } else if (colorRand < 0.85) {
          colorType = 'blue';       // Electric blue
        } else {
          colorType = 'coreWhite';  // Luminous white core
        }

        // Random starting positions beyond the viewport for the assembly phase
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.max(width, height) * (0.6 + Math.random() * 0.8);
        const originX = width / 2 + Math.cos(angle) * dist;
        const originY = height / 2 + Math.sin(angle) * dist;

        list.push({
          t,
          layerOffset: l,
          jitterR: 1 + (Math.random() - 0.5) * 0.07,
          size: Math.random() * 1.8 + 1.2,
          colorType,
          speedMul: 0.8 + Math.random() * 0.4,
          originX,
          originY,
          assembled: false,
        });
      }
    }
    return list;
  }, []);

  const particlesRef = useRef<Particle[]>([]);

  // Start the experience: triggered by clicking "شغّلي التجربة ✨"
  const handleStart = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    particlesRef.current = createParticles(canvas.width, canvas.height);
    assemblyStartRef.current = performance.now();
    zoomTimeRef.current = 0;
    setPhase('assembling');
  };

  // Restart experience
  const handleRestart = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    particlesRef.current = createParticles(canvas.width, canvas.height);
    assemblyStartRef.current = performance.now();
    zoomTimeRef.current = 0;
    setIsPaused(false);
    setPhase('assembling');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // If particles aren't initialized yet, populate them
      if (particlesRef.current.length === 0) {
        particlesRef.current = createParticles(canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Pause on tab switch
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPausedRef.current = true;
        setIsPaused(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Render step
    const render = (time: number) => {
      animFrameRef.current = requestAnimationFrame(render);

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      if (!isPausedRef.current) {
        zoomTimeRef.current += dt * speedRef.current;
      }

      const w = canvas.width;
      const h = canvas.height;
      const centerX = w / 2;
      const centerY = h / 2;

      // Base scale fits comfortably on desktop and mobile screens
      const baseScale = Math.min(w, h) * 0.023;
      const ratio = 0.58; // scale ratio between consecutive nested heart layers

      // Background clear with dark deep burgundy vignette
      ctx.fillStyle = '#080105';
      ctx.fillRect(0, 0, w, h);

      // Deep atmospheric burgundy glow at center
      const bgGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.max(w, h) * 0.7);
      bgGlow.addColorStop(0, 'rgba(46, 6, 24, 0.45)');
      bgGlow.addColorStop(0.5, 'rgba(20, 2, 10, 0.25)');
      bgGlow.addColorStop(1, 'rgba(8, 1, 5, 0.95)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, w, h);

      // --- INTRO SCREEN RENDERING ---
      if (phaseRef.current === 'intro') {
        // Render a subtle, pulsing luminous spark at center
        const pulse = 1 + Math.sin(time * 0.003) * 0.25;
        const sparkGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 24 * dpr * pulse);
        sparkGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        sparkGrad.addColorStop(0.3, 'rgba(0, 240, 255, 0.8)');
        sparkGrad.addColorStop(0.7, 'rgba(255, 42, 95, 0.4)');
        sparkGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = sparkGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 24 * dpr * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Subtle faint orbit rings
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40 * dpr * pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 42, 95, 0.1)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 60 * dpr * pulse, 0, Math.PI * 2);
        ctx.stroke();

        return;
      }

      // --- ASSEMBLY & INFINITE ZOOM PHASES ---
      const isAssembling = phaseRef.current === 'assembling';
      let assemblyProgress = 1.0;

      if (isAssembling) {
        const elapsed = (performance.now() - assemblyStartRef.current) / 1000;
        const duration = 2.4; // 2.4 seconds to assemble
        assemblyProgress = Math.min(1.0, elapsed / duration);
        // Smooth cubic ease-out
        assemblyProgress = 1 - Math.pow(1 - assemblyProgress, 3);

        if (elapsed >= duration) {
          phaseRef.current = 'infinite_zoom';
          setPhase('infinite_zoom');
        }
      }

      // Mathematical infinite recursive zoom factor:
      // u goes continuously from 0 to 1 as zoomTime advances.
      // One full cycle zooms by factor of (1 / ratio).
      const zoomCycleDuration = 3.6; // seconds per nesting iteration
      const u = (zoomTimeRef.current / zoomCycleDuration) % 1.0;

      // Draw delicate glowing architectural contour curves for each nested heart layer
      if (!isAssembling) {
        for (let l = -1; l <= 7; l++) {
          const effectiveLayer = l - u;
          const layerScale = baseScale * Math.pow(ratio, effectiveLayer);

          let alpha = 1.0;
          const maxVisibleScale = baseScale / ratio;
          const minVisibleScale = baseScale * Math.pow(ratio, 7);
          const fadeInScale = baseScale * Math.pow(ratio, 5);

          if (layerScale > baseScale) {
            alpha = Math.max(0, Math.min(1, 1 - (layerScale - baseScale) / (maxVisibleScale - baseScale)));
          } else if (layerScale < fadeInScale) {
            alpha = Math.max(0, Math.min(1, (layerScale - minVisibleScale) / (fadeInScale - minVisibleScale)));
          }

          if (alpha <= 0.05) continue;

          ctx.beginPath();
          const step = Math.PI / 45;
          for (let a = 0; a <= Math.PI * 2 + step; a += step) {
            const pt = heartPoint(a);
            const px = centerX + pt.x * layerScale;
            const py = centerY + pt.y * layerScale;
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.14 * alpha})`;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();

          // Accent ruby thread on alternating layers
          if (l % 2 === 0) {
            ctx.strokeStyle = `rgba(255, 42, 95, ${0.1 * alpha})`;
            ctx.lineWidth = 0.7 * dpr;
            ctx.stroke();
          }
        }
      }

      // Group particles by layer for smooth rendering
      const particles = particlesRef.current;
      const count = particles.length;

      for (let i = 0; i < count; i++) {
        const p = particles[i];

        // Layer scale with recursive zoom:
        // As u increases from 0 to 1, scale increases by (1/ratio).
        // Layer j approaches scale of Layer (j - 1).
        const effectiveLayer = p.layerOffset - (isAssembling ? 0 : u);
        const layerScale = baseScale * Math.pow(ratio, effectiveLayer);

        // Alpha calculation for seamless infinite loop:
        // When layer grows bigger than baseScale, it fades out smoothly to 0.
        // When layer is born at the deep micro-center, it fades in smoothly from 0.
        let alpha = 1.0;
        const maxVisibleScale = baseScale / ratio;
        const minVisibleScale = baseScale * Math.pow(ratio, 7);
        const fadeInScale = baseScale * Math.pow(ratio, 5);

        if (layerScale > baseScale) {
          alpha = Math.max(0, Math.min(1, 1 - (layerScale - baseScale) / (maxVisibleScale - baseScale)));
        } else if (layerScale < fadeInScale) {
          alpha = Math.max(0, Math.min(1, (layerScale - minVisibleScale) / (fadeInScale - minVisibleScale)));
        }

        if (alpha <= 0.01) continue;

        // Flowing motion along heart curve
        const flowTime = isAssembling ? 0 : zoomTimeRef.current * 0.4 * p.speedMul;
        const currentT = (p.t + flowTime) % (Math.PI * 2);

        // Calculate heart curve coordinate
        const pt = heartPoint(currentT);
        const shimmer = 1 + 0.03 * Math.sin(currentT * 4 + zoomTimeRef.current * 2);
        const targetX = centerX + pt.x * layerScale * p.jitterR * shimmer;
        const targetY = centerY + pt.y * layerScale * p.jitterR * shimmer;

        // In assembly phase, interpolate from origin to target
        let curX = targetX;
        let curY = targetY;

        if (isAssembling) {
          curX = p.originX + (targetX - p.originX) * assemblyProgress;
          curY = p.originY + (targetY - p.originY) * assemblyProgress;

          // Draw subtle luminous assembly trail
          if (assemblyProgress < 0.95 && i % 4 === 0) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - assemblyProgress)})`;
            ctx.beginPath();
            ctx.moveTo(p.originX, p.originY);
            ctx.lineTo(curX, curY);
            ctx.stroke();
          }
        }

        // Particle rendering: glowing radial core
        const pSize = p.size * dpr * (layerScale / baseScale > 0.4 ? 1.0 : 0.7);
        const glowRadius = pSize * (p.colorType === 'accentRose' ? 3.5 : 4.0);

        // Color selection
        let coreColor = 'rgba(255, 255, 255, 0.95)';
        let glowColor = 'rgba(0, 240, 255, 0.8)';
        let outerColor = 'rgba(0, 160, 255, 0)';

        if (p.colorType === 'accentRose') {
          glowColor = `rgba(255, 42, 95, ${0.9 * alpha})`;
          outerColor = 'rgba(225, 29, 72, 0)';
        } else if (p.colorType === 'blue') {
          glowColor = `rgba(56, 189, 248, ${0.85 * alpha})`;
          outerColor = 'rgba(2, 132, 199, 0)';
        } else if (p.colorType === 'coreWhite') {
          glowColor = `rgba(224, 242, 254, ${0.9 * alpha})`;
          outerColor = 'rgba(56, 189, 248, 0)';
        } else {
          // cyan
          glowColor = `rgba(0, 240, 255, ${0.9 * alpha})`;
          outerColor = 'rgba(6, 182, 212, 0)';
        }

        // Fast radiant particle draw
        const grad = ctx.createRadialGradient(curX, curY, 0, curX, curY, Math.max(1, glowRadius));
        grad.addColorStop(0, coreColor);
        grad.addColorStop(0.35, glowColor);
        grad.addColorStop(1, outerColor);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(curX, curY, Math.max(1, glowRadius), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [heartPoint, createParticles]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? 'تجربة القلب التفاعلي' : 'Interactive Particle Heart Experience'}
      className="fixed inset-0 z-50 bg-[#070104] text-warm-ivory select-none overflow-hidden flex flex-col justify-between"
    >
      {/* Background Canvas: 60FPS generative particle installation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />

      {/* Top Header Bar */}
      <div className="relative z-20 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between pointer-events-none bg-gradient-to-b from-[#080105]/90 via-[#080105]/40 to-transparent">
        {/* Left: Project & Technical Badge */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/40 backdrop-blur-md text-[11px] font-mono tracking-wider text-cyan-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{isAr ? 'تجربة رقمية تفاعلية' : 'GENERATIVE CODE EXPERIMENT'}</span>
          </div>
          <span className="hidden sm:inline font-mono text-[10px] text-warm-ivory/50">
            // fn heart(t) · 60fps · for Sama ✨
          </span>
        </div>

        {/* Right: Exit / Close Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={onClose}
            className="group px-3 py-1.5 rounded-full border border-warm-ivory/20 bg-near-black/60 hover:bg-rose-crimson/30 hover:border-petal-red/50 text-warm-ivory/90 hover:text-white transition-all duration-300 text-xs flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
            aria-label={isAr ? 'إغلاق التجربة والرجوع للريد روم' : 'Close and Return to The Red Room'}
            title={isAr ? 'رجوع للريد روم' : 'Back to The Red Room'}
          >
            <X size={15} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-[11px] tracking-wide font-medium">
              {isAr ? 'رجوع' : 'Back'}
            </span>
          </button>
        </div>
      </div>

      {/* Center Stage: Intro Screen Content (if phase === 'intro') */}
      {phase === 'intro' && (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 text-center max-w-xl mx-auto my-auto animate-fade-in pointer-events-auto">
          {/* Subtle glowing pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-950/50 backdrop-blur-md text-xs font-mono text-cyan-300 mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Sparkles size={13} className="text-cyan-400" />
            <span>{isAr ? 'تجربة صغيرة لسما ✨' : 'A Mini Experiment for Sama ✨'}</span>
          </div>

          {/* Heading in Egyptian Arabic */}
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-warm-ivory tracking-wide leading-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,240,255,0.25)]">
            {isAr
              ? 'عملنالك تجربة صغيرة كده، دوسي وشوفي اللي هيحصل ✨'
              : 'A Little Code Experiment, Crafted Just for You ✨'}
          </h2>

          {/* Descriptive body */}
          <p className="text-sm sm:text-base text-warm-ivory/70 font-sans max-w-md mx-auto mb-8 leading-relaxed">
            {isAr
              ? 'معادلات رياضية وكام سطر كود... هتتجمع نقط مضيئة وتعمل قلب جواه قلوب لا نهائية بتتحرك في حلقة مستمرة.'
              : 'Mathematical curves and glowing particles converging in real-time into an infinite, hypnotic nested heart universe.'}
          </p>

          {/* Big Start Button */}
          <button
            onClick={handleStart}
            className="group relative px-8 py-3.5 rounded-full border border-cyan-400/60 bg-gradient-to-r from-cyan-600/30 via-cyan-500/20 to-petal-red/30 hover:from-cyan-500/50 hover:to-petal-red/50 text-white font-medium text-sm sm:text-base tracking-wider transition-all duration-300 backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2.5"
          >
            <Sparkles size={18} className="text-cyan-300 group-hover:rotate-12 transition-transform" />
            <span>{isAr ? 'شغّلي التجربة ✨' : 'Run Experiment ✨'}</span>
          </button>
        </div>
      )}

      {/* Running Stage Toast: Playful Egyptian Friendship Joke (Centered cleanly below header) */}
      {phase !== 'intro' && (
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 30,
            padding: '0 16px',
          }}
        >
          <div
            style={{ pointerEvents: 'none' }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-cyan-400/35 bg-[#090206]/85 backdrop-blur-md text-[11px] sm:text-xs text-cyan-200/95 shadow-[0_4px_24px_rgba(0,0,0,0.7)] animate-fade-in text-center"
          >
            <Laugh size={15} className="text-cyan-400 shrink-0" />
            <span>
              {isAr
                ? 'شوية نقط وكام سطر كود... والنتيجة قلب جوه قلب جوه قلب 😂'
                : 'A few lines of code and math dots... and boom: a heart inside a heart inside a heart 😂'}
            </span>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Dock */}
      {phase !== 'intro' && (
        <div className="relative z-20 pb-6 sm:pb-8 px-4 flex justify-center pointer-events-none">
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 sm:px-6 py-2.5 rounded-full border border-warm-ivory/15 bg-[#0a0208]/85 backdrop-blur-lg shadow-[0_10px_35px_rgba(0,0,0,0.8)] text-xs">
            {/* Restart Button */}
            <button
              onClick={handleRestart}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-warm-ivory/15 bg-white/5 hover:bg-white/10 text-warm-ivory/80 hover:text-cyan-300 hover:border-cyan-400/40 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              title={isAr ? 'إعادة التجميع من الأول' : 'Restart Assembly'}
              aria-label="Restart"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline font-sans">{isAr ? 'إعادة' : 'Restart'}</span>
            </button>

            {/* Pause / Resume Button */}
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-warm-ivory/15 bg-white/5 hover:bg-white/10 text-warm-ivory/80 hover:text-cyan-300 hover:border-cyan-400/40 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              title={isAr ? (isPaused ? 'استئناف الحركة' : 'إيقاف مؤقت') : (isPaused ? 'Resume' : 'Pause')}
              aria-label={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play size={14} className="text-cyan-400" /> : <Pause size={14} />}
              <span className="hidden sm:inline font-sans">
                {isPaused ? (isAr ? 'تشغيل' : 'Resume') : (isAr ? 'إيقاف' : 'Pause')}
              </span>
            </button>

            {/* Speed Control Slider */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 text-warm-ivory/70 border-x border-warm-ivory/10">
              <span className="text-[11px] font-sans">{isAr ? 'السرعة' : 'Speed'}</span>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.25"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-16 sm:w-24 h-1 bg-warm-ivory/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                aria-label="Animation Speed"
              />
              <span className="font-mono text-[11px] text-cyan-300 w-7 text-right">
                {speed.toFixed(1)}x
              </span>
            </div>

            {/* Intensity / Bloom Preset */}
            <button
              onClick={() => {
                const next = intensity === 'luminous' ? 'normal' : 'luminous';
                setIntensity(next);
                if (canvasRef.current) {
                  particlesRef.current = createParticles(canvasRef.current.width, canvasRef.current.height);
                }
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-warm-ivory/15 bg-white/5 hover:bg-white/10 text-warm-ivory/80 hover:text-petal-red hover:border-petal-red/40 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              title={isAr ? 'تبديل الكثافة والتوهج' : 'Toggle Particle Intensity'}
              aria-label="Toggle Intensity"
            >
              <Sparkles size={14} className={intensity === 'luminous' ? 'text-petal-red' : ''} />
              <span className="hidden sm:inline font-sans">
                {intensity === 'luminous' ? (isAr ? 'كثيف' : 'Intense') : (isAr ? 'ناعم' : 'Subtle')}
              </span>
            </button>

            {/* Return to The Red Room */}
            <button
              onClick={onClose}
              className="px-2.5 sm:px-3 py-1.5 rounded-full border border-petal-red/40 bg-rose-crimson/25 hover:bg-rose-crimson/40 text-warm-ivory hover:text-white transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0"
              title={isAr ? 'رجوع إلى الريد روم' : 'Back to The Red Room'}
              aria-label="Return to The Red Room"
            >
              <X size={14} />
              <span className="font-sans font-medium text-[11px] whitespace-nowrap">
                {isAr ? 'رجوع' : 'Back'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

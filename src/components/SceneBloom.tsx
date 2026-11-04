import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Play, Pause, RefreshCw } from './Icons';
import { BotanicalRose } from './BotanicalRose';
import type { Language } from '../types';
import { soundscape } from '../utils/audio';

interface SceneBloomProps {
  language: Language;
  onContinue: () => void;
}

export const SceneBloom: React.FC<SceneBloomProps> = ({
  language,
  onContinue,
}) => {
  const [bloomProgress, setBloomProgress] = useState(0.15);
  const [isPlaying, setIsPlaying] = useState(true);
  const [companionEmergence, setCompanionEmergence] = useState(0);

  // Auto-blooming choreography over time
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlaying) {
        setBloomProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            return 1;
          }
          const next = prev + dt * 0.18; // smooth 5-6 sec unfolding
          // Also trigger companion roses emergence after 40% bloom
          if (next > 0.4) {
            setCompanionEmergence((c) => Math.min(1, c + dt * 0.35));
          }
          return Math.min(1, next);
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const handleRestart = () => {
    setBloomProgress(0.1);
    setCompanionEmergence(0);
    setIsPlaying(true);
    soundscape.playBloomChime();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setBloomProgress(val);
    setCompanionEmergence(Math.max(0, (val - 0.3) * 1.4));
    setIsPlaying(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 pt-20 pb-28 sm:pb-20 overflow-hidden select-none">
      {/* Dynamic Environmental Illumination that warms up as bloom progresses */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, rgba(164, 22, 50, ${
            0.1 + bloomProgress * 0.28
          }) 0%, rgba(94, 16, 33, ${0.1 + bloomProgress * 0.18}) 45%, rgba(16, 9, 12, 0.95) 100%)`,
        }}
      />

      {/* Chapter Marker */}
      <div className="z-10 flex flex-col items-center mb-4 text-center">
        <span className="text-xs tracking-[0.3em] uppercase text-muted-gold/80 font-sans flex items-center gap-1.5">
          <Sparkles size={12} />
          {language === 'en' ? 'Act II — The Metamorphosis' : 'الفصل التاني — الوردة بتفتح'}
        </span>
        <h2 className="font-editorial text-3xl sm:text-4xl text-warm-ivory mt-1 font-light tracking-wider">
          {language === 'en' ? 'The Unfolding of Crimson' : 'لحظة تفتح الوردة'}
        </h2>
      </div>

      {/* The Botanical Stage: Main Rose + Emerging Companion Roses */}
      <div className="relative w-full max-w-4xl h-[340px] sm:h-[400px] flex items-center justify-center z-10">
        {/* Companion Rose 1: Top-Left (Emerged with scale & blur depth) */}
        <div
          className="absolute left-[8%] sm:left-[16%] top-[12%] transition-all duration-1000 ease-out"
          style={{
            opacity: companionEmergence,
            transform: `scale(${0.4 + companionEmergence * 0.45}) translateY(${
              (1 - companionEmergence) * 40
            }px)`,
            filter: 'blur(1.5px)',
          }}
        >
          <BotanicalRose
            bloomProgress={Math.max(0.2, bloomProgress * 0.85)}
            size={180}
            glowColor="#5E1021"
            hasDew={false}
            isInteractive={false}
          />
        </div>

        {/* Companion Rose 2: Bottom-Right (Emerged) */}
        <div
          className="absolute right-[8%] sm:right-[16%] bottom-[10%] transition-all duration-1000 ease-out"
          style={{
            opacity: companionEmergence,
            transform: `scale(${0.35 + companionEmergence * 0.45}) translateY(${
              (1 - companionEmergence) * -40
            }px)`,
            filter: 'blur(1.2px)',
          }}
        >
          <BotanicalRose
            bloomProgress={Math.max(0.15, bloomProgress * 0.75)}
            size={170}
            glowColor="#D62845"
            hasDew={false}
            isInteractive={false}
          />
        </div>

        {/* Companion Rose 3: Distant top-right miniature */}
        <div
          className="hidden sm:block absolute right-[28%] top-[8%] transition-all duration-1000 ease-out"
          style={{
            opacity: companionEmergence * 0.7,
            transform: `scale(${0.25 + companionEmergence * 0.3})`,
            filter: 'blur(3px)',
          }}
        >
          <BotanicalRose
            bloomProgress={bloomProgress * 0.6}
            size={140}
            glowColor="#A41632"
            isInteractive={false}
          />
        </div>

        {/* The Central Sovereign Rose */}
        <div className="relative z-20 transition-transform duration-700">
          <BotanicalRose
            bloomProgress={bloomProgress}
            size={window.innerWidth < 640 ? 270 : 340}
            glowColor="#FF4D6D"
            hasDew={true}
            onClick={() => {
              soundscape.playRoseChime(2);
              setIsPlaying(!isPlaying);
            }}
            ariaLabel="Blooming Rose"
          />
        </div>
      </div>

      {/* Interactive Metamorphosis Scrubbing Controls */}
      <div className="z-20 mt-4 flex flex-col items-center gap-3 w-full max-w-sm px-4">
        {/* Scrub Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] tracking-widest uppercase text-warm-ivory/50">
            {language === 'en' ? 'Bud' : 'مقفولة'}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={bloomProgress}
            onChange={handleSliderChange}
            className="w-full accent-petal-red cursor-pointer bg-warm-ivory/20 h-1 rounded-lg"
            aria-label="Bloom Slider"
          />
          <span className="text-[10px] tracking-widest uppercase text-warm-ivory/50">
            {language === 'en' ? 'Bloom' : 'مفتحة'}
          </span>
        </div>

        {/* Play / Pause / Replay Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full border border-warm-ivory/20 bg-near-black/50 text-warm-ivory hover:text-petal-red hover:border-petal-red/40 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label="Play or Pause"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-full border border-warm-ivory/20 bg-near-black/50 text-warm-ivory hover:text-muted-gold hover:border-muted-gold/40 transition-colors"
            title="Replay Unfolding"
            aria-label="Replay Unfolding"
          >
            <RefreshCw size={14} />
          </button>

          <span className="text-xs text-warm-ivory/70 font-sans tracking-wider">
            {Math.round(bloomProgress * 100)}% {language === 'en' ? 'Awakened' : 'فتحت'}
          </span>
        </div>
      </div>

      {/* Continue Action */}
      <div className="z-20 mt-6">
        <button
          onClick={() => {
            soundscape.playBloomChime();
            onContinue();
          }}
          className="group inline-flex items-center gap-3 px-7 py-3 rounded-full border border-muted-gold/40 bg-rose-crimson/25 hover:bg-rose-crimson/45 backdrop-blur-md text-warm-ivory transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(214,40,69,0.4)] active:scale-95"
        >
          <span className="text-xs tracking-[0.25em] uppercase font-sans font-medium">
            {language === 'en' ? 'Enter The Living Garden' : 'ادخلي شوفي الجنينة'}
          </span>
          <ArrowRight
            size={14}
            className="text-muted-gold group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
      </div>
    </div>
  );
};

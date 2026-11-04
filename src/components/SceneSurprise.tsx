import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Award, Heart } from './Icons';
import confetti from 'canvas-confetti';
import { BotanicalRose } from './BotanicalRose';
import { KeepsakeModal } from './KeepsakeModal';
import type { Language } from '../types';
import { soundscape } from '../utils/audio';

interface SceneSurpriseProps {
  language: Language;
  onReplay: () => void;
}

export const SceneSurprise: React.FC<SceneSurpriseProps> = ({
  language,
  onReplay,
}) => {
  const [showKeepsake, setShowKeepsake] = useState(false);
  const [bloomProgress, setBloomProgress] = useState(0.5);

  useEffect(() => {
    // Elegant soft petal shower trigger
    soundscape.playBloomChime();

    // Trigger subtle silk confetti petals
    try {
      confetti({
        particleCount: 45,
        spread: 90,
        origin: { y: 0.2 },
        colors: ['#A41632', '#D62845', '#5E1021', '#B99A68'],
        ticks: 240,
        gravity: 0.6,
        scalar: 1.2,
        shapes: ['circle'],
      });
    } catch {
      // Graceful fallback
    }

    // Slowly bloom the final rose to 1.0
    const timeout = setTimeout(() => {
      setBloomProgress(1.0);
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 pt-20 pb-28 sm:pb-20 text-center select-none overflow-hidden">
      {/* Radiant ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-rose-crimson/15 blur-[160px] pointer-events-none" />

      {/* Epilogue Marker */}
      <div className="z-10 mb-4 animate-fade-in">
        <span className="text-xs tracking-[0.32em] uppercase text-muted-gold font-sans flex items-center justify-center gap-2">
          <Sparkles size={14} />
          {language === 'en' ? 'Act V — The Constellation of Sama' : 'الفصل الخامس — نجوم سما'}
        </span>
      </div>

      {/* Floating Monumental Rose in Full Glory */}
      <div className="z-10 my-3 animate-float">
        <BotanicalRose
          bloomProgress={bloomProgress}
          size={window.innerWidth < 640 ? 270 : 350}
          glowColor="#FF4D6D"
          hasDew={true}
          hasGoldVeins={true}
          onClick={() => {
            soundscape.playBloomChime();
          }}
          ariaLabel="Grand Blossom"
        />
      </div>

      {/* Sama's Name Illuminated like stars */}
      <div className="z-10 mt-2 space-y-2">
        <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl tracking-[0.3em] text-warm-ivory uppercase font-light drop-shadow-[0_4px_40px_rgba(214,40,69,0.5)]">
          S A M A
        </h1>

        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-muted-gold/40" />
          <span className="font-amiri text-2xl sm:text-3xl text-muted-gold italic tracking-widest font-bold">
            سَمَا
          </span>
          <span className="h-px w-12 bg-muted-gold/40" />
        </div>

        <p className="max-w-md mx-auto font-editorial italic text-base sm:text-lg text-warm-ivory/85 mt-3 leading-relaxed px-4">
          {language === 'en'
            ? '“May all your days be filled with happiness, peace of mind, success in your dreams, and that wonderful laugh of yours.”'
            : '“يارب أيامك الجاية كلها تكون رايقة ومليانة خير، وتفضلي دايماً بروحك الحلوة وضحكتك!”'}
        </p>
      </div>

      {/* Interactive Actions: Keepsake + Replay */}
      <div className="z-20 mt-8 flex flex-col sm:flex-row items-center gap-4">
        {/* Keepsake Generator Modal Trigger */}
        <button
          onClick={() => setShowKeepsake(true)}
          className="px-7 py-3 rounded-full border border-muted-gold bg-muted-gold/15 hover:bg-muted-gold/30 text-muted-gold text-xs tracking-[0.22em] uppercase font-sans font-medium flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(185,154,104,0.25)] hover:shadow-[0_0_30px_rgba(185,154,104,0.4)] cursor-pointer"
        >
          <Award size={15} />
          <span>{language === 'en' ? 'Claim Your Keepsake Card' : 'كارت للذكرى ليكي 🌹'}</span>
        </button>

        {/* Replay Sanctuary Button */}
        <button
          onClick={() => {
            soundscape.playBloomChime();
            onReplay();
          }}
          className="px-7 py-3 rounded-full border border-warm-ivory/25 bg-near-black/50 hover:bg-white/10 text-warm-ivory text-xs tracking-[0.22em] uppercase font-sans font-medium flex items-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw size={15} />
          <span>{language === 'en' ? 'Wander The Garden Again' : 'لفي في الجنينة من الأول'}</span>
        </button>
      </div>

      {/* Discreet footer sign-off */}
      <div className="z-10 mt-10 text-[11px] text-warm-ivory/40 font-sans tracking-widest uppercase flex items-center gap-1.5">
        <Heart size={10} fill="#B99A68" className="text-muted-gold opacity-60" />
        <span>THE RED ROOM — EXPERIMENTAL DIGITAL BOTANICAL INSTALLATION</span>
      </div>

      {/* Keepsake Card Modal */}
      {showKeepsake && (
        <KeepsakeModal
          language={language}
          onClose={() => setShowKeepsake(false)}
        />
      )}
    </div>
  );
};

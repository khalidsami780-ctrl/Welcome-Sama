import React, { useState } from 'react';
import { ArrowRight, Sparkles } from './Icons';
import { BotanicalRose } from './BotanicalRose';
import type { Language } from '../types';
import { soundscape } from '../utils/audio';

interface SceneInvitationProps {
  language: Language;
  onEnter: () => void;
}

export const SceneInvitation: React.FC<SceneInvitationProps> = ({
  language,
  onEnter,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleEnterClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    soundscape.playBloomChime();
    setTimeout(() => {
      onEnter();
    }, 1200);
  };

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col items-center justify-center px-4 pt-20 pb-28 sm:pb-20 text-center transition-all duration-1000 ${
        isTransitioning ? 'scale-110 opacity-0 blur-sm' : 'scale-100 opacity-100'
      }`}
    >
      {/* Background radial illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-rose-crimson/10 blur-[120px] pointer-events-none" />

      {/* Sama Monogram & Header */}
      <div className="mb-6 z-10 flex flex-col items-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-muted-gold/25 bg-muted-gold/5 text-muted-gold text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-4 animate-fade-in">
          <Sparkles size={12} />
          <span>{language === 'en' ? 'A Sanctuary in Crimson' : 'مكان معمول مخصوص لسما'}</span>
        </div>

        {/* Artistic Name Display */}
        <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl tracking-[0.25em] text-warm-ivory uppercase font-light drop-shadow-[0_4px_30px_rgba(214,40,69,0.35)] select-none">
          S A M A
        </h1>

        {/* Arabic delicate Calligraphic Glow (سما without ء) */}
        <span className="font-amiri text-2xl sm:text-3xl text-muted-gold/80 italic mt-1 tracking-widest font-bold">
          سَمَا
        </span>
      </div>

      {/* Floating Centerpiece Rose (Bud ready to unfurl) */}
      <div
        className="my-4 sm:my-6 z-10 animate-float"
        title={language === 'en' ? 'Click to awaken the rose' : 'دوسي على الوردة عشان تصحى 🌹'}
      >
        <BotanicalRose
          bloomProgress={0.18}
          size={window.innerWidth < 640 ? 240 : 310}
          glowColor="#D62845"
          hasDew={true}
          onClick={handleEnterClick}
          ariaLabel="Solitary Rose Bud"
        />
      </div>

      {/* Poetic Invitation Copy */}
      <div className="max-w-xl mx-auto z-10 mt-2 px-4 space-y-4">
        <p className="font-editorial italic text-lg sm:text-2xl text-warm-ivory/90 leading-relaxed font-light">
          {language === 'en'
            ? '“Somewhere between silence and beauty, a little garden was waiting for you.”'
            : '“مكان هادي وجميل، معمول ومستنيكي من بدري.”'}
        </p>

        <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-warm-ivory/50 font-sans">
          {language === 'en'
            ? 'An immersive floral realm crafted in red roses'
            : 'تجربة تفاعلية لطيفة معمولة بالورد الأحمر اللي بتحبيه'}
        </p>
      </div>

      {/* Cinematic Invitation Button */}
      <div className="mt-8 z-10">
        <button
          onClick={handleEnterClick}
          className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-muted-gold/40 bg-wine-red/30 hover:bg-rose-crimson/30 backdrop-blur-xl text-warm-ivory transition-all duration-500 shadow-[0_0_25px_rgba(164,22,50,0.25)] hover:shadow-[0_0_35px_rgba(214,40,69,0.5)] hover:border-muted-gold active:scale-95 cursor-pointer"
        >
          {/* Subtle button ring glow */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-muted-gold/30 via-petal-red/40 to-muted-gold/30 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />

          <span className="relative font-sans text-xs tracking-[0.28em] uppercase font-medium">
            {language === 'en' ? 'Enter the Garden' : 'ادخلي الجنينة'}
          </span>

          <ArrowRight
            size={16}
            className="relative text-muted-gold group-hover:translate-x-1.5 transition-transform duration-300"
          />
        </button>
      </div>
    </div>
  );
};

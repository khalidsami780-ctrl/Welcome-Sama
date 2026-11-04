import React, { useState } from 'react';
import { Volume2, VolumeX, Wind, Maximize2, Minimize2, Globe, Sparkles, Info, X, Spotify } from './Icons';
import type { Language, SceneId } from '../types';
import { soundscape } from '../utils/audio';

interface NavigationProps {
  currentScene: SceneId;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onTriggerBreeze: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenMusicCorner: () => void;
  onOpenParticleHeart: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScene,
  language,
  onLanguageChange,
  onTriggerBreeze,
  soundEnabled,
  onToggleSound,
  onOpenMusicCorner,
  onOpenParticleHeart,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCuratorialModal, setShowCuratorialModal] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const sceneTitlesEn: Record<SceneId, string> = {
    1: 'Act I — The Invitation',
    2: 'Act II — The Bloom',
    3: 'Act III — The Living Garden',
    4: 'Act IV — The Secret Letter',
    5: 'Act V — The Constellation',
  };

  const sceneTitlesAr: Record<SceneId, string> = {
    1: 'الفصل الأول — البداية',
    2: 'الفصل التاني — الوردة بتفتح',
    3: 'الفصل التالت — جنينة الورد',
    4: 'الفصل الرابع — رسالة ليكي',
    5: 'الفصل الخامس — نجوم سما',
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-10 py-4 sm:py-5 flex items-center justify-between pointer-events-none transition-all duration-500 bg-gradient-to-b from-near-black/90 via-near-black/40 to-transparent">
        {/* Left: Brand Identity & Chapter */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex flex-col">
            <span className="font-editorial text-xs md:text-sm tracking-[0.28em] uppercase text-warm-ivory/90 font-semibold drop-shadow-md">
              THE RED ROOM
            </span>
            <span className="hidden sm:inline text-[10px] md:text-xs tracking-[0.2em] uppercase text-muted-gold/80 font-sans">
              {language === 'en' ? sceneTitlesEn[currentScene] : sceneTitlesAr[currentScene]}
            </span>
          </div>
        </div>

        {/* Right: Controls & Interactive Talismans */}
        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
          {/* Interactive Particle Heart Experiment Button */}
          <button
            onClick={onOpenParticleHeart}
            className="group relative px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-full border border-cyan-400/50 bg-cyan-950/35 hover:bg-cyan-900/50 text-cyan-200 hover:text-white transition-all duration-300 text-xs flex items-center gap-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:border-cyan-300 cursor-pointer"
            title={language === 'en' ? 'Open Particle Heart Art' : 'تجربة صغيرة (فن الكود)'}
            aria-label={language === 'en' ? 'Open Particle Heart Experience' : 'فتح تجربة صغيرة'}
          >
            <Sparkles size={14} className="text-cyan-400 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
            <span className="text-[11px] tracking-wider uppercase font-medium">
              {language === 'en' ? 'Mini Experiment' : 'تجربة صغيرة'}
            </span>
          </button>

          {/* Sama's Music Corner Button */}
          <button
            onClick={onOpenMusicCorner}
            className="group relative px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-full border border-muted-gold/50 bg-rose-crimson/25 hover:bg-rose-crimson/40 text-warm-ivory transition-all duration-300 text-xs flex items-center gap-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(214,40,69,0.3)] hover:border-muted-gold cursor-pointer"
            title={language === 'en' ? "Open Sama's Music Corner (Spotify)" : 'ركن المزيكا (عمرو دياب)'}
            aria-label="Open Music Corner"
          >
            <Spotify size={14} className="text-[#1DB954] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] tracking-wider uppercase font-medium">
              {language === 'en' ? 'Music' : 'المزيكا'}
            </span>
          </button>

          {/* Wind / Petal Gust Button */}
          <button
            onClick={() => {
              soundscape.playPetalBreeze();
              onTriggerBreeze();
            }}
            className="group relative px-2.5 py-1.5 md:px-3 md:py-2 rounded-full border border-warm-ivory/15 bg-near-black/40 backdrop-blur-md text-warm-ivory/80 hover:text-petal-red hover:border-petal-red/40 transition-all duration-300 text-xs flex items-center gap-1.5"
            title={language === 'en' ? 'Release Petal Breeze' : 'طيري شوية بتلات ورد'}
            aria-label="Release Wind"
          >
            <Wind size={14} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="hidden sm:inline text-[11px] tracking-widest uppercase">
              {language === 'en' ? 'Breeze' : 'هوا'}
            </span>
          </button>

          {/* Soundscape Toggle */}
          <button
            onClick={onToggleSound}
            className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-full border transition-all duration-300 text-xs flex items-center gap-1.5 backdrop-blur-md ${
              soundEnabled
                ? 'border-petal-red/50 bg-petal-red/15 text-warm-ivory shadow-[0_0_15px_rgba(214,40,69,0.3)]'
                : 'border-warm-ivory/15 bg-near-black/40 text-warm-ivory/60 hover:text-warm-ivory'
            }`}
            title={language === 'en' ? 'Toggle Generative Soundscape' : 'المزيكا والصوت'}
            aria-label="Toggle Soundscape"
          >
            {soundEnabled ? (
              <>
                <Volume2 size={14} className="text-petal-red" />
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-1.5 bg-petal-red animate-pulse" />
                  <span className="w-0.5 h-3 bg-petal-red animate-pulse delay-75" />
                  <span className="w-0.5 h-2 bg-petal-red animate-pulse delay-150" />
                </div>
              </>
            ) : (
              <>
                <VolumeX size={14} />
                <span className="hidden sm:inline text-[11px] tracking-widest uppercase">
                  {language === 'en' ? 'Sound' : 'صوت'}
                </span>
              </>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="px-2.5 py-1.5 md:px-3 md:py-2 rounded-full border border-warm-ivory/15 bg-near-black/40 backdrop-blur-md text-warm-ivory/80 hover:text-muted-gold hover:border-muted-gold/40 transition-all duration-300 text-xs flex items-center gap-1"
            title="Switch Language"
            aria-label="Switch Language"
          >
            <Globe size={14} />
            <span className="text-[11px] tracking-wider uppercase font-medium">
              {language === 'en' ? 'عربي' : 'EN'}
            </span>
          </button>

          {/* Curatorial Info Modal Trigger */}
          <button
            onClick={() => setShowCuratorialModal(true)}
            className="p-1.5 md:p-2 rounded-full border border-warm-ivory/15 bg-near-black/40 backdrop-blur-md text-warm-ivory/70 hover:text-warm-ivory hover:border-warm-ivory/30 transition-all duration-300"
            title={language === 'en' ? 'Curatorial Note' : 'عن الفكرة'}
            aria-label="About Installation"
          >
            <Info size={14} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex p-1.5 md:p-2 rounded-full border border-warm-ivory/15 bg-near-black/40 backdrop-blur-md text-warm-ivory/70 hover:text-warm-ivory hover:border-warm-ivory/30 transition-all duration-300"
            title={language === 'en' ? 'Fullscreen Installation' : 'شاشة كاملة'}
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </header>

      {/* Curatorial Statement Dialog */}
      {showCuratorialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-near-black/85 backdrop-blur-xl animate-fade-in">
          <div className="relative max-w-lg w-full bg-deep-burgundy/90 border border-muted-gold/30 rounded-2xl p-6 md:p-8 shadow-2xl text-warm-ivory">
            <button
              onClick={() => setShowCuratorialModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-warm-ivory/60 hover:text-warm-ivory hover:bg-white/5 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-muted-gold mb-3">
              <Sparkles size={16} />
              <span className="text-xs tracking-[0.25em] uppercase font-sans">
                {language === 'en' ? 'Botanical Art Installation' : 'فكرة معمولة ليكي'}
              </span>
            </div>

            <h3 className="font-editorial text-2xl md:text-3xl text-warm-ivory mb-4 font-light">
              {language === 'en' ? 'The Red Room for Sama' : 'الغرفة الحمراء — لسما'}
            </h3>

            <div className="space-y-3 text-sm md:text-base text-warm-ivory/80 leading-relaxed font-sans font-light">
              {language === 'en' ? (
                <>
                  <p>
                    <em>The Red Room</em> is an original interactive digital sanctuary celebrating the beauty of red roses, dedicated with warm friendship, positivity, and sincere appreciation to Sama.
                  </p>
                  <p>
                    It is an immersive artistic corner where botanical aesthetics, gentle light, playful moments, and Sama’s favorite Amr Diab classics converge.
                  </p>
                  <p className="text-xs text-muted-gold/90 border-t border-muted-gold/20 pt-3">
                    Tip: Explore each blooming rose, open the letter in Act IV, and visit Sama's Amr Diab Music Corner from the top bar!
                  </p>
                </>
              ) : (
                <div dir="rtl" className="space-y-3 font-amiri text-base leading-relaxed">
                  <p>
                    <em>الغرفة الحمراء</em> دي فكرة وتجربة لطيفة اتعملت مخصوص عشانك يا سما، فيها ورد أحمر من اللي بتحبيه، ورسالة حلوة من القلب.
                  </p>
                  <p>
                    مفيهاش أي تعقيد.. شوية ورد وكلمتين حلوين للجدعنة، وركن رايق لأغاني عمرو دياب اللي بتحبي تسمعيها دايماً.
                  </p>
                  <p className="text-xs text-muted-gold/90 border-t border-muted-gold/20 pt-3 font-sans">
                    شوفي الورد في الجنينة، وافتحي الجواب في الفصل الرابع، ومتنسيش تشغلي أغاني عمرو دياب من فوق!
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowCuratorialModal(false)}
                className="px-6 py-2 rounded-full border border-muted-gold/50 bg-muted-gold/10 hover:bg-muted-gold/20 text-muted-gold text-xs tracking-widest uppercase transition-colors"
              >
                {language === 'en' ? 'Close & Wander' : 'رجوع للغرفة 🌹'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

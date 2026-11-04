import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Wind,
  Globe,
  Sparkles,
  Info,
  X,
  Spotify,
  Menu,
  Home,
  Leaf,
  Mail,
} from './Icons';
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
  onCloseMusicCorner?: () => void;
  isMusicCornerOpen?: boolean;
  onOpenParticleHeart: () => void;
  onCloseParticleHeart?: () => void;
  isParticleHeartOpen?: boolean;
  onSceneChange?: (scene: SceneId) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScene,
  language,
  onLanguageChange,
  onTriggerBreeze,
  soundEnabled,
  onToggleSound,
  onOpenMusicCorner,
  onCloseMusicCorner,
  isMusicCornerOpen = false,
  onOpenParticleHeart,
  onCloseParticleHeart,
  isParticleHeartOpen = false,
  onSceneChange,
}) => {
  const [showCuratorialModal, setShowCuratorialModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAr = language === 'ar';

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  // Keyboard shortcut: Escape to close drawer or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        if (showCuratorialModal) setShowCuratorialModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, showCuratorialModal]);

  const chapters: { id: SceneId; roman: string; titleEn: string; titleAr: string }[] = [
    { id: 1, roman: 'I', titleEn: 'The Invitation', titleAr: 'البداية' },
    { id: 2, roman: 'II', titleEn: 'The Bloom', titleAr: 'الوردة بتفتح' },
    { id: 3, roman: 'III', titleEn: 'The Living Garden', titleAr: 'جنينة الورد' },
    { id: 4, roman: 'IV', titleEn: 'The Secret Letter', titleAr: 'رسالة ليكي' },
    { id: 5, roman: 'V', titleEn: 'The Constellation', titleAr: 'نجوم سما' },
  ];

  const handleSelectScene = (sceneId: SceneId) => {
    if (isMusicCornerOpen && onCloseMusicCorner) {
      onCloseMusicCorner();
    }
    if (isParticleHeartOpen && onCloseParticleHeart) {
      onCloseParticleHeart();
    }
    if (onSceneChange) {
      onSceneChange(sceneId);
    }
    setIsMobileMenuOpen(false);
  };

  const handleToggleMusicCorner = () => {
    if (isMusicCornerOpen) {
      if (onCloseMusicCorner) onCloseMusicCorner();
    } else {
      if (isParticleHeartOpen && onCloseParticleHeart) onCloseParticleHeart();
      onOpenMusicCorner();
    }
    setIsMobileMenuOpen(false);
  };

  const handleToggleParticleHeart = () => {
    if (isParticleHeartOpen) {
      if (onCloseParticleHeart) onCloseParticleHeart();
    } else {
      if (isMusicCornerOpen && onCloseMusicCorner) onCloseMusicCorner();
      onOpenParticleHeart();
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Header Navigation Bar */}
      {/* On mobile, if MusicCorner is open, this header is hidden so MusicCorner's dedicated mobile bar takes over */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 lg:px-10 py-3 sm:py-4 flex items-center justify-between pointer-events-none transition-all duration-300 bg-gradient-to-b from-[#080105]/95 via-[#080105]/70 to-transparent ${
          isMusicCornerOpen ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <button
            onClick={() => handleSelectScene(1)}
            className="flex items-center gap-2 group cursor-pointer text-start"
            title={isAr ? 'الرجوع للبداية' : 'Back to Beginning'}
          >
            <span className="font-editorial text-xs md:text-sm tracking-[0.25em] uppercase text-warm-ivory/95 font-semibold drop-shadow-md group-hover:text-white transition-colors">
              THE RED ROOM
            </span>
            <span className="text-[11px] text-muted-gold font-sans font-medium tracking-widest uppercase">
              {isAr ? 'سما 🌹' : 'Sama 🌹'}
            </span>
          </button>
        </div>

        {/* --- MOBILE COMPACT HEADER (< 768px) --- */}
        <div className="flex md:hidden items-center gap-2 pointer-events-auto">
          {/* Mobile Soundscape Quick Toggle (min 44px touch target) */}
          <button
            onClick={onToggleSound}
            className={`min-w-[44px] min-h-[44px] p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center backdrop-blur-md cursor-pointer ${
              soundEnabled
                ? 'border-petal-red/60 bg-petal-red/20 text-warm-ivory shadow-[0_0_12px_rgba(214,40,69,0.35)]'
                : 'border-warm-ivory/15 bg-near-black/75 text-warm-ivory/70 hover:text-warm-ivory'
            }`}
            title={isAr ? 'الصوت والمزيكا' : 'Toggle Sound'}
            aria-label={isAr ? 'تشغيل أو إيقاف الصوت' : 'Toggle Sound'}
          >
            {soundEnabled ? (
              <div className="flex items-center gap-1">
                <Volume2 size={16} className="text-petal-red" />
                <span className="w-1.5 h-1.5 rounded-full bg-petal-red animate-pulse" />
              </div>
            ) : (
              <VolumeX size={16} />
            )}
          </button>

          {/* Mobile Menu Trigger Button (min 44px touch target) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="min-w-[44px] min-h-[44px] px-3.5 py-2 rounded-full border border-muted-gold/40 bg-near-black/80 backdrop-blur-md text-warm-ivory hover:text-white hover:border-muted-gold transition-all duration-300 flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-pointer"
            aria-label={isAr ? 'فتح قائمة التنقل' : 'Open Navigation Menu'}
            title={isAr ? 'القائمة' : 'Menu'}
          >
            <Menu size={18} className="text-muted-gold" />
            <span className="text-xs font-sans font-medium tracking-wider">
              {isAr ? 'القائمة' : 'Menu'}
            </span>
          </button>
        </div>

        {/* --- DESKTOP FULL NAVIGATION BAR (>= 768px) --- */}
        {/* Matches the user's reference design with direct scene links, highlighted Music pill, and controls */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2 pointer-events-auto">
          {/* 1. المفاجأة (Interactive Particle Heart) */}
          <button
            onClick={handleToggleParticleHeart}
            className={`group relative px-3 py-1.5 rounded-full border transition-all duration-300 text-xs flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
              isParticleHeartOpen
                ? 'border-cyan-300 bg-cyan-900/60 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'border-cyan-400/35 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-200 hover:text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}
            title={isAr ? 'المفاجأة (فن الكود المتداخل)' : 'Particle Heart Art'}
            aria-label="Particle Heart Experience"
          >
            <Sparkles size={14} className="text-cyan-400 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
            <span className="text-[11px] tracking-wider uppercase font-medium">
              {isAr ? 'المفاجأة' : 'Surprise'}
            </span>
          </button>

          {/* 2. ركن الموسيقى (Sama's Spotify Music Corner) */}
          <button
            onClick={handleToggleMusicCorner}
            className={`group relative px-3.5 py-1.5 rounded-full border transition-all duration-300 text-xs flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
              isMusicCornerOpen
                ? 'bg-active-pill text-white border-petal-red/70 shadow-[0_0_18px_rgba(214,40,69,0.5)] scale-105'
                : 'border-muted-gold/40 bg-rose-crimson/25 hover:bg-rose-crimson/40 text-warm-ivory hover:border-muted-gold shadow-[0_0_12px_rgba(214,40,69,0.25)]'
            }`}
            title={isAr ? 'ركن الموسيقى (عمرو دياب)' : "Sama's Music Corner (Spotify)"}
            aria-label="Open Music Corner"
          >
            <Spotify size={15} className="text-[#1DB954] group-hover:scale-110 transition-transform" />
            <span className="text-[11px] tracking-wider uppercase font-semibold">
              {isAr ? 'ركن الموسيقى' : 'Music Corner'}
            </span>
            {isMusicCornerOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </button>

          {/* 3. الرسالة (Scene 4: The Secret Letter) */}
          <button
            onClick={() => handleSelectScene(4)}
            className={`px-3 py-1.5 rounded-full border transition-all duration-300 text-xs flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
              currentScene === 4 && !isMusicCornerOpen && !isParticleHeartOpen
                ? 'border-muted-gold/80 bg-muted-gold/25 text-warm-ivory shadow-[0_0_12px_rgba(185,154,104,0.3)]'
                : 'border-warm-ivory/15 bg-near-black/40 hover:bg-white/10 text-warm-ivory/80 hover:text-white hover:border-warm-ivory/30'
            }`}
            title={isAr ? 'رسالة ليكي' : 'The Secret Letter'}
          >
            <Mail size={13} className="text-muted-gold/90" />
            <span className="text-[11px] tracking-wider font-medium">
              {isAr ? 'الرسالة' : 'The Letter'}
            </span>
          </button>

          {/* 4. الحديقة الحية (Scene 3: The Living Garden) */}
          <button
            onClick={() => handleSelectScene(3)}
            className={`px-3 py-1.5 rounded-full border transition-all duration-300 text-xs flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
              currentScene === 3 && !isMusicCornerOpen && !isParticleHeartOpen
                ? 'border-muted-gold/80 bg-muted-gold/25 text-warm-ivory shadow-[0_0_12px_rgba(185,154,104,0.3)]'
                : 'border-warm-ivory/15 bg-near-black/40 hover:bg-white/10 text-warm-ivory/80 hover:text-white hover:border-warm-ivory/30'
            }`}
            title={isAr ? 'جنينة الورد' : 'The Living Garden'}
          >
            <Leaf size={13} className="text-green-400/90" />
            <span className="text-[11px] tracking-wider font-medium">
              {isAr ? 'الحديقة الحية' : 'Garden'}
            </span>
          </button>

          {/* 5. تفتح الوردة (Scene 2: The Bloom) */}
          <button
            onClick={() => handleSelectScene(2)}
            className={`px-3 py-1.5 rounded-full border transition-all duration-300 text-xs flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
              currentScene === 2 && !isMusicCornerOpen && !isParticleHeartOpen
                ? 'border-muted-gold/80 bg-muted-gold/25 text-warm-ivory shadow-[0_0_12px_rgba(185,154,104,0.3)]'
                : 'border-warm-ivory/15 bg-near-black/40 hover:bg-white/10 text-warm-ivory/80 hover:text-white hover:border-warm-ivory/30'
            }`}
            title={isAr ? 'الوردة بتفتح' : 'The Bloom'}
          >
            <span className="text-[11px]">🌸</span>
            <span className="text-[11px] tracking-wider font-medium">
              {isAr ? 'تفتح الوردة' : 'The Bloom'}
            </span>
          </button>

          {/* 6. البداية (Scene 1: The Beginning / Invitation) */}
          <button
            onClick={() => handleSelectScene(1)}
            className={`px-3 py-1.5 rounded-full border transition-all duration-300 text-xs flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
              currentScene === 1 && !isMusicCornerOpen && !isParticleHeartOpen
                ? 'border-muted-gold/80 bg-muted-gold/25 text-warm-ivory shadow-[0_0_12px_rgba(185,154,104,0.3)]'
                : 'border-warm-ivory/15 bg-near-black/40 hover:bg-white/10 text-warm-ivory/80 hover:text-white hover:border-warm-ivory/30'
            }`}
            title={isAr ? 'البداية' : 'The Beginning'}
          >
            <Home size={13} className="text-muted-gold/90" />
            <span className="text-[11px] tracking-wider font-medium">
              {isAr ? 'البداية' : 'Beginning'}
            </span>
          </button>

          {/* Divider */}
          <div className="w-[1px] h-4 bg-muted-gold/30 mx-0.5" />

          {/* 7. Language Switcher (EN | AR Pill) */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="px-2.5 py-1.5 rounded-full border border-warm-ivory/20 bg-near-black/50 hover:bg-white/10 hover:border-muted-gold/50 text-warm-ivory transition-all duration-300 text-xs flex items-center gap-1 cursor-pointer"
            title="Switch Language / تبديل اللغة"
            aria-label="Switch Language"
          >
            <Globe size={13} className="text-muted-gold" />
            <span className="text-[11px] font-sans font-medium tracking-wide">
              {language === 'en' ? 'AR' : 'EN'}
            </span>
          </button>

          {/* 8. Soundscape Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-full border transition-all duration-300 text-xs flex items-center justify-center backdrop-blur-md cursor-pointer ${
              soundEnabled
                ? 'border-petal-red/50 bg-petal-red/20 text-warm-ivory shadow-[0_0_12px_rgba(214,40,69,0.3)]'
                : 'border-warm-ivory/15 bg-near-black/40 text-warm-ivory/60 hover:text-warm-ivory hover:border-warm-ivory/30'
            }`}
            title={isAr ? 'تشغيل أو إيقاف الصوت' : 'Toggle Soundscape'}
            aria-label="Toggle Soundscape"
          >
            {soundEnabled ? (
              <Volume2 size={14} className="text-petal-red" />
            ) : (
              <VolumeX size={14} />
            )}
          </button>

          {/* 9. Petal Breeze Talisman */}
          <button
            onClick={() => {
              soundscape.playPetalBreeze();
              onTriggerBreeze();
            }}
            className="p-2 rounded-full border border-warm-ivory/15 bg-near-black/40 backdrop-blur-md text-warm-ivory/70 hover:text-petal-red hover:border-petal-red/40 transition-all duration-300 cursor-pointer"
            title={isAr ? 'طيري شوية بتلات ورد' : 'Release Petal Breeze'}
            aria-label="Release Breeze"
          >
            <Wind size={14} />
          </button>

          {/* 10. Curatorial Info Note */}
          <button
            onClick={() => setShowCuratorialModal(true)}
            className="p-2 rounded-full border border-warm-ivory/15 bg-near-black/40 backdrop-blur-md text-warm-ivory/60 hover:text-warm-ivory hover:border-warm-ivory/30 transition-all duration-300 cursor-pointer"
            title={isAr ? 'عن الفكرة والتجربة' : 'Curatorial Note'}
            aria-label="Curatorial Note"
          >
            <Info size={14} />
          </button>
        </div>
      </header>

      {/* --- MOBILE NAVIGATION DRAWER / SHEET (100% OPAQUE SOLID SURFACE) --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-60 flex justify-end animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? 'قائمة التنقل' : 'Navigation Menu'}
        >
          {/* Backdrop Overlay (Solid Dark Opaque Backdrop) */}
          <div
            className="fixed inset-0 cursor-pointer"
            style={{ backgroundColor: 'rgba(5, 1, 3, 0.94)', backdropFilter: 'blur(16px)' }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Sliding Sheet (100% Solid Dark Surface) */}
          <div
            dir={isAr ? 'rtl' : 'ltr'}
            style={{ backgroundColor: '#0d0208' }}
            className={`relative z-10 w-full sm:w-96 max-w-[85vw] h-full bg-drawer-solid border-muted-gold/30 shadow-2xl flex flex-col justify-between p-5 overflow-y-auto ${
              isAr ? 'border-r' : 'border-l'
            }`}
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-muted-gold/20">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-editorial text-sm tracking-[0.25em] uppercase text-warm-ivory font-semibold">
                      THE RED ROOM
                    </span>
                    <span className="text-xs text-petal-red font-serif">🌹</span>
                  </div>
                  <span className="text-[11px] text-muted-gold/80 font-sans tracking-widest uppercase mt-0.5">
                    {isAr ? 'سما' : 'Sama'}
                  </span>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-w-[44px] min-h-[44px] p-2.5 rounded-full border border-warm-ivory/20 bg-white/5 text-warm-ivory/80 hover:text-white hover:border-muted-gold transition-colors flex items-center justify-center cursor-pointer touch-target"
                  aria-label={isAr ? 'إغلاق القائمة' : 'Close Menu'}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Special Features Cards */}
              <div className="mt-5 space-y-2.5">
                <span className="text-[10px] tracking-widest uppercase text-muted-gold/70 font-sans font-semibold">
                  {isAr ? 'تجارب مميزة' : 'FEATURED EXPERIENCES'}
                </span>

                {/* Spotify Music Corner Button */}
                <button
                  onClick={handleToggleMusicCorner}
                  className={`w-full min-h-[52px] p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                    isMusicCornerOpen
                      ? 'border-petal-red bg-rose-crimson/40 text-white shadow-[0_0_15px_rgba(214,40,69,0.3)]'
                      : 'border-muted-gold/40 bg-white/5 hover:bg-white/10 text-warm-ivory hover:border-muted-gold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[#1DB954]/15 border border-[#1DB954]/30 text-[#1DB954]">
                      <Spotify size={18} />
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="font-editorial text-sm text-warm-ivory font-medium">
                        {isAr ? 'ركن سما الموسيقي' : "Sama's Music Corner"}
                      </span>
                      <span className="text-[10px] text-muted-gold/80 font-sans">
                        {isAr ? 'أغاني عمرو دياب المختارة 🎵' : 'Curated Amr Diab Playlist'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-gold font-sans font-medium">
                    {isMusicCornerOpen ? (isAr ? 'مفتوح' : 'Active') : (isAr ? 'فتح' : 'Open')}
                  </span>
                </button>

                {/* Particle Heart Experiment Button */}
                <button
                  onClick={handleToggleParticleHeart}
                  className={`w-full min-h-[52px] p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                    isParticleHeartOpen
                      ? 'border-cyan-300 bg-cyan-950/60 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'border-cyan-400/40 bg-white/5 hover:bg-white/10 text-cyan-200 hover:border-cyan-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-400">
                      <Sparkles size={18} />
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="font-editorial text-sm text-cyan-100 font-medium">
                        {isAr ? 'تجربة صغيرة (المفاجأة)' : 'Mini Experiment'}
                      </span>
                      <span className="text-[10px] text-cyan-300/70 font-sans">
                        {isAr ? 'فن الكود والقلب المتداخل ✨' : 'Generative Particle Heart'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-cyan-300 font-sans font-medium">
                    {isParticleHeartOpen ? (isAr ? 'مفتوح' : 'Active') : (isAr ? 'تشغيل' : 'Start')}
                  </span>
                </button>
              </div>

              {/* Experience Chapters Navigation */}
              <div className="mt-6">
                <span className="text-[10px] tracking-widest uppercase text-muted-gold/70 font-sans font-semibold">
                  {isAr ? 'فصول التجربة' : 'EXPERIENCE CHAPTERS'}
                </span>

                <div className="mt-2.5 space-y-1.5">
                  {chapters.map((ch) => {
                    const isActive = currentScene === ch.id && !isMusicCornerOpen && !isParticleHeartOpen;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => handleSelectScene(ch.id)}
                        className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer touch-target ${
                          isActive
                            ? 'bg-rose-crimson/30 border border-petal-red/50 text-white font-medium shadow-[0_0_15px_rgba(214,40,69,0.25)]'
                            : 'bg-white/5 border border-transparent text-warm-ivory/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-editorial text-xs text-muted-gold font-bold w-5 text-center">
                            {ch.roman}
                          </span>
                          <span className="font-sans text-xs">
                            {isAr ? ch.titleAr : ch.titleEn}
                          </span>
                        </div>

                        {isActive && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-petal-red font-sans">
                              {isAr ? 'الحالي' : 'Active'}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-petal-red animate-pulse" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer Controls */}
            <div className="pt-5 mt-6 border-t border-muted-gold/20 space-y-3">
              {/* Language Switch Button (min 44px height) */}
              <button
                onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-warm-ivory/15 bg-white/5 hover:bg-white/10 text-warm-ivory text-xs flex items-center justify-between transition-colors cursor-pointer touch-target"
              >
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-muted-gold" />
                  <span>{isAr ? 'لغة العرض' : 'Display Language'}</span>
                </div>
                <span className="font-bold text-muted-gold">
                  {language === 'en' ? 'العربية' : 'English'}
                </span>
              </button>

              {/* Breeze Talisman */}
              <button
                onClick={() => {
                  soundscape.playPetalBreeze();
                  onTriggerBreeze();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-warm-ivory/15 bg-white/5 hover:bg-white/10 text-warm-ivory text-xs flex items-center justify-between transition-colors cursor-pointer touch-target"
              >
                <div className="flex items-center gap-2">
                  <Wind size={16} className="text-petal-red" />
                  <span>{isAr ? 'طيري شوية بتلات ورد' : 'Release Petal Breeze'}</span>
                </div>
                <span className="text-[11px] text-warm-ivory/50 font-serif">🌸</span>
              </button>

              {/* Curatorial Note Modal Trigger */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowCuratorialModal(true);
                }}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-warm-ivory/15 bg-white/5 hover:bg-white/10 text-warm-ivory/70 hover:text-white text-xs flex items-center justify-between transition-colors cursor-pointer touch-target"
              >
                <div className="flex items-center gap-2">
                  <Info size={16} />
                  <span>{isAr ? 'عن الفكرة والتجربة' : 'Curatorial Statement'}</span>
                </div>
                <span className="text-[10px] text-muted-gold">Info</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Curatorial Statement Dialog */}
      {showCuratorialModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(5, 1, 3, 0.94)', backdropFilter: 'blur(16px)' }}
        >
          <div
            style={{ backgroundColor: '#12030a' }}
            className="relative max-w-lg w-full bg-card-solid border border-muted-gold/30 rounded-2xl p-6 md:p-8 shadow-2xl text-warm-ivory"
          >
            <button
              onClick={() => setShowCuratorialModal(false)}
              className="absolute top-4 right-4 p-2.5 rounded-full text-warm-ivory/60 hover:text-warm-ivory hover:bg-white/5 transition-colors cursor-pointer touch-target"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-gold/80 font-sans block mb-2">
              {language === 'en' ? 'Curatorial Note' : 'عن الفكرة والتجربة'}
            </span>
            <h3 className="font-editorial text-2xl md:text-3xl font-light text-warm-ivory mb-4">
              {language === 'en' ? 'The Philosophy of The Red Room' : 'فكرة الغرفة الحمراء'}
            </h3>

            <div className="space-y-3 font-sans text-xs md:text-sm text-warm-ivory/80 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              {language === 'en' ? (
                <>
                  <p>
                    <strong>The Red Room</strong> was created as a thoughtful, artistic sanctuary for Sama.
                    Every petal, ambient chord, and line of code was crafted to evoke timeless warmth, sincere appreciation, and wonder.
                  </p>
                  <p>
                    The red rose symbolizes respect, joy, and lasting positive energy. May each chapter offer you a brief pause of beauty in a fast-paced world.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>الغرفة الحمراء</strong> معمولة كهدية رقمية مميزة وراقية لسما.
                    كل بتلة ورد، ونغمة صوت، وسطر كود معمول مخصوص عشان يعبّر عن التقدير الصادق، والبهجة، وأطيب الدعوات.
                  </p>
                  <p>
                    الورد الأحمر هنا رمز للخير والبهجة والذوق. يارب كل خطوة في الغرفة دي ترسم على وشك ابتسامة حلوة وتفرحك من قلبك.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowCuratorialModal(false)}
                className="px-6 py-2 rounded-full border border-muted-gold/50 bg-muted-gold/10 hover:bg-muted-gold/20 text-muted-gold text-xs tracking-widest uppercase transition-colors cursor-pointer touch-target"
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

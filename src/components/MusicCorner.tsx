import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Headphones, Spotify } from './Icons';
import { SPOTIFY_PLAYLIST } from '../data/music';
import type { Language } from '../types';

interface MusicCornerProps {
  language: Language;
  onClose: () => void;
}

export const MusicCorner: React.FC<MusicCornerProps> = ({
  language,
  onClose,
}) => {
  const [isVinylSpinning, setIsVinylSpinning] = useState(true);
  const isAr = language === 'ar';

  // Body Scroll Lock: Prevent background scrolling while Music Corner is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? 'ركن سما الموسيقي' : "Sama's Music Corner"}
      style={{ backgroundColor: '#070104' }}
      className="fixed inset-0 z-40 w-full h-full min-h-screen bg-obsidian-solid text-warm-ivory select-none overflow-y-auto flex flex-col animate-fade-in"
    >
      {/* Background Ambient Radial Glows (Completely Opaque Base) */}
      <div
        style={{ backgroundColor: '#070104' }}
        className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-obsidian-solid"
      >
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-rose-crimson/15 blur-[120px]" />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] rounded-full bg-wine-red/20 blur-[140px]" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34, 4, 18, 0.45) 0%, transparent 70%)' }}
        />
      </div>

      {/* Mobile-Only Sticky Top Bar (< 768px): Ensures Close Button is always easily reachable on phone */}
      <header
        style={{ backgroundColor: '#080105' }}
        className="mobile-only md:hidden sticky top-0 z-40 w-full px-4 py-3 flex items-center justify-between border-b border-muted-gold/25 shadow-2xl"
      >
        {/* Left: Spotify Branding & Title */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-[#1DB954]/15 border border-[#1DB954]/30 text-[#1DB954]">
            <Spotify size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-xs font-semibold tracking-wider text-warm-ivory">
              {isAr ? 'ركن سما الموسيقي' : "Sama's Soundtrack"}
            </span>
            <span className="text-[9px] text-muted-gold/80 font-sans tracking-widest uppercase">
              Amr Diab 🌹
            </span>
          </div>
        </div>

        {/* Right: Prominent 44px Touch Close Button */}
        <button
          onClick={onClose}
          className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full border border-warm-ivory/20 bg-white/5 hover:bg-rose-crimson/30 text-warm-ivory hover:text-white transition-all text-xs flex items-center gap-1.5 cursor-pointer touch-target"
          aria-label={isAr ? 'إغلاق ركن الموسيقى والرجوع للريد روم' : 'Close and Return to The Red Room'}
          title={isAr ? 'رجوع للريد روم' : 'Back to The Red Room'}
        >
          <X size={15} />
          <span className="font-sans font-medium text-xs">
            {isAr ? 'رجوع للريد روم' : 'The Red Room'}
          </span>
        </button>
      </header>

      {/* Main Scrollable Content (Padded to clear desktop header or mobile sticky bar) */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 md:pt-24 pb-12 flex-1 flex flex-col justify-start">
        {/* Section Header: Headphones Emblem & Curatorial Note */}
        <div className="flex flex-col items-center text-center space-y-3 pb-6 md:pb-8 border-b border-muted-gold/20">
          {/* Headphones Emblem with Flourish Wings */}
          <div className="flex items-center justify-center gap-3 text-muted-gold/80">
            <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent via-muted-gold/40 to-muted-gold/80" />
            <div className="p-2 sm:p-2.5 rounded-full bg-rose-crimson/25 border border-muted-gold/40 text-muted-gold shadow-[0_0_15px_rgba(214,40,69,0.3)]">
              <Headphones size={22} className="text-muted-gold" />
            </div>
            <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent via-muted-gold/40 to-muted-gold/80" />
          </div>

          {/* Main Title */}
          <div>
            <h2 className="font-editorial text-2xl sm:text-4xl md:text-5xl text-warm-ivory font-light tracking-wide drop-shadow-[0_2px_10px_rgba(214,40,69,0.3)]">
              {isAr ? 'ركن سما الموسيقي' : "Sama's Soundtrack"}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1.5 text-xs text-muted-gold tracking-[0.25em] uppercase font-sans font-medium">
              <span>Amr Diab</span>
              <span className="text-petal-red">•</span>
              <span>عمرو دياب</span>
            </div>
          </div>

          {/* Subtitle / Curation Note */}
          <p className="text-xs sm:text-sm text-warm-ivory/80 font-sans max-w-xl leading-relaxed">
            {isAr ? SPOTIFY_PLAYLIST.subtitleAr : SPOTIFY_PLAYLIST.subtitleEn}
          </p>

          {/* Friendly Egyptian Quote Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-near-black/70 border border-muted-gold/30 text-xs text-muted-gold font-sans shadow-inner">
            <span>✨</span>
            <span>
              {isAr ? SPOTIFY_PLAYLIST.friendlyNoteAr : SPOTIFY_PLAYLIST.friendlyNoteEn}
            </span>
          </div>
        </div>

        {/* --- MAIN STAGE: DESKTOP 2-COLUMN / MOBILE ELEGANT STACK --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start mt-6 md:mt-8">
          {/* Left Column (5 cols on Desktop, scaled banner on Mobile): Vintage Turntable */}
          <div className="col-span-1 md:col-span-5 flex flex-col items-center justify-center">
            {/* Turntable Plinth Case */}
            <div
              className="w-full bg-gradient-to-br from-[#280610] via-[#18040C] to-[#0D0206] border-2 border-muted-gold/35 rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.85),inset_0_0_20px_rgba(164,22,50,0.2)] relative overflow-hidden flex flex-col items-center"
              style={{ maxWidth: '360px' }}
            >
              {/* Brass Corner Guards */}
              <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-muted-gold/60" />
              <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-muted-gold/60" />
              <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-muted-gold/60" />
              <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-muted-gold/60" />

              {/* Case Inscription & Audio Equalizer Animation */}
              <div className="w-full flex items-center justify-between px-2 pb-2.5 mb-2 border-b border-muted-gold/20">
                <span className="font-editorial italic text-muted-gold text-sm tracking-wider font-semibold">
                  Amr Diab
                </span>
                <div className="flex items-end gap-1 h-3.5">
                  <span className="w-1 bg-petal-red/80 rounded-full animate-pulse h-2" style={{ animationDuration: '0.8s' }} />
                  <span className="w-1 bg-muted-gold/80 rounded-full animate-pulse h-3.5" style={{ animationDuration: '1.2s' }} />
                  <span className="w-1 bg-petal-red/80 rounded-full animate-pulse h-2.5" style={{ animationDuration: '0.9s' }} />
                  <span className="w-1 bg-muted-gold/80 rounded-full animate-pulse h-3" style={{ animationDuration: '1.4s' }} />
                </div>
              </div>

              {/* Spinning Vinyl Record Platter */}
              <div
                className="relative my-2 sm:my-3 p-2 rounded-full cursor-pointer group flex items-center justify-center"
                title={isAr ? 'انقري لإيقاف أو تشغيل دوران الأسطوانة' : 'Click to toggle vinyl rotation'}
                onClick={() => setIsVinylSpinning(!isVinylSpinning)}
              >
                {/* Turntable Outer Rim */}
                <div
                  className="absolute rounded-full border-2 border-muted-gold/50 shadow-[0_0_25px_rgba(185,154,104,0.35)] pointer-events-none"
                  style={{ width: '196px', height: '196px' }}
                />

                {/* Vinyl Disc Body with Sound Grooves */}
                <div
                  className={`rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.9),inset_0_0_25px_rgba(0,0,0,0.95)] flex items-center justify-center relative transition-transform duration-700 shrink-0 ${
                    isVinylSpinning ? 'animate-spin' : ''
                  }`}
                  style={{
                    width: '184px',
                    height: '184px',
                    animationDuration: '12s',
                    background:
                      'repeating-radial-gradient(circle, #222222, #222222 2px, #111111 3px, #111111 4px)',
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-white/10 pointer-events-none" />

                  {/* Vinyl Center Label */}
                  <div
                    className="rounded-full bg-gradient-to-tr from-wine-red via-rose-crimson to-petal-red border-2 border-muted-gold/70 flex flex-col items-center justify-center text-center p-1 shadow-md shrink-0"
                    style={{ width: '72px', height: '72px' }}
                  >
                    <span className="font-editorial text-[9px] text-warm-ivory font-bold uppercase tracking-wider leading-tight">
                      عمرو دياب
                    </span>
                    <span className="text-[7px] text-muted-gold font-sans font-medium tracking-wider">
                      STEREO
                    </span>
                    <div className="w-2 h-2 rounded-full bg-muted-gold border border-near-black mt-0.5" />
                  </div>
                </div>

                {/* Stylus Tone Arm */}
                <div className="absolute top-1 right-2 pointer-events-none transform rotate-12 origin-top-right">
                  <div className="w-1.5 h-20 bg-gradient-to-b from-muted-gold to-[#7A5F35] rounded-full shadow-md relative">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3.5 bg-muted-gold rounded-sm shadow border border-near-black/40" />
                  </div>
                </div>
              </div>

              {/* Footnotes */}
              <div className="w-full flex items-center justify-between pt-2.5 mt-auto border-t border-muted-gold/15 text-[10px] text-warm-ivory/60 font-sans">
                <span className="flex items-center gap-1">
                  <span>🌹</span>
                  <span>{isAr ? 'نسخة الغرفة الحمراء 🌹' : 'Velvet Edition'}</span>
                </span>
                <span className="text-muted-gold/80">33 ⅓ RPM</span>
              </div>
            </div>

            {/* Subtle Vinyl Hint */}
            <span className="text-[10px] text-warm-ivory/50 font-sans mt-2 tracking-wider text-center">
              {isAr ? 'أسطوانة فينيل كلاسيك معمولة ليكي' : 'Interactive vinyl installation'}
            </span>
          </div>

          {/* Right Column (7 cols on Desktop, 1 col on Mobile): Official Spotify Playlist */}
          <div className="col-span-1 md:col-span-7 flex flex-col space-y-4 w-full">
            {/* The Spotify Frame Container */}
            <div className="w-full bg-gradient-to-b from-[#18060E]/98 via-[#100308]/98 to-[#090205]/98 border border-muted-gold/40 rounded-2xl p-3.5 sm:p-5 shadow-[0_0_35px_rgba(214,40,69,0.22),0_20px_50px_rgba(0,0,0,0.85)] flex flex-col space-y-3">
              {/* Top Bar of the Frame: Spotify Brand & Status Indicator */}
              <div className="flex items-center justify-between pb-2.5 border-b border-warm-ivory/10">
                <div className="flex items-center gap-2">
                  <Spotify size={18} className="text-[#1DB954]" />
                  <span className="text-xs font-sans tracking-wide text-warm-ivory/90 font-medium">
                    {SPOTIFY_PLAYLIST.titleAr}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-muted-gold font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
                  <span>Spotify Embed</span>
                </div>
              </div>

              {/* The Exact Official Spotify Playlist Iframe (352px height) */}
              <div className="relative w-full rounded-xl overflow-hidden bg-black/80 min-h-[352px] flex items-center justify-center shadow-inner">
                <iframe
                  data-testid="embed-iframe"
                  style={{ borderRadius: '12px' }}
                  src={SPOTIFY_PLAYLIST.embedUrl}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Amr Diab Songs | أغاني عمرو دياب كلها"
                  className="w-full"
                />
              </div>

              {/* Direct Action Button: Open Full Playlist on Spotify (Matches user's reference image) */}
              <a
                href={SPOTIFY_PLAYLIST.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] py-3 px-6 rounded-full border border-muted-gold/50 bg-gradient-to-r from-wine-red/80 via-rose-crimson/50 to-wine-red/80 hover:from-wine-red hover:to-rose-crimson/70 text-warm-ivory text-xs sm:text-sm font-sans font-medium tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-[0_0_20px_rgba(185,154,104,0.2)] hover:shadow-[0_0_30px_rgba(214,40,69,0.4)] cursor-pointer group"
                aria-label={
                  isAr
                    ? 'افتح القائمة كاملة على Spotify'
                    : 'Open Full Playlist on Spotify'
                }
              >
                <Spotify size={18} className="text-[#1DB954] group-hover:scale-110 transition-transform" />
                <span className="font-sans font-semibold">
                  {isAr
                    ? 'افتح القائمة كاملة على Spotify'
                    : 'Open Full Playlist on Spotify'}
                </span>
                <ExternalLink size={14} className="text-muted-gold/80" />
              </a>
            </div>

            {/* Bottom Curation Stamp */}
            <div className="flex items-center justify-between px-2 text-[10px] text-warm-ivory/50 font-sans">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-gold/60" />
                <span>{isAr ? 'قائمة أغاني عمرو دياب المختارة' : 'Curated Playlist'}</span>
              </span>
              <span className="text-muted-gold/70 font-mono">ID: 0mkEN60nZx9TRX4vID27qH</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

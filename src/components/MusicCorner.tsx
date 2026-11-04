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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-near-black/92 backdrop-blur-2xl animate-fade-in overflow-y-auto select-none"
      role="dialog"
      aria-modal="true"
      aria-label={language === 'en' ? "Sama's Music Corner" : 'ركن سما الموسيقي'}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-rose-crimson/15 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-wine-red/20 blur-3xl" />
      </div>

      {/* Main Luxury Container */}
      <div className="relative w-full max-w-5xl my-auto bg-gradient-to-b from-[#1C0810]/98 via-[#13050A]/98 to-[#0B0205]/98 border border-muted-gold/40 rounded-3xl p-5 sm:p-8 md:p-10 text-warm-ivory shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(164,22,50,0.18)] flex flex-col overflow-hidden">
        {/* Subtle Decorative Rose Vine Pattern in Top Corners */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-radial from-petal-red/10 to-transparent pointer-events-none rounded-tl-3xl" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-muted-gold/10 to-transparent pointer-events-none rounded-tr-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full border border-warm-ivory/15 bg-white/5 text-warm-ivory/70 hover:text-warm-ivory hover:border-muted-gold/60 hover:bg-white/10 transition-all duration-300 z-30 cursor-pointer shadow-lg"
          aria-label={language === 'en' ? 'Close Music Corner' : 'إغلاق ركن الموسيقى'}
        >
          <X size={18} />
        </button>

        {/* Header Section (Matching the Reference Vision) */}
        <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-muted-gold/20">
          {/* Headphones Emblem with Ornamental Flourish Wings */}
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
              {language === 'en' ? "Sama's Soundtrack" : 'ركن سما الموسيقي'}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1.5 text-xs text-muted-gold tracking-[0.25em] uppercase font-sans font-medium">
              <span>Amr Diab</span>
              <span className="text-petal-red">•</span>
              <span>عمرو دياب</span>
            </div>
          </div>

          {/* Subtitle / Curation Note */}
          <p className="text-xs sm:text-sm text-warm-ivory/80 font-sans max-w-xl leading-relaxed">
            {language === 'en'
              ? SPOTIFY_PLAYLIST.subtitleEn
              : SPOTIFY_PLAYLIST.subtitleAr}
          </p>

          {/* Personal Friendly Quote Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-near-black/60 border border-muted-gold/30 text-xs text-muted-gold font-sans shadow-inner">
            <span>✨</span>
            <span>
              {language === 'en'
                ? SPOTIFY_PLAYLIST.friendlyNoteEn
                : SPOTIFY_PLAYLIST.friendlyNoteAr}
            </span>
          </div>
        </div>

        {/* Main Stage: Desktop 2-Column Installation / Mobile Optimized Stack */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center mt-6">
          {/* Left Column (5 cols): Vintage Velvet & Gold Turntable Installation (Desktop only) */}
          <div className="hidden md:flex md:col-span-5 flex-col items-center justify-center">
            <div
              className="w-full bg-gradient-to-br from-[#2A0711] via-[#1A050D] to-[#0E0307] border-2 border-muted-gold/35 rounded-2xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(164,22,50,0.15)] relative overflow-hidden flex flex-col items-center"
              style={{ maxWidth: '340px', minHeight: '390px' }}
            >
              {/* Brass Corner Guards */}
              <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-muted-gold/60" />
              <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-muted-gold/60" />
              <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-muted-gold/60" />
              <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-muted-gold/60" />

              {/* Case Lid Inscription: Amr Diab with Animated Sound Bars */}
              <div className="w-full flex items-center justify-between px-2 pb-3 mb-2 border-b border-muted-gold/20">
                <span className="font-editorial italic text-muted-gold text-sm tracking-wider font-semibold">
                  Amr Diab
                </span>
                {/* Audio Equalizer Bars Animation */}
                <div className="flex items-end gap-1 h-3.5">
                  <span className="w-1 bg-petal-red/80 rounded-full animate-pulse h-2" style={{ animationDuration: '0.8s' }} />
                  <span className="w-1 bg-muted-gold/80 rounded-full animate-pulse h-3.5" style={{ animationDuration: '1.2s' }} />
                  <span className="w-1 bg-petal-red/80 rounded-full animate-pulse h-2.5" style={{ animationDuration: '0.9s' }} />
                  <span className="w-1 bg-muted-gold/80 rounded-full animate-pulse h-3" style={{ animationDuration: '1.4s' }} />
                </div>
              </div>

              {/* Spinning Vinyl Record Platter */}
              <div
                className="relative my-3 p-2 rounded-full cursor-pointer group flex items-center justify-center"
                title={language === 'en' ? 'Click to toggle vinyl rotation' : 'انقري لإيقاف أو تشغيل دوران الأسطوانة'}
                onClick={() => setIsVinylSpinning(!isVinylSpinning)}
              >
                {/* Turntable Outer Rim with Gold Illumination */}
                <div
                  className="absolute rounded-full border-2 border-muted-gold/50 shadow-[0_0_25px_rgba(185,154,104,0.4)] pointer-events-none"
                  style={{ width: '228px', height: '228px' }}
                />

                {/* Vinyl Disc Body with Concentric Sound Grooves */}
                <div
                  className={`rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.9),inset_0_0_25px_rgba(0,0,0,0.95)] flex items-center justify-center relative transition-transform duration-700 shrink-0 ${
                    isVinylSpinning ? 'animate-spin' : ''
                  }`}
                  style={{
                    width: '216px',
                    height: '216px',
                    animationDuration: '12s',
                    background:
                      'repeating-radial-gradient(circle, #222222, #222222 2px, #111111 3px, #111111 4px)',
                  }}
                >
                  {/* Concentric Light Sheen Lines */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-white/10 pointer-events-none" />

                  {/* Vinyl Center Label (Rose Crimson velvet with gold seal) */}
                  <div
                    className="rounded-full bg-gradient-to-tr from-wine-red via-rose-crimson to-petal-red border-2 border-muted-gold/70 flex flex-col items-center justify-center text-center p-1 shadow-md shrink-0"
                    style={{ width: '82px', height: '82px' }}
                  >
                    <span className="font-editorial text-[10px] text-warm-ivory font-bold uppercase tracking-widest leading-tight">
                      عمرو دياب
                    </span>
                    <span className="text-[7px] text-muted-gold font-sans font-medium tracking-wider">
                      STEREO
                    </span>
                    <div className="w-2.5 h-2.5 rounded-full bg-muted-gold border border-near-black mt-0.5" />
                  </div>
                </div>

                {/* Stylus Tone Arm Overlay */}
                <div className="absolute top-1 right-2 pointer-events-none transform rotate-12 origin-top-right">
                  <div className="w-1.5 h-24 bg-gradient-to-b from-muted-gold to-[#7A5F35] rounded-full shadow-md relative">
                    {/* Stylus Head */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-4 bg-muted-gold rounded-sm shadow border border-near-black/40" />
                  </div>
                </div>
              </div>

              {/* Turntable Plinth Footnotes & Scattered Petals */}
              <div className="w-full flex items-center justify-between pt-3 mt-auto border-t border-muted-gold/15 text-[10px] text-warm-ivory/60 font-sans">
                <span className="flex items-center gap-1">
                  <span>🌹</span>
                  <span>{language === 'en' ? 'Velvet Edition' : 'نسخة الغرفة الحمراء 🌹'}</span>
                </span>
                <span className="text-muted-gold/80">33 ⅓ RPM</span>
              </div>
            </div>

            {/* Subtle Hint Under Turntable */}
            <span className="text-[10px] text-warm-ivory/50 font-sans mt-2 tracking-wider">
              {language === 'en' ? 'Interactive vinyl atmosphere' : 'أسطوانة فينيل كلاسيك معمولة ليكي'}
            </span>
          </div>

          {/* Right Column (7 cols on desktop, 12 cols on mobile): The Official Spotify Playlist Showcase */}
          <div className="col-span-1 md:col-span-7 flex flex-col space-y-4">
            {/* The Spotify Frame Container */}
            <div className="w-full bg-gradient-to-b from-[#18060E]/95 via-[#100308]/95 to-[#090205]/98 border border-muted-gold/40 rounded-2xl p-3.5 sm:p-5 shadow-[0_0_35px_rgba(214,40,69,0.22),0_20px_50px_rgba(0,0,0,0.85)] flex flex-col space-y-3">
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
              <div className="relative w-full rounded-xl overflow-hidden bg-black/60 min-h-[352px] flex items-center justify-center">
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

              {/* Direct Action Button: Open Full Playlist on Spotify */}
              <a
                href={SPOTIFY_PLAYLIST.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-full border border-muted-gold/50 bg-gradient-to-r from-wine-red/60 via-rose-crimson/35 to-wine-red/60 hover:from-wine-red/90 hover:to-rose-crimson/65 text-warm-ivory text-xs sm:text-sm font-sans font-medium tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-[0_0_20px_rgba(185,154,104,0.2)] hover:shadow-[0_0_30px_rgba(214,40,69,0.4)] cursor-pointer group"
                aria-label={
                  language === 'en'
                    ? 'Open Full Playlist on Spotify'
                    : 'اسمعي الأغاني كلها على Spotify'
                }
              >
                <Spotify size={18} className="text-[#1DB954] group-hover:scale-110 transition-transform" />
                <span className="font-sans font-semibold">
                  {language === 'en'
                    ? 'Open Full Playlist on Spotify'
                    : 'اسمعي الأغاني كلها على Spotify'}
                </span>
                <ExternalLink
                  size={14}
                  className="text-muted-gold/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

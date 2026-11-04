import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, Heart, Droplets, Compass } from './Icons';
import { ROSES_DATA } from '../data/roses';
import type { RoseData, Language } from '../types';
import { BotanicalRose } from './BotanicalRose';
import { soundscape } from '../utils/audio';

interface SceneGardenProps {
  language: Language;
  onProceedToLetter: () => void;
  onTriggerBreeze: () => void;
}

export const SceneGarden: React.FC<SceneGardenProps> = ({
  language,
  onProceedToLetter,
  onTriggerBreeze,
}) => {
  const [selectedRose, setSelectedRose] = useState<RoseData | null>(null);
  const [discoveredCount, setDiscoveredCount] = useState<Set<string>>(new Set());
  const [showSecretBloom, setShowSecretBloom] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);

  const handleRoseClick = (rose: RoseData, index: number) => {
    setSelectedRose(rose);
    soundscape.playRoseChime(index);

    setDiscoveredCount((prev) => {
      const updated = new Set(prev);
      updated.add(rose.id);
      if (updated.size >= 5 && !secretUnlocked) {
        setSecretUnlocked(true);
      }
      return updated;
    });
  };

  const handleSecretRoseClick = () => {
    soundscape.playBloomChime();
    setShowSecretBloom(true);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 pt-28 pb-32 sm:pt-20 sm:pb-24 select-none">
      {/* Header & Garden Guide */}
      <div className="z-10 text-center max-w-xl mx-auto mb-2">
        <span className="text-xs tracking-[0.3em] uppercase text-muted-gold/80 font-sans flex items-center justify-center gap-1.5">
          <Compass size={13} />
          {language === 'en' ? 'Act III — The Sanctuary' : 'الفصل التالت — جنينة الورد'}
        </span>
        <h2 className="font-editorial text-3xl sm:text-5xl text-warm-ivory mt-1 font-light tracking-wide">
          {language === 'en' ? 'The Living Garden' : 'جنينة الورد'}
        </h2>
        <p className="text-xs sm:text-sm text-warm-ivory/60 mt-1 font-sans">
          {language === 'en'
            ? 'Touch each blooming variety to listen to its whispering verse'
            : 'دوسي على أي وردة عشان تشوفي كلمتها وتسمعي صوتها 🌹'}
        </p>

        {/* Discovery tracker badge */}
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-warm-ivory/10 bg-near-black/40 text-[11px] text-warm-ivory/70 font-sans">
          <Sparkles size={11} className="text-muted-gold" />
          <span>
            {language === 'en'
              ? `${discoveredCount.size} of ${ROSES_DATA.length} roses explored`
              : `شوفتي ${discoveredCount.size} من أصل ${ROSES_DATA.length} وردات`}
          </span>
          {secretUnlocked && (
            <span className="text-petal-red font-medium animate-pulse ml-1">
              {language === 'en' ? '— Secret Bloom Revealed!' : '— في وردة زيادة ظهرت ليكي!'}
            </span>
          )}
        </div>
      </div>

      {/* Constellation Grid of Roses (Responsive: Desktop floating organic coordinates, Mobile interactive cards/gallery) */}
      <div className="relative w-full max-w-6xl min-h-[460px] sm:min-h-[520px] my-auto flex items-center justify-center z-10">
        {/* Render the 6 curated red roses */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 py-6 px-2 sm:px-6">
          {ROSES_DATA.map((rose, idx) => {
            const isDiscovered = discoveredCount.has(rose.id);

            return (
              <div
                key={rose.id}
                onClick={() => handleRoseClick(rose, idx)}
                className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                  isDiscovered
                    ? 'border-rose-crimson/30 bg-deep-burgundy/40 shadow-[0_4px_25px_rgba(94,16,33,0.3)]'
                    : 'border-warm-ivory/10 bg-near-black/30 hover:border-petal-red/40 hover:bg-wine-red/20'
                } hover:-translate-y-1.5`}
              >
                {/* Floating ambient glow on card hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-rose-crimson/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Rose Flower Element */}
                <div className="relative transition-transform duration-500 group-hover:scale-110">
                  <BotanicalRose
                    bloomProgress={1.0}
                    size={window.innerWidth < 640 ? 140 : 180}
                    glowColor={rose.colorHint}
                    hasDew={true}
                    hasGoldVeins={rose.id === 'aurea'}
                    isInteractive={false} // Container handles click
                  />
                </div>

                {/* Rose Info Tag */}
                <div className="mt-3 text-center z-10">
                  <h3 className="font-editorial text-sm sm:text-lg text-warm-ivory group-hover:text-petal-red transition-colors font-medium">
                    {language === 'en' ? rose.nameEn : rose.nameAr}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-muted-gold/80 italic font-sans block mt-0.5">
                    {rose.botanicalName}
                  </span>
                </div>

                {/* Little discovered indicator */}
                {isDiscovered && (
                  <span className="absolute top-3 right-3 text-petal-red opacity-80">
                    <Heart size={12} fill="#D62845" />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Secret 7th Golden Bloom (Rewards Curiosity after exploring 5 roses) */}
        {secretUnlocked && (
          <div
            onClick={handleSecretRoseClick}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer animate-pulse hover:scale-125 transition-transform duration-500 p-4 rounded-full bg-near-black/80 border border-muted-gold/70 shadow-[0_0_35px_rgba(235,198,138,0.7)]"
            title={language === 'en' ? 'Curiosity Rewarded: The Celestial Rose' : 'مفاجأة عشان لفيتي في الجنينة كلها'}
          >
            <BotanicalRose
              bloomProgress={1}
              size={90}
              glowColor="#B99A68"
              hasGoldVeins={true}
              isInteractive={false}
            />
          </div>
        )}
      </div>

      {/* Bottom Bar: Wind Breeze + Proceed to Letter */}
      <div className="z-20 mt-4 flex items-center justify-center gap-4">
        <button
          onClick={() => {
            soundscape.playPetalBreeze();
            onTriggerBreeze();
          }}
          className="px-5 py-2.5 rounded-full border border-warm-ivory/20 bg-near-black/50 hover:bg-white/10 text-warm-ivory/90 text-xs tracking-widest uppercase transition-all flex items-center gap-2"
        >
          <Droplets size={14} className="text-petal-red" />
          <span>{language === 'en' ? 'Breeze of Petals' : 'طيري الورد'}</span>
        </button>

        <button
          onClick={() => {
            soundscape.playBloomChime();
            onProceedToLetter();
          }}
          className="group inline-flex items-center gap-3 px-7 py-2.5 rounded-full border border-muted-gold/50 bg-rose-crimson/30 hover:bg-rose-crimson/50 text-warm-ivory text-xs tracking-[0.22em] uppercase font-medium transition-all shadow-lg hover:shadow-[0_0_20px_rgba(214,40,69,0.4)]"
        >
          <span>{language === 'en' ? 'Read The Message' : 'شوفي الجواب'}</span>
          <ArrowRight
            size={14}
            className="text-muted-gold group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
      </div>

      {/* Selected Rose Poetic Inspection Modal */}
      {selectedRose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-near-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-lg w-full bg-deep-burgundy/95 border border-muted-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-warm-ivory">
            {/* Close Button */}
            <button
              onClick={() => setSelectedRose(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-warm-ivory/60 hover:text-warm-ivory hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Botanical Showcase */}
            <div className="flex flex-col items-center text-center">
              <div className="relative -mt-2 mb-2">
                <BotanicalRose
                  bloomProgress={1}
                  size={190}
                  glowColor={selectedRose.colorHint}
                  hasDew={true}
                  hasGoldVeins={selectedRose.id === 'aurea'}
                  isInteractive={false}
                />
              </div>

              <span className="text-[11px] tracking-[0.28em] uppercase text-muted-gold font-sans font-medium">
                {selectedRose.botanicalName}
              </span>

              <h3 className="font-editorial text-2xl sm:text-3xl text-warm-ivory mt-1">
                {language === 'en' ? selectedRose.nameEn : selectedRose.nameAr}
              </h3>

              {/* Poetic Verse with editorial quote */}
              <blockquote className="my-5 px-4 py-3 border-y border-muted-gold/20 font-editorial italic text-lg sm:text-xl text-warm-ivory/95 leading-relaxed font-light">
                {language === 'en'
                  ? `“${selectedRose.poeticVerseEn}”`
                  : `“${selectedRose.poeticVerseAr}”`}
              </blockquote>

              {/* Fragrance Profile & Note */}
              <div className="w-full text-left space-y-2 text-xs sm:text-sm font-sans bg-black/25 p-4 rounded-xl border border-warm-ivory/10">
                <div className="flex items-center gap-2 text-muted-gold">
                  <Sparkles size={13} />
                  <span className="uppercase tracking-widest text-[10px] font-semibold">
                    {language === 'en' ? 'Fragrance Essence' : 'ريحة الوردة'}
                  </span>
                </div>
                <p className="text-warm-ivory/80 italic font-editorial text-sm">
                  {selectedRose.fragranceProfile}
                </p>

                <p className="text-warm-ivory/60 text-xs border-t border-white/5 pt-2">
                  {language === 'en' ? selectedRose.personalityEn : selectedRose.personalityAr}
                </p>
              </div>

              {/* Pluck / Dismiss button */}
              <button
                onClick={() => {
                  soundscape.playPetalBreeze();
                  setSelectedRose(null);
                  onTriggerBreeze();
                }}
                className="mt-6 px-6 py-2 rounded-full border border-rose-crimson/50 bg-rose-crimson/20 hover:bg-rose-crimson/40 text-warm-ivory text-xs tracking-widest uppercase transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Embrace & Return' : 'شوفيها براحتك 🌹'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secret 7th Bloom Modal */}
      {showSecretBloom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-near-black/90 backdrop-blur-xl animate-fade-in">
          <div className="relative max-w-md w-full bg-deep-burgundy/90 border border-muted-gold/60 rounded-3xl p-6 sm:p-8 text-center text-warm-ivory shadow-2xl">
            <button
              onClick={() => setShowSecretBloom(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-warm-ivory/60 hover:text-warm-ivory cursor-pointer"
            >
              <X size={18} />
            </button>

            <span className="text-xs uppercase tracking-[0.3em] text-muted-gold">
              {language === 'en' ? 'Curiosity Rewarded' : 'مفاجأة ليكي ✨'}
            </span>

            <div className="my-3 flex justify-center">
              <BotanicalRose
                bloomProgress={1}
                size={180}
                glowColor="#EBC68A"
                hasGoldVeins={true}
                isInteractive={false}
              />
            </div>

            <h3 className="font-editorial text-2xl text-warm-ivory">
              {language === 'en' ? 'The Rose of Sama' : 'وردة سما'}
            </h3>

            <p className="font-editorial italic text-base sm:text-lg text-muted-gold my-3 leading-relaxed">
              {language === 'en'
                ? '“To spread positivity, joy, and sincere kindness is the truest art of friendship.”'
                : '“إنك تكوني سبب في ضحكة حد أو يومه يبقى أروق، دي أحلى حاجة ممكن تعمليها.”'}
            </p>

            <button
              onClick={() => setShowSecretBloom(false)}
              className="mt-4 px-6 py-2 rounded-full border border-muted-gold/50 bg-muted-gold/15 text-muted-gold text-xs tracking-widest uppercase hover:bg-muted-gold/30 transition-colors cursor-pointer"
            >
              {language === 'en' ? 'Return to Garden' : 'رجوع للجنينة'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

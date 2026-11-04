import React, { useState } from 'react';
import { Mail, Sparkles, ArrowRight, Heart, Laugh, Spotify } from './Icons';
import type { Language } from '../types';
import { soundscape } from '../utils/audio';

interface SceneLetterProps {
  language: Language;
  onProceedToSurprise: () => void;
  onOpenMusicCorner?: () => void;
}

export const SceneLetter: React.FC<SceneLetterProps> = ({
  language,
  onProceedToSurprise,
  onOpenMusicCorner,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sealBroken, setSealBroken] = useState(false);

  const handleOpenLetter = () => {
    if (isOpen) return;
    setSealBroken(true);
    soundscape.playBloomChime();
    setTimeout(() => {
      setIsOpen(true);
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 pt-20 pb-28 sm:pb-20 overflow-hidden select-none">
      {/* Background warm candlelight glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-rose-crimson/15 blur-[140px] pointer-events-none" />

      {/* Chapter Marker */}
      <div className="z-10 text-center mb-6">
        <span className="text-xs tracking-[0.3em] uppercase text-muted-gold/80 font-sans flex items-center justify-center gap-1.5">
          <Mail size={13} />
          {language === 'en' ? 'Act IV — Friendly Wishes' : 'الفصل الرابع — رسالة ليكي من القلب'}
        </span>
        <h2 className="font-editorial text-3xl sm:text-4xl text-warm-ivory mt-1 font-light tracking-wide">
          {language === 'en' ? 'A Letter for Sama' : 'كلمتين من القلب لسما'}
        </h2>
      </div>

      {/* Sealed Envelope State */}
      {!isOpen ? (
        <div className="z-10 flex flex-col items-center animate-fade-in max-w-md w-full">
          <div
            onClick={handleOpenLetter}
            className={`group relative w-full h-[260px] sm:h-[300px] bg-gradient-to-br from-[#200A11] to-[#120508] border border-muted-gold/40 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer shadow-[0_15px_45px_rgba(0,0,0,0.8)] transition-all duration-700 hover:border-muted-gold hover:shadow-[0_0_35px_rgba(214,40,69,0.35)] ${
              sealBroken ? 'scale-95 opacity-50 blur-sm' : 'hover:-translate-y-1'
            }`}
            role="button"
            tabIndex={0}
            aria-label="Unseal the Letter"
          >
            {/* Linen paper texture overlay */}
            <div className="absolute inset-0 rounded-2xl border border-warm-ivory/10 pointer-events-none" />

            {/* Address Line in luxury serif */}
            <div className="text-center mb-6">
              <span className="text-[10px] tracking-[0.3em] uppercase text-muted-gold/70 font-sans block mb-1">
                {language === 'en' ? 'Warmly Written For' : 'مكتوبة بكل حب لصاحبتنا'}
              </span>
              <span className="font-editorial text-3xl sm:text-4xl text-warm-ivory tracking-[0.18em]">
                S A M A
              </span>
            </div>

            {/* Ornate Wax Seal */}
            <div className="relative group-hover:scale-110 transition-transform duration-500">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#650014] via-[#A41632] to-[#E63956] border-2 border-[#D62845] flex items-center justify-center shadow-[0_4px_20px_rgba(164,22,50,0.8)]">
                <span className="font-editorial text-2xl sm:text-3xl font-bold text-warm-ivory/90 select-none drop-shadow-md">
                  S
                </span>
              </div>
              <div className="absolute -inset-2 rounded-full border border-muted-gold/40 animate-pulse pointer-events-none" />
            </div>

            {/* Instruction Callout */}
            <p className="mt-6 text-xs tracking-[0.25em] uppercase text-muted-gold font-sans font-medium flex items-center gap-2">
              <Sparkles size={12} />
              {language === 'en' ? 'Touch the Seal to Open' : 'دوسي على الختم عشان تفتحي الجواب'}
            </p>
          </div>
        </div>
      ) : (
        /* Unfolded Luxury Stationery Letter */
        <div className="z-10 max-w-xl w-full bg-[#1A0A0F]/95 backdrop-blur-2xl border border-muted-gold/50 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] animate-scale-up text-warm-ivory">
          {/* Letterhead Header */}
          <div className="flex items-center justify-between border-b border-muted-gold/30 pb-4 mb-6">
            <div className="flex items-center gap-2 text-muted-gold">
              <Heart size={15} fill="#B99A68" className="opacity-90" />
              <span className="font-editorial text-sm tracking-widest uppercase">
                {language === 'en' ? 'A Warm Wish For Sama' : 'من القلب لسما'}
              </span>
            </div>
            <span className="font-amiri text-xl text-muted-gold italic font-bold">سما</span>
          </div>

          {/* Letter Body */}
          {language === 'en' ? (
            <div className="space-y-4 text-warm-ivory/90 font-editorial text-lg sm:text-xl leading-relaxed font-light">
              <p className="text-2xl sm:text-3xl font-normal text-muted-gold mb-3">
                Dear Sama,
              </p>

              <p>
                May your days always be filled with goodness, peace of mind, and genuine happiness. May God grant you all the dreams you aspire to, provide for you from sources you never expected, open every door of success and good fortune, and keep away anything that troubles your heart.
              </p>

              <p>
                I hope you always see yourself thriving in the places you've dreamed of reaching, while forever keeping that beautiful spirit and wonderful laugh of yours.
              </p>

              {/* Inside Joke Box */}
              <div className="p-4 rounded-2xl bg-muted-gold/10 border border-muted-gold/30 my-4 flex items-center gap-3">
                <Laugh size={24} className="text-muted-gold shrink-0" />
                <p className="font-sans text-xs sm:text-sm text-warm-ivory/90 leading-relaxed">
                  And by the way... try not to turn into <strong>'Sayed'</strong> any more than this! 😂<br />
                  <span className="text-muted-gold font-medium">Just stay Sama, always!</span>
                </p>
              </div>

              <div className="pt-3 border-t border-muted-gold/20 flex flex-col items-end">
                <span className="text-xs font-sans tracking-widest uppercase text-muted-gold/80">
                  May everything ahead be even better ❤️
                </span>
                <span className="font-editorial text-2xl text-warm-ivory mt-1">
                  The Red Room
                </span>
              </div>
            </div>
          ) : (
            <div dir="rtl" className="space-y-4 text-warm-ivory/95 font-amiri text-xl sm:text-2xl leading-relaxed">
              <p className="text-3xl sm:text-4xl font-bold text-muted-gold mb-3">
                يا سما،
              </p>

              <p>
                يارب أيامك تكون مليانة خير وراحة بال، وربنا يحقق لك كل الأحلام اللي نفسك فيها، ويرزقك من حيث لا تحتسبي، ويفتح لك أبواب الخير والتوفيق، ويبعد عنك كل حاجة تضايقك.
              </p>

              <p>
                يارب تشوفي نفسك دايمًا في المكان اللي بتحلمي توصلي له، وتفضلي محافظة على روحك الحلوة وضحكتك.
              </p>

              {/* Inside Joke Box in Arabic */}
              <div className="p-4 rounded-2xl bg-muted-gold/10 border border-muted-gold/30 my-4 flex items-center gap-3">
                <Laugh size={26} className="text-muted-gold shrink-0" />
                <p className="font-sans text-sm sm:text-base text-warm-ivory/95 leading-relaxed font-normal">
                  وبالمناسبة، حاولي متتحوليش <strong>لسيد</strong> أكتر من كده 😂<br />
                  <span className="text-muted-gold font-semibold">خليكي سما وبس!</span>
                </p>
              </div>

              <div className="pt-3 border-t border-muted-gold/20 flex flex-col items-start">
                <span className="text-xs font-sans tracking-widest uppercase text-muted-gold/80">
                  كل اللي جاي ليكي يكون أحلى ❤️
                </span>
                <span className="font-editorial text-2xl text-warm-ivory mt-1">
                  الغرفة الحمراء
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons: Amr Diab Music Corner + Final Surprise */}
          <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onOpenMusicCorner && (
              <button
                onClick={onOpenMusicCorner}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-muted-gold/50 bg-rose-crimson/25 hover:bg-rose-crimson/40 text-warm-ivory text-xs tracking-widest uppercase font-sans font-medium transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_15px_rgba(214,40,69,0.3)] hover:border-muted-gold"
              >
                <Spotify size={16} className="text-[#1DB954]" />
                <span>{language === 'en' ? 'Sama’s Music Corner' : 'ركن المزيكا'}</span>
              </button>
            )}

            <button
              onClick={() => {
                soundscape.playBloomChime();
                onProceedToSurprise();
              }}
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 py-3 rounded-full border border-muted-gold bg-wine-red/40 hover:bg-rose-crimson/50 text-warm-ivory text-xs tracking-[0.25em] uppercase font-sans font-medium transition-all shadow-[0_0_25px_rgba(214,40,69,0.3)] hover:shadow-[0_0_35px_rgba(214,40,69,0.5)] cursor-pointer"
            >
              <span>{language === 'en' ? 'The Final Chapter' : 'آخر مفاجأة ليكي ✨'}</span>
              <ArrowRight
                size={14}
                className="text-muted-gold group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

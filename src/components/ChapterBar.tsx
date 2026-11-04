import React from 'react';
import { ChevronLeft, ChevronRight } from './Icons';
import type { Language, SceneId } from '../types';

interface ChapterBarProps {
  currentScene: SceneId;
  onSceneChange: (scene: SceneId) => void;
  language: Language;
}

export const ChapterBar: React.FC<ChapterBarProps> = ({
  currentScene,
  onSceneChange,
  language,
}) => {
  const chapters: { id: SceneId; roman: string; titleEn: string; titleAr: string }[] = [
    { id: 1, roman: 'I', titleEn: 'Invitation', titleAr: 'البداية' },
    { id: 2, roman: 'II', titleEn: 'The Bloom', titleAr: 'الوردة' },
    { id: 3, roman: 'III', titleEn: 'Garden', titleAr: 'الجنينة' },
    { id: 4, roman: 'IV', titleEn: 'The Letter', titleAr: 'الجواب' },
    { id: 5, roman: 'V', titleEn: 'Finale', titleAr: 'المفاجأة' },
  ];

  const handlePrev = () => {
    if (currentScene > 1) {
      onSceneChange((currentScene - 1) as SceneId);
    }
  };

  const handleNext = () => {
    if (currentScene < 5) {
      onSceneChange((currentScene + 1) as SceneId);
    }
  };

  return (
    <footer className="fixed bottom-6 left-0 right-0 z-40 px-4 flex flex-col items-center gap-2 pointer-events-none">
      <div className="flex items-center gap-2 md:gap-4 px-4 py-2 rounded-full border border-warm-ivory/15 bg-near-black/60 backdrop-blur-xl shadow-2xl pointer-events-auto">
        {/* Previous Scene Button */}
        <button
          onClick={handlePrev}
          disabled={currentScene === 1}
          className={`p-1.5 rounded-full text-warm-ivory/70 transition-all ${
            currentScene === 1
              ? 'opacity-20 cursor-not-allowed'
              : 'hover:text-warm-ivory hover:bg-white/10 active:scale-95'
          }`}
          aria-label="Previous Scene"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Chapter Indicators */}
        <div className="flex items-center gap-1 sm:gap-2">
          {chapters.map((ch) => {
            const isActive = currentScene === ch.id;
            const isVisited = currentScene > ch.id;

            return (
              <button
                key={ch.id}
                onClick={() => onSceneChange(ch.id)}
                className={`group relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-rose-crimson/30 text-warm-ivory border border-rose-crimson/60 shadow-[0_0_12px_rgba(214,40,69,0.3)]'
                    : isVisited
                    ? 'bg-transparent text-warm-ivory/70 hover:text-warm-ivory hover:bg-white/5 border border-transparent'
                    : 'bg-transparent text-warm-ivory/40 hover:text-warm-ivory/70 border border-transparent'
                }`}
                aria-label={`Go to Chapter ${ch.roman}`}
              >
                <span className="font-editorial text-xs tracking-wider">{ch.roman}</span>
                <span className="hidden md:inline text-[10px] tracking-widest uppercase font-sans">
                  {language === 'en' ? ch.titleEn : ch.titleAr}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-petal-red animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Next Scene Button */}
        <button
          onClick={handleNext}
          disabled={currentScene === 5}
          className={`p-1.5 rounded-full text-warm-ivory/70 transition-all ${
            currentScene === 5
              ? 'opacity-20 cursor-not-allowed'
              : 'hover:text-warm-ivory hover:bg-white/10 active:scale-95'
          }`}
          aria-label="Next Scene"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </footer>
  );
};

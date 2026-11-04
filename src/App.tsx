import { useState, useEffect, useRef } from 'react';
import type { SceneId, Language } from './types';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { CustomCursor } from './components/CustomCursor';
import { Navigation } from './components/Navigation';
import { ChapterBar } from './components/ChapterBar';
import { SceneInvitation } from './components/SceneInvitation';
import { SceneBloom } from './components/SceneBloom';
import { SceneGarden } from './components/SceneGarden';
import { SceneLetter } from './components/SceneLetter';
import { SceneSurprise } from './components/SceneSurprise';
import { MusicCorner } from './components/MusicCorner';
import { ParticleHeartModal } from './components/ParticleHeartModal';
import { soundscape } from './utils/audio';

export function App() {
  const [currentScene, setCurrentScene] = useState<SceneId>(1);
  const [language, setLanguage] = useState<Language>('en');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showMusicCorner, setShowMusicCorner] = useState(false);
  const [showParticleHeart, setShowParticleHeart] = useState(false);
  const petalBurstFnRef = useRef<(() => void) | null>(null);

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentScene((prev) => (prev < 5 ? ((prev + 1) as SceneId) : prev));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentScene((prev) => (prev > 1 ? ((prev - 1) as SceneId) : prev));
      } else if (e.key.toLowerCase() === 'm') {
        handleToggleSound();
      } else if (e.key.toLowerCase() === 'l') {
        setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
      } else if (e.key.toLowerCase() === 'u') {
        setShowMusicCorner((prev) => !prev);
      } else if (e.key.toLowerCase() === 'h') {
        setShowParticleHeart((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSound = async () => {
    const active = await soundscape.toggleSound();
    setSoundEnabled(active);
  };

  const handleTriggerBreeze = () => {
    if (petalBurstFnRef.current) {
      petalBurstFnRef.current();
    }
  };

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={`relative min-h-screen w-full bg-near-black text-warm-ivory overflow-x-hidden select-none font-sans ${
        language === 'ar' ? 'font-amiri' : ''
      }`}
    >
      {/* Background Interactive Ambient Canvas with Falling Petals and Dust */}
      <BackgroundCanvas
        intensity={currentScene === 5 ? 1.4 : 1.0}
        onPetalBurstTrigger={(fn) => {
          petalBurstFnRef.current = fn;
        }}
      />

      {/* Luxury Custom Cursor (desktop only) */}
      <CustomCursor />

      {/* Top Header Navigation */}
      <Navigation
        currentScene={currentScene}
        language={language}
        onLanguageChange={setLanguage}
        onTriggerBreeze={handleTriggerBreeze}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenMusicCorner={() => {
          setShowParticleHeart(false);
          setShowMusicCorner(true);
        }}
        onCloseMusicCorner={() => setShowMusicCorner(false)}
        isMusicCornerOpen={showMusicCorner}
        onOpenParticleHeart={() => {
          setShowMusicCorner(false);
          setShowParticleHeart(true);
        }}
        onCloseParticleHeart={() => setShowParticleHeart(false)}
        isParticleHeartOpen={showParticleHeart}
        onSceneChange={(scene) => {
          setShowMusicCorner(false);
          setShowParticleHeart(false);
          setCurrentScene(scene);
        }}
      />

      {/* Main Experience Stage with Transition Animations (Completely hidden when Music Corner or Particle Heart is open) */}
      <main
        aria-hidden={showMusicCorner || showParticleHeart}
        className={`${
          showMusicCorner ? 'hidden' : 'relative z-10 w-full min-h-screen flex flex-col items-center justify-start sm:justify-center'
        }`}
      >
        {currentScene === 1 && (
          <SceneInvitation
            language={language}
            onEnter={() => setCurrentScene(2)}
          />
        )}

        {currentScene === 2 && (
          <SceneBloom
            language={language}
            onContinue={() => setCurrentScene(3)}
          />
        )}

        {currentScene === 3 && (
          <SceneGarden
            language={language}
            onProceedToLetter={() => setCurrentScene(4)}
            onTriggerBreeze={handleTriggerBreeze}
          />
        )}

        {currentScene === 4 && (
          <SceneLetter
            language={language}
            onProceedToSurprise={() => setCurrentScene(5)}
            onOpenMusicCorner={() => setShowMusicCorner(true)}
          />
        )}

        {currentScene === 5 && (
          <SceneSurprise
            language={language}
            onReplay={() => setCurrentScene(1)}
          />
        )}
      </main>

      {/* Sama's Music Corner Modal (Lazy Loaded, 100% Isolated Full-Screen Surface) */}
      {showMusicCorner && (
        <MusicCorner
          language={language}
          onClose={() => setShowMusicCorner(false)}
        />
      )}

      {/* Interactive Nested Particle Heart Experience (Lazy Loaded, Unmounted when closed) */}
      {showParticleHeart && (
        <ParticleHeartModal
          language={language}
          onClose={() => setShowParticleHeart(false)}
        />
      )}

      {/* Bottom Chapter Progress Bar (Hidden when Music Corner or Particle Heart is active) */}
      {!showMusicCorner && (
        <ChapterBar
          currentScene={currentScene}
          onSceneChange={setCurrentScene}
          language={language}
        />
      )}
    </div>
  );
}

export default App;

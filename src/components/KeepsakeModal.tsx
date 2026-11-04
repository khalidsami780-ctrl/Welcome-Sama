import React, { useRef, useState } from 'react';
import { Download, Copy, Check, X, Sparkles } from './Icons';
import type { Language } from '../types';

interface KeepsakeModalProps {
  language: Language;
  onClose: () => void;
}

export const KeepsakeModal: React.FC<KeepsakeModalProps> = ({
  language,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Velvet Background
    const bgGrad = ctx.createRadialGradient(600, 800, 50, 600, 800, 900);
    bgGrad.addColorStop(0, '#3A0A16');
    bgGrad.addColorStop(0.5, '#20050D');
    bgGrad.addColorStop(1, '#100307');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 1600);

    // 2. Gold Filigree Border
    ctx.strokeStyle = '#B99A68';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, 1080, 1480);

    ctx.strokeStyle = 'rgba(185, 154, 104, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(75, 75, 1050, 1450);

    // 3. Corner Ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = '#B99A68';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 25);
      ctx.lineTo(25, 25);
      ctx.lineTo(25, 0);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(90, 90, 0);
    drawCorner(1110, 90, Math.PI / 2);
    drawCorner(1110, 1510, Math.PI);
    drawCorner(90, 1510, -Math.PI / 2);

    // 4. Header Typography
    ctx.textAlign = 'center';
    ctx.fillStyle = '#B99A68';
    ctx.font = '300 24px sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillText('THE RED ROOM', 600, 180);

    ctx.font = '300 18px sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillStyle = 'rgba(244, 233, 223, 0.6)';
    ctx.fillText('BOTANICAL ART DEDICATION', 600, 220);

    // 5. Central Rose Emblem
    const roseGlow = ctx.createRadialGradient(600, 600, 0, 600, 600, 250);
    roseGlow.addColorStop(0, 'rgba(214, 40, 69, 0.4)');
    roseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = roseGlow;
    ctx.beginPath();
    ctx.arc(600, 600, 250, 0, Math.PI * 2);
    ctx.fill();

    // Stylized Central Blossom
    ctx.fillStyle = '#D62845';
    ctx.beginPath();
    ctx.arc(600, 600, 70, 0, Math.PI * 2);
    ctx.fill();

    // Outer Petal Waves
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.fillStyle = i % 2 === 0 ? '#A41632' : '#C41E3A';
      ctx.beginPath();
      ctx.arc(
        600 + Math.cos(angle) * 80,
        600 + Math.sin(angle) * 80,
        65,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Golden Core
    ctx.fillStyle = '#FDE68A';
    ctx.beginPath();
    ctx.arc(600, 600, 18, 0, Math.PI * 2);
    ctx.fill();

    // 6. Dedication to S A M A
    ctx.fillStyle = '#F4E9DF';
    ctx.font = '300 70px "Cormorant Garamond", serif';
    ctx.letterSpacing = '14px';
    ctx.fillText('S A M A', 600, 920);

    ctx.font = '400 36px "Amiri", serif';
    ctx.fillStyle = '#B99A68';
    ctx.fillText('سَمَا', 600, 980);

    // 7. Poetic Inscription
    ctx.fillStyle = '#F4E9DF';
    ctx.font = 'italic 300 28px "Cormorant Garamond", serif';
    ctx.fillText(
      '“May your days be filled with peace of mind, goodness, and radiant dreams.”',
      600,
      1120
    );

    ctx.font = '300 22px sans-serif';
    ctx.fillStyle = 'rgba(244, 233, 223, 0.7)';
    ctx.fillText('A small floral corner, created with sincere appreciation for you.', 600, 1180);

    // 8. Seal & Date
    const today = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    ctx.fillStyle = '#B99A68';
    ctx.font = '300 18px sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(`A GIFT FOR SAMA • ${today.toUpperCase()}`, 600, 1420);

    // Trigger download
    const link = document.createElement('a');
    link.download = `The-Red-Room-For-Sama.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyQuote = () => {
    const text =
      language === 'en'
        ? `“May your days always be filled with goodness, peace of mind, and genuine happiness. Keep your wonderful spirit and laugh!” — The Red Room for Sama`
        : `“يارب أيامك تكون مليانة خير وراحة بال، وربنا يحقق لك كل الأحلام اللي نفسك فيها، وتفضلي محافظة على روحك الحلوة وضحكتك!” — الغرفة الحمراء لسما`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-near-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative max-w-lg w-full bg-[#18060B] border border-muted-gold/50 rounded-3xl p-6 sm:p-8 text-warm-ivory shadow-[0_25px_70px_rgba(0,0,0,0.9)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-warm-ivory/60 hover:text-warm-ivory hover:bg-white/5 cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-gold font-sans flex items-center justify-center gap-1.5 mb-2">
            <Sparkles size={12} />
            {language === 'en' ? 'Botanical Keepsake' : 'كارت تذكاري'}
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl text-warm-ivory">
            {language === 'en' ? 'A Keepsake for Sama' : 'كارت مخصوص لسما 🌹'}
          </h3>
          <p className="text-xs sm:text-sm text-warm-ivory/70 mt-1 font-sans">
            {language === 'en'
              ? 'Download your high-resolution editorial botanical card or copy the dedication.'
              : 'تقدري تحملي الكارت كصورة أو تنسخي الكلام اللطيف ده تخليه معاكي.'}
          </p>
        </div>

        {/* Visual Preview Card */}
        <div className="my-6 p-6 rounded-2xl border border-muted-gold/30 bg-deep-burgundy/60 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-crimson/20 rounded-full blur-2xl" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-muted-gold/70 block">
            THE RED ROOM
          </span>
          <h4 className="font-editorial text-3xl text-warm-ivory tracking-widest my-2">
            S A M A
          </h4>
          <p className="font-editorial italic text-sm text-warm-ivory/90 leading-relaxed">
            {language === 'en'
              ? '“May your days be filled with peace of mind, kindness, and radiant dreams.”'
              : '“يارب أيامك تكون مليانة خير وراحة بال وتفضلي محافظة على روحك الحلوة!”'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDownload}
            className="w-full sm:w-1/2 py-3 px-4 rounded-full border border-muted-gold bg-muted-gold/15 hover:bg-muted-gold/30 text-muted-gold text-xs tracking-widest uppercase font-sans font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span>{language === 'en' ? 'Download Image' : 'نزّلي الصورة'}</span>
          </button>

          <button
            onClick={handleCopyQuote}
            className="w-full sm:w-1/2 py-3 px-4 rounded-full border border-warm-ivory/20 bg-near-black/40 hover:bg-white/10 text-warm-ivory text-xs tracking-widest uppercase font-sans font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            <span>
              {copied
                ? language === 'en'
                  ? 'Copied to Clipboard!'
                  : 'اتنسخ خلاص ✨'
                : language === 'en'
                ? 'Copy Inscription'
                : 'انسخي الكلام'}
            </span>
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

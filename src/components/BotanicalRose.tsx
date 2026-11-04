import React, { useState } from 'react';

interface BotanicalRoseProps {
  bloomProgress?: number; // 0 (bud) to 1 (full bloom)
  isInteractive?: boolean;
  size?: number;
  glowColor?: string;
  hasDew?: boolean;
  hasGoldVeins?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export const BotanicalRose: React.FC<BotanicalRoseProps> = ({
  bloomProgress = 1,
  isInteractive = true,
  size = 280,
  glowColor = '#D62845',
  hasDew = true,
  hasGoldVeins = false,
  onClick,
  className = '',
  ariaLabel = 'Red Rose',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Clamped bloom progress between 0 and 1
  const b = Math.max(0, Math.min(1, bloomProgress));

  // Calculated expansion factors for botanical layers
  const outerPetalScale = 0.55 + b * 0.45;
  const outerAngle = b * 18; // degrees rotation
  const midPetalScale = 0.65 + b * 0.35;
  const midAngle = -b * 14;
  const innerPetalScale = 0.8 + b * 0.2;
  const stamenOpacity = Math.max(0, (b - 0.6) * 2.5);

  return (
    <div
      className={`relative select-none flex items-center justify-center transition-transform duration-700 ${
        isInteractive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
      style={{
        width: size,
        height: size,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={isInteractive ? 'button' : 'img'}
      aria-label={ariaLabel}
      tabIndex={isInteractive ? 0 : -1}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Volumetric Radial Glow behind the flower */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${glowColor}33 0%, ${glowColor}11 45%, transparent 75%)`,
          transform: isHovered ? 'scale(1.35)' : 'scale(1.0)',
          filter: 'blur(16px)',
          opacity: 0.6 + b * 0.4,
        }}
      />

      <svg
        viewBox="0 0 400 400"
        className="w-full h-full overflow-visible transition-transform duration-1000"
        style={{
          filter: isHovered
            ? `drop-shadow(0 14px 35px ${glowColor}55)`
            : 'drop-shadow(0 8px 24px rgba(16, 9, 12, 0.85))',
        }}
      >
        <defs>
          {/* Gradients for Petal Velvet Realism */}
          <radialGradient id="petalVelvetDeep" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#E63956" />
            <stop offset="35%" stopColor="#C41E3A" />
            <stop offset="70%" stopColor="#8A1028" />
            <stop offset="100%" stopColor="#4A0815" />
          </radialGradient>

          <radialGradient id="petalVelvetDark" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#C41E3A" />
            <stop offset="50%" stopColor="#750E22" />
            <stop offset="100%" stopColor="#2E040D" />
          </radialGradient>

          <radialGradient id="petalGlowCenter" cx="48%" cy="48%" r="55%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="40%" stopColor="#D62845" />
            <stop offset="75%" stopColor="#800F2F" />
            <stop offset="100%" stopColor="#30040E" />
          </radialGradient>

          <linearGradient id="goldVeinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#92400E" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3F20" />
            <stop offset="40%" stopColor="#142B16" />
            <stop offset="100%" stopColor="#0B170C" />
          </linearGradient>

          <linearGradient id="sepalGrad" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#355E3B" />
            <stop offset="60%" stopColor="#1E3F20" />
            <stop offset="100%" stopColor="#5E1021" /> {/* hints of wine red in sepals */}
          </linearGradient>

          {/* Dew drop highlight filter */}
          <filter id="dewGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
            <feOffset dx="0.5" dy="0.5" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Curved Botanical Stem */}
        <path
          d="M 200 280 Q 206 330 195 385"
          fill="none"
          stroke="url(#stemGrad)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Thorns */}
        <path
          d="M 203 325 Q 218 322 222 328 Q 212 334 202 331 Z"
          fill="#5E1021"
          stroke="#1E3F20"
          strokeWidth="0.8"
        />
        <path
          d="M 197 355 Q 183 352 180 357 Q 189 363 198 360 Z"
          fill="#5E1021"
          stroke="#1E3F20"
          strokeWidth="0.8"
        />

        {/* 2. Calyx and Receptacle */}
        <ellipse cx="200" cy="275" rx="22" ry="14" fill="#1E3F20" />

        {/* Sepals curving outward beneath flower */}
        <g id="sepals">
          <path
            d="M 185 272 Q 130 290 115 320 Q 140 285 180 274 Z"
            fill="url(#sepalGrad)"
          />
          <path
            d="M 215 272 Q 270 290 285 320 Q 260 285 220 274 Z"
            fill="url(#sepalGrad)"
          />
          <path
            d="M 200 276 Q 200 325 198 340 Q 205 325 204 276 Z"
            fill="url(#sepalGrad)"
          />
        </g>

        {/* 3. LAYER 1: OUTER GUARD PETALS (Unfold wide when blooming) */}
        <g
          id="outerGuardPetals"
          style={{
            transformOrigin: '200px 200px',
            transform: `scale(${outerPetalScale}) rotate(${outerAngle}deg)`,
            transition: 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          {/* Outer Bottom Petal */}
          <path
            d="M 120 210 C 110 290 290 290 280 210 C 265 275 135 275 120 210 Z"
            fill="url(#petalVelvetDark)"
          />

          {/* Outer Left Guard */}
          <path
            d="M 125 150 C 60 170 80 270 170 260 C 95 240 85 180 125 150 Z"
            fill="url(#petalVelvetDeep)"
          />

          {/* Outer Right Guard */}
          <path
            d="M 275 150 C 340 170 320 270 230 260 C 305 240 315 180 275 150 Z"
            fill="url(#petalVelvetDeep)"
          />

          {/* Outer Top Left */}
          <path
            d="M 140 140 C 90 70 200 50 200 130 C 170 70 115 90 140 140 Z"
            fill="url(#petalVelvetDeep)"
          />

          {/* Outer Top Right */}
          <path
            d="M 260 140 C 310 70 200 50 200 130 C 230 70 285 90 260 140 Z"
            fill="url(#petalVelvetDeep)"
          />

          {/* Gilded Veins overlay if enabled */}
          {hasGoldVeins && (
            <g stroke="url(#goldVeinGrad)" strokeWidth="1.2" fill="none" opacity="0.6">
              <path d="M 200 200 Q 150 230 115 250" />
              <path d="M 200 200 Q 250 230 285 250" />
              <path d="M 200 200 Q 130 130 110 95" />
              <path d="M 200 200 Q 270 130 290 95" />
            </g>
          )}
        </g>

        {/* 4. LAYER 2: INTERMEDIATE PETALS (Velvet curves wrapping inward) */}
        <g
          id="intermediatePetals"
          style={{
            transformOrigin: '200px 200px',
            transform: `scale(${midPetalScale}) rotate(${midAngle}deg)`,
            transition: 'transform 1.0s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          {/* Left Wing Petal */}
          <path
            d="M 145 150 C 105 190 130 250 200 245 C 135 235 125 185 145 150 Z"
            fill="url(#petalVelvetDeep)"
          />

          {/* Right Wing Petal */}
          <path
            d="M 255 150 C 295 190 270 250 200 245 C 265 235 275 185 255 150 Z"
            fill="url(#petalVelvetDeep)"
          />

          {/* Upper Crest Petal */}
          <path
            d="M 160 120 C 170 85 230 85 240 120 C 215 95 185 95 160 120 Z"
            fill="url(#petalGlowCenter)"
          />

          {/* Cup Front Petal */}
          <path
            d="M 148 200 C 145 255 255 255 252 200 C 240 240 160 240 148 200 Z"
            fill="url(#petalVelvetDeep)"
          />
        </g>

        {/* 5. LAYER 3: INNER PETAL WHORLS & HEART */}
        <g
          id="innerHeart"
          style={{
            transformOrigin: '200px 200px',
            transform: `scale(${innerPetalScale})`,
            transition: 'transform 0.8s ease-out',
          }}
        >
          {/* Inner Spiral Petals */}
          <path
            d="M 170 165 C 150 190 170 230 205 220 C 165 215 160 185 170 165 Z"
            fill="url(#petalGlowCenter)"
          />

          <path
            d="M 230 165 C 250 190 230 230 195 220 C 235 215 240 185 230 165 Z"
            fill="url(#petalGlowCenter)"
          />

          {/* The Tight Central Rosebud Swirl */}
          <path
            d="M 182 178 C 176 195 204 212 214 195 C 218 185 208 172 195 174 C 187 175 184 184 190 190 C 196 193 203 189 200 183"
            fill="none"
            stroke="#6B0B1E"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <path
            d="M 188 180 C 184 190 206 200 210 188 C 210 180 200 175 193 178"
            fill="none"
            stroke="#FF4D6D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Golden Center Stamens (Visible at full bloom) */}
          <g style={{ opacity: stamenOpacity, transition: 'opacity 0.6s ease' }}>
            <circle cx="200" cy="190" r="1.8" fill="#FDE68A" />
            <circle cx="196" cy="186" r="1.5" fill="#FDE68A" />
            <circle cx="205" cy="187" r="1.5" fill="#FDE68A" />
            <circle cx="198" cy="194" r="1.4" fill="#F59E0B" />
            <circle cx="203" cy="193" r="1.4" fill="#F59E0B" />
          </g>
        </g>

        {/* 6. Realistic Morning Dew Droplets */}
        {hasDew && (
          <g id="dewDrops" filter="url(#dewGlow)">
            {/* Droplet on left guard petal */}
            <g transform="translate(136, 215)">
              <ellipse cx="0" cy="0" rx="3.5" ry="4.5" fill="rgba(255, 255, 255, 0.45)" />
              <circle cx="-1" cy="-1.5" r="1.2" fill="#FFFFFF" />
            </g>

            {/* Droplet on bottom right curve */}
            <g transform="translate(258, 238)">
              <ellipse cx="0" cy="0" rx="3" ry="3.5" fill="rgba(255, 255, 255, 0.4)" />
              <circle cx="-0.8" cy="-1" r="1" fill="#FFFFFF" />
            </g>

            {/* Micro droplet on upper petal */}
            <g transform="translate(178, 115)">
              <circle cx="0" cy="0" r="2" fill="rgba(255, 255, 255, 0.5)" />
              <circle cx="-0.5" cy="-0.5" r="0.7" fill="#FFFFFF" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

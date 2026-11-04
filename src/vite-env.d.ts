/// <reference types="vite/client" />

declare module 'lucide-react' {
  import * as React from 'react';
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }
  export const Volume2: React.FC<LucideProps>;
  export const VolumeX: React.FC<LucideProps>;
  export const Wind: React.FC<LucideProps>;
  export const Maximize2: React.FC<LucideProps>;
  export const Minimize2: React.FC<LucideProps>;
  export const Globe: React.FC<LucideProps>;
  export const Sparkles: React.FC<LucideProps>;
  export const Info: React.FC<LucideProps>;
  export const X: React.FC<LucideProps>;
  export const ChevronLeft: React.FC<LucideProps>;
  export const ChevronRight: React.FC<LucideProps>;
  export const ArrowRight: React.FC<LucideProps>;
  export const Play: React.FC<LucideProps>;
  export const Pause: React.FC<LucideProps>;
  export const RefreshCw: React.FC<LucideProps>;
  export const Heart: React.FC<LucideProps>;
  export const Droplets: React.FC<LucideProps>;
  export const Compass: React.FC<LucideProps>;
  export const Mail: React.FC<LucideProps>;
  export const Download: React.FC<LucideProps>;
  export const Copy: React.FC<LucideProps>;
  export const Check: React.FC<LucideProps>;
  export const RotateCcw: React.FC<LucideProps>;
  export const Award: React.FC<LucideProps>;
}

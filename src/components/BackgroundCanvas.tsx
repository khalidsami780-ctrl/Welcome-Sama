import React, { useEffect, useRef } from 'react';

interface BackgroundCanvasProps {
  intensity?: number;
  interactiveWind?: boolean;
  onPetalBurstTrigger?: (triggerFn: () => void) => void;
}

interface Petal {
  x: number;
  y: number;
  z: number; // depth
  size: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  vx: number;
  vy: number;
  vrx: number;
  vry: number;
  vrz: number;
  colorType: number;
  opacity: number;
}

interface DustParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  alphaSpeed: number;
  vx: number;
  vy: number;
  color: string;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({
  intensity = 1.0,
  interactiveWind = true,
  onPetalBurstTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0, active: false });
  const petalsRef = useRef<Petal[]>([]);
  const dustRef = useRef<DustParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const isTabVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Optimized Petal Counts for 60fps mobile efficiency
    const basePetals = isMobile ? 18 : 38;
    const petalCount = Math.floor(basePetals * intensity * (prefersReducedMotion ? 0.4 : 1));
    const petals: Petal[] = [];
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.75 + 0.25,
        size: Math.random() * 11 + 9,
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.2 : 0.5),
        vy: (Math.random() * 0.6 + 0.4) * (prefersReducedMotion ? 0.4 : 1),
        vrx: (Math.random() - 0.5) * 0.015,
        vry: (Math.random() - 0.5) * 0.015,
        vrz: (Math.random() - 0.5) * 0.01,
        colorType: Math.floor(Math.random() * 3),
        opacity: Math.random() * 0.35 + 0.5,
      });
    }
    petalsRef.current = petals;

    // Optimized Dust Particles
    const dustCount = Math.floor((isMobile ? 24 : 50) * (prefersReducedMotion ? 0.3 : 1));
    const dust: DustParticle[] = [];
    for (let i = 0; i < dustCount; i++) {
      dust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.0 + 0.6,
        alpha: Math.random() * 0.6 + 0.2,
        alphaSpeed: (Math.random() * 0.012 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2 - 0.08,
        color: Math.random() > 0.35 ? 'rgba(214, 40, 69,' : 'rgba(235, 198, 138,',
      });
    }
    dustRef.current = dust;

    // Burst trigger function
    const triggerPetalBurst = () => {
      petalsRef.current.forEach((p) => {
        p.vy = -(Math.random() * 3.5 + 2);
        p.vx = (Math.random() - 0.5) * 5;
        p.vrz = (Math.random() - 0.5) * 0.06;
      });
    };

    if (onPetalBurstTrigger) {
      onPetalBurstTrigger(triggerPetalBurst);
    }

    // Render loop
    const render = () => {
      if (!isTabVisibleRef.current) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle radial light following cursor (desktop only)
      if (!isMobile && mouseRef.current.active) {
        const radGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          380
        );
        radGrad.addColorStop(0, 'rgba(164, 22, 50, 0.12)');
        radGrad.addColorStop(0.5, 'rgba(94, 16, 33, 0.05)');
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Render Dust / Fireflies
      dustRef.current.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        d.alpha += d.alphaSpeed;

        if (d.alpha <= 0.1) {
          d.alpha = 0.1;
          d.alphaSpeed = -d.alphaSpeed;
        } else if (d.alpha >= 0.75) {
          d.alpha = 0.75;
          d.alphaSpeed = -d.alphaSpeed;
        }

        if (d.x < 0) d.x = width;
        if (d.x > width) d.x = 0;
        if (d.y < 0) d.y = height;
        if (d.y > height) d.y = 0;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `${d.color} ${d.alpha})`;
        ctx.fill();
      });

      // 3. Render and Update Falling Petals
      const m = mouseRef.current;
      petalsRef.current.forEach((p) => {
        p.x += p.vx + Math.sin(p.rotationY) * 0.35;
        p.y += p.vy * p.z;
        p.rotationX += p.vrx;
        p.rotationY += p.vry;
        p.rotationZ += p.vrz;

        // Interactive wind repulsion from mouse cursor
        if (interactiveWind && m.active) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;
          if (dist < maxDist && dist > 1) {
            const force = (1 - dist / maxDist) * 3.0;
            p.vx += (dx / dist) * force * 0.12 + m.vx * 0.04;
            p.vy += (dy / dist) * force * 0.12 + m.vy * 0.04;
            p.vrz += (Math.random() - 0.5) * 0.04;
          }
        }

        p.vx *= 0.985;
        if (p.vy < 0.35 * p.z) p.vy += 0.015;

        // Screen wrap
        if (p.y > height + 35) {
          p.y = -25;
          p.x = Math.random() * width;
          p.vy = Math.random() * 0.7 + 0.4;
        }
        if (p.x < -35) p.x = width + 25;
        if (p.x > width + 35) p.x = -25;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotationZ);
        ctx.scale(
          p.z * Math.cos(p.rotationY),
          p.z * Math.cos(p.rotationX)
        );

        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.8, -s * 0.9, s * 1.1, s * 0.3, 0, s);
        ctx.bezierCurveTo(-s * 1.1, s * 0.3, -s * 0.8, -s * 0.9, 0, -s);
        ctx.closePath();

        const grad = ctx.createRadialGradient(0, -s * 0.2, 0, 0, 0, s);
        if (p.colorType === 0) {
          grad.addColorStop(0, `rgba(214, 40, 69, ${p.opacity})`);
          grad.addColorStop(0.6, `rgba(164, 22, 50, ${p.opacity * 0.95})`);
          grad.addColorStop(1, `rgba(94, 16, 33, ${p.opacity * 0.85})`);
        } else if (p.colorType === 1) {
          grad.addColorStop(0, `rgba(180, 28, 55, ${p.opacity})`);
          grad.addColorStop(0.6, `rgba(110, 15, 35, ${p.opacity * 0.95})`);
          grad.addColorStop(1, `rgba(42, 7, 17, ${p.opacity * 0.9})`);
        } else {
          grad.addColorStop(0, `rgba(235, 60, 90, ${p.opacity * 0.9})`);
          grad.addColorStop(0.6, `rgba(164, 22, 50, ${p.opacity * 0.95})`);
          grad.addColorStop(1, `rgba(60, 10, 20, ${p.opacity * 0.8})`);
        }

        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // Performance: Pause animation when tab is inactive/hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isTabVisibleRef.current = false;
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      } else {
        isTabVisibleRef.current = true;
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleMouseMove = (e: MouseEvent) => {
      const nowX = e.clientX;
      const nowY = e.clientY;
      mouseRef.current.vx = nowX - mouseRef.current.lastX;
      mouseRef.current.vy = nowY - mouseRef.current.lastY;
      mouseRef.current.x = nowX;
      mouseRef.current.y = nowY;
      mouseRef.current.lastX = nowX;
      mouseRef.current.lastY = nowY;
      mouseRef.current.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const nowX = touch.clientX;
        const nowY = touch.clientY;
        mouseRef.current.vx = nowX - mouseRef.current.lastX;
        mouseRef.current.vy = nowY - mouseRef.current.lastY;
        mouseRef.current.x = nowX;
        mouseRef.current.y = nowY;
        mouseRef.current.lastX = nowX;
        mouseRef.current.lastY = nowY;
        mouseRef.current.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [intensity, interactiveWind, onPetalBurstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.92 }}
    />
  );
};

import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    let currentX = -100;
    let currentY = -100;
    let trailX = -100;
    let trailY = -100;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      currentX = e.clientX;
      currentY = e.clientY;
      setPos({ x: currentX, y: currentY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.tagName === 'INPUT' ||
          target.classList.contains('cursor-pointer'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);

    // Smooth trailing physics
    const loop = () => {
      trailX += (currentX - trailX) * 0.18;
      trailY += (currentY - trailY) * 0.18;
      setTrailPos({ x: trailX, y: trailY });
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Outer elastic ring */}
      <div
        className="fixed pointer-events-none z-50 rounded-full border border-rose-crimson/50 transition-[width,height,transform,border-color] duration-200 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${trailPos.x}px`,
          top: `${trailPos.y}px`,
          width: isHovered ? '56px' : isMouseDown ? '24px' : '36px',
          height: isHovered ? '56px' : isMouseDown ? '24px' : '36px',
          borderColor: isHovered ? 'rgba(214, 40, 69, 0.8)' : 'rgba(185, 154, 104, 0.45)',
          backgroundColor: isHovered ? 'rgba(164, 22, 50, 0.1)' : 'transparent',
          boxShadow: isHovered ? '0 0 20px rgba(214, 40, 69, 0.4)' : 'none',
        }}
      />

      {/* Center pinpoint */}
      <div
        className="fixed pointer-events-none z-50 rounded-full bg-petal-red -translate-x-1/2 -translate-y-1/2 transition-[transform,background-color] duration-150"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isMouseDown ? '8px' : '5px',
          height: isMouseDown ? '8px' : '5px',
          backgroundColor: isHovered ? '#F4E9DF' : '#D62845',
          boxShadow: '0 0 8px rgba(214, 40, 69, 0.9)',
        }}
      />
    </>
  );
};

import React, { useEffect, useRef } from 'react';

export const ThreadsBackground: React.FC<{ color?: string, amplitude?: number, distance?: number, speed?: number }> = ({ 
  color = "#ffffff", 
  amplitude = 1, 
  distance = 5, 
  speed = 0.5 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    
    let time = 0;
    
    // Wave parameters
    const waveCount = 40; 
    const wavelength = 400; 
    
    const resize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < waveCount; i++) {
        const progress = i / waveCount;
        // Pulse effect
        const alpha = 0.05 + Math.sin(time * 0.5 + progress * 2) * 0.15; 
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = Math.max(0, alpha); 
        ctx.lineWidth = 1;

        // Ribbon effect: Concentrate waves vertically in the middle-ish
        const centerY = height * 0.5;
        const spread = height * 0.3; 
        const baseY = centerY - spread / 2 + (spread * progress);

        for (let x = 0; x < width; x += 5) {
            // Horizontal stretching wave
            const yOffset = 
                Math.sin(x / wavelength + time * speed + i * 0.1) * (amplitude * 25) +
                Math.cos(x / (wavelength * 0.8) - time * speed * 0.5) * (amplitude * 15);
            
            const y = baseY + yOffset;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      time += 0.015;
      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [color, amplitude, distance, speed]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
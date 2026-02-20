import React, { useEffect, useRef } from 'react';

const KANA = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン海波水風浮世絵";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseY: number;
  char: string;
  color: string;
  size: number;
  mass: number;
  foamLife: number;
}

export const WaveCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const NUM_PARTICLES = Math.floor((width * height) / 300); 
    const baseSeaLevel = height * 0.65;

    const colors = [
      '#0f2b46', // Prussian blue
      '#1a3a5f', // Dark blue
      '#204b7a', // Mid blue
      '#3a6b9c', // Lighter blue
      '#5c8ebf', // Light blue
    ];

    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: Math.random() * width,
        y: baseSeaLevel + Math.random() * (height - baseSeaLevel),
        vx: 0,
        vy: 0,
        baseY: baseSeaLevel + Math.random() * (height - baseSeaLevel),
        char: KANA[Math.floor(Math.random() * KANA.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() > 0.9 ? 20 + Math.random() * 10 : 10 + Math.random() * 10,
        mass: 0.8 + Math.random() * 0.4,
        foamLife: 0
      });
    }

    let time = 0;
    let vortexX = width + 400;
    let vortexY = baseSeaLevel - 50;

    let animationFrameId: number;

    const render = () => {
      time += 0.005; // Much slower time
      
      // Clear with opacity for motion blur
      ctx.fillStyle = 'rgba(232, 227, 215, 0.35)'; // Old paper background
      ctx.fillRect(0, 0, width, height);

      // Move wave
      vortexX -= 1.5; // Much slower wave movement
      if (vortexX < -800) {
        vortexX = width + 800;
        vortexY = baseSeaLevel - 50 - Math.random() * 150;
      }

      const waveRadius = Math.min(width * 0.5, 500);
      const gravity = 0.5;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Spatial Grid for Repulsion
      const cellSize = 60;
      const gridCols = Math.ceil(width / cellSize);
      const gridRows = Math.ceil(height / cellSize);
      const grid: Particle[][] = new Array(gridCols * gridRows);
      for(let j=0; j<grid.length; j++) grid[j] = [];

      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = particles[i];

        // Base sea movement (swells)
        let targetY = p.baseY + Math.sin(p.x * 0.003 + time) * 40 + Math.sin(p.x * 0.008 + time * 1.5) * 20;
        
        // Buoyancy / spring towards target Y
        // Reduced spring force to allow more natural drift
        let dySea = targetY - p.y;
        p.vy += dySea * 0.005 * p.mass; 
        
        // Base horizontal flow
        p.vx += (-0.5 - p.vx) * 0.05;

        // Wave forces
        let dx = p.x - vortexX;
        let dy = p.y - vortexY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < waveRadius) {
          let force = Math.pow(1 - dist / waveRadius, 1.5);
          
          // Depth attenuation: Deep particles are less affected by the wave
          // This keeps the bottom of the screen filled
          const depth = Math.max(0, (p.baseY - baseSeaLevel) / (height - baseSeaLevel));
          
          // Stronger cutoff: Bottom 30% of particles are completely immune to the wave
          let depthFactor = 1;
          if (depth > 0.7) {
            depthFactor = 0;
          } else {
            // Linear falloff for the rest
            depthFactor = 1 - (depth / 0.7);
          }
          
          force *= depthFactor;

          // Add turbulence/noise to break up clumps
          if (force > 0.01) {
             p.vx += (Math.random() - 0.5) * force * 2.0;
             p.vy += (Math.random() - 0.5) * force * 2.0;

            if (dx < 0 && dy > -waveRadius * 0.2) {
              // Front face: sucked UP and LEFT
              p.vy -= force * 6.0;
              p.vx -= force * 3.5;
            } else if (dy <= -waveRadius * 0.2) {
              // Crest: thrown LEFT and DOWN (the breaking curl)
              p.vx -= force * 9.0 + Math.random() * 3;
              p.vy += force * 6.0 + (Math.random() - 0.5) * 5;
              p.foamLife = 1.0;
            } else if (dx > 0) {
              // Back face: slide DOWN and RIGHT
              p.vy += force * 2.5;
              p.vx += force * 1.5;
            }
          }
        }

        // Gravity
        p.vy += gravity * p.mass;

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.94; // Slightly less damping to allow drift
        p.vy *= 0.94;

        // Wrap around X
        if (p.x < -100) p.x = width + 100;
        if (p.x > width + 100) p.x = -100;

        // Floor collision
        if (p.y > height + 50) {
          p.y = height + 50;
          p.vy *= -0.5;
        }

        // Add to grid
        if (p.x >= 0 && p.x < width && p.y >= 0 && p.y < height) {
          const col = Math.floor(p.x / cellSize);
          const row = Math.floor(p.y / cellSize);
          const idx = row * gridCols + col;
          if (grid[idx]) grid[idx].push(p);
        }

        // Foam logic
        if (p.foamLife > 0) {
          p.foamLife -= 0.015;
        }
        // Random foam on peaks of normal waves
        if (p.y < targetY - 30 && Math.random() < 0.02) {
          p.foamLife = 0.6;
        }

        let isFoam = p.foamLife > 0;
        
        ctx.font = `${isFoam ? 'bold ' : ''}${p.size}px monospace`;
        ctx.fillStyle = isFoam ? `rgba(255, 255, 255, ${Math.min(1, p.foamLife + 0.5)})` : p.color;
        
        ctx.fillText(p.char, p.x, p.y);
      }

      // Repulsion Pass (Anti-Clumping)
      const minDist = 24; // Minimum separation distance
      const minDistSq = minDist * minDist;
      
      for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        if (cell.length < 2) continue;

        for (let a = 0; a < cell.length; a++) {
          for (let b = a + 1; b < cell.length; b++) {
            const p1 = cell[a];
            const p2 = cell[b];
            
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < minDistSq && distSq > 0.1) {
              const dist = Math.sqrt(distSq);
              const force = (minDist - dist) / minDist; // 0 to 1
              
              // Push apart
              const fx = (dx / dist) * force * 0.8;
              const fy = (dy / dist) * force * 0.8;

              p1.vx += fx;
              p1.vy += fy;
              p2.vx -= fx;
              p2.vy -= fy;
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      style={{ background: '#e8e3d7' }}
    />
  );
};

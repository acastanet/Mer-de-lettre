import React, { useEffect, useRef } from 'react';
import {
  ANIMATION_SPEED,
  PARTICLE_DENSITY,
  MAX_PARTICLES,
  BASE_SEA_LEVEL_RATIO,
  PARTICLE_SIZE_MIN,
  PARTICLE_SIZE_MAX,
  PARTICLE_SIZE_LARGE_MIN,
  PARTICLE_SIZE_LARGE_MAX,
  PARTICLE_MASS_MIN,
  PARTICLE_MASS_MAX,
  WAVE_FREQUENCY_1,
  WAVE_AMPLITUDE_1,
  WAVE_FREQUENCY_2,
  WAVE_AMPLITUDE_2,
  WAVE_SPEED_MULTIPLIER,
  WAVE_RADIUS_RATIO,
  WAVE_SPEED,
  WAVE_RESET_OFFSET,
  WAVE_Y_VARIATION,
  GRAVITY,
  SPRING_FORCE,
  BASE_FLOW_FORCE,
  FLOW_DAMPING,
  VELOCITY_DAMPING,
  TURBULENCE_FORCE,
  FOAM_LIFE_DECAY,
  FOAM_LIFE_INITIAL,
  FOAM_LIFE_RANDOM,
  FOAM_THRESHOLD,
  FOAM_PROBABILITY,
  GRID_CELL_SIZE,
  MIN_DISTANCE,
  REPULSION_FORCE,
  BOUNCE_DAMPING,
  FLOOR_OFFSET,
  WRAP_OFFSET,
  COLORS,
  BACKGROUND_COLOR,
  CANVAS_CLEAR_COLOR,
  KANA,
} from '../config';

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

interface WaveCanvasProps {
  isPaused?: boolean;
  particleDensity?: number;
}

export const WaveCanvas: React.FC<WaveCanvasProps> = ({
  isPaused = false,
  particleDensity = PARTICLE_DENSITY,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const vortexXRef = useRef(0);
  const vortexYRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number>(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const baseSeaLevelRef = useRef(0);
  const waveRadiusRef = useRef(0);

  // Initialiser les particules
  const initParticles = (width: number, height: number) => {
    const baseSeaLevel = height * BASE_SEA_LEVEL_RATIO;
    const numParticles = Math.min(
      Math.floor((width * height) / particleDensity),
      MAX_PARTICLES
    );

    const newParticles: Particle[] = [];
    for (let i = 0; i < numParticles; i++) {
      const isLarge = Math.random() > 0.9;
      newParticles.push({
        x: Math.random() * width,
        y: baseSeaLevel + Math.random() * (height - baseSeaLevel),
        vx: 0,
        vy: 0,
        baseY: baseSeaLevel + Math.random() * (height - baseSeaLevel),
        char: KANA[Math.floor(Math.random() * KANA.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: isLarge
          ? PARTICLE_SIZE_LARGE_MIN + Math.random() * (PARTICLE_SIZE_LARGE_MAX - PARTICLE_SIZE_LARGE_MIN)
          : PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN),
        mass: PARTICLE_MASS_MIN + Math.random() * (PARTICLE_MASS_MAX - PARTICLE_MASS_MIN),
        foamLife: 0,
      });
    }

    particlesRef.current = newParticles;
    baseSeaLevelRef.current = baseSeaLevel;
    waveRadiusRef.current = Math.min(width * WAVE_RADIUS_RATIO, 500);
  };

  // Initialiser le vortex
  const initVortex = (width: number, height: number) => {
    vortexXRef.current = width + WAVE_RESET_OFFSET;
    vortexYRef.current = baseSeaLevelRef.current - 50;
  };

  // Mettre à jour la taille du canvas
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    widthRef.current = width;
    heightRef.current = height;
    canvas.width = width;
    canvas.height = height;

    // Réinitialiser les particules et le vortex
    initParticles(width, height);
    initVortex(width, height);
  };

  // Rendu de l'animation
  const render = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    const width = widthRef.current;
    const height = heightRef.current;
    const particles = particlesRef.current;
    const baseSeaLevel = baseSeaLevelRef.current;
    const waveRadius = waveRadiusRef.current;

    // Mettre à jour le temps
    if (!isPaused) {
      timeRef.current += ANIMATION_SPEED;
    }

    // Effacer le canvas avec opacité pour le motion blur
    ctx.fillStyle = CANVAS_CLEAR_COLOR;
    ctx.fillRect(0, 0, width, height);

    // Mettre à jour le vortex
    if (!isPaused) {
      vortexXRef.current -= WAVE_SPEED;
      if (vortexXRef.current < -WAVE_RESET_OFFSET) {
        vortexXRef.current = width + WAVE_RESET_OFFSET;
        vortexYRef.current = baseSeaLevel - 50 - Math.random() * WAVE_Y_VARIATION;
      }
    }

    const vortexX = vortexXRef.current;
    const vortexY = vortexYRef.current;
    const time = timeRef.current;

    // Configuration du contexte pour le texte
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Grille spatiale pour la détection des collisions
    const cellSize = GRID_CELL_SIZE;
    const gridCols = Math.ceil(width / cellSize);
    const gridRows = Math.ceil(height / cellSize);
    const grid: Particle[][] = new Array(gridCols * gridRows);
    for (let j = 0; j < grid.length; j++) {
      grid[j] = [];
    }

    // Mettre à jour et dessiner les particules
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouvement de base de la mer (vagues)
      const targetY =
        p.baseY +
        Math.sin(p.x * WAVE_FREQUENCY_1 + time) * WAVE_AMPLITUDE_1 +
        Math.sin(p.x * WAVE_FREQUENCY_2 + time * WAVE_SPEED_MULTIPLIER) * WAVE_AMPLITUDE_2;

      // Force de rappel (ressort)
      const dySea = targetY - p.y;
      p.vy += dySea * SPRING_FORCE * p.mass;

      // Flux horizontal de base
      p.vx += (BASE_FLOW_FORCE - p.vx) * FLOW_DAMPING;

      // Forces de la vague
      const dx = p.x - vortexX;
      const dy = p.y - vortexY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < waveRadius) {
        const force = Math.pow(1 - dist / waveRadius, 1.5);

        // Atténuation par profondeur
        const depth = Math.max(0, (p.baseY - baseSeaLevel) / (height - baseSeaLevel));
        const depthFactor = 1 - depth * 0.8;
        const effectiveForce = force * depthFactor;

        // Turbulence aléatoire
        p.vx += (Math.random() - 0.5) * effectiveForce * TURBULENCE_FORCE;
        p.vy += (Math.random() - 0.5) * effectiveForce * TURBULENCE_FORCE;

        if (dx < 0 && dy > -waveRadius * 0.2) {
          // Face avant : aspirée vers le haut et la gauche
          p.vy -= effectiveForce * 6.0;
          p.vx -= effectiveForce * 3.5;
        } else if (dy <= -waveRadius * 0.2) {
          // Crête : projetée vers la gauche et le bas
          p.vx -= effectiveForce * 9.0 + Math.random() * 3;
          p.vy += effectiveForce * 6.0 + (Math.random() - 0.5) * 5;
          p.foamLife = FOAM_LIFE_INITIAL;
        } else if (dx > 0) {
          // Face arrière : glisse vers le bas et la droite
          p.vy += effectiveForce * 2.5;
          p.vx += effectiveForce * 1.5;
        }
      }

      // Gravité
      p.vy += GRAVITY * p.mass;

      // Appliquer la vélocité
      if (!isPaused) {
        p.x += p.vx;
        p.y += p.vy;
      }

      // Amortissement
      p.vx *= VELOCITY_DAMPING;
      p.vy *= VELOCITY_DAMPING;

      // Bouclage horizontal
      if (p.x < -WRAP_OFFSET) p.x = width + WRAP_OFFSET;
      if (p.x > width + WRAP_OFFSET) p.x = -WRAP_OFFSET;

      // Collision avec le sol
      if (p.y > height + FLOOR_OFFSET) {
        p.y = height + FLOOR_OFFSET;
        p.vy *= -BOUNCE_DAMPING;
      }

      // Ajouter à la grille
      if (p.x >= 0 && p.x < width && p.y >= 0 && p.y < height) {
        const col = Math.floor(p.x / cellSize);
        const row = Math.floor(p.y / cellSize);
        const idx = row * gridCols + col;
        if (grid[idx]) grid[idx].push(p);
      }

      // Logique de la mousse
      if (p.foamLife > 0) {
        p.foamLife -= FOAM_LIFE_DECAY;
      }
      // Mousse aléatoire sur les crêtes
      if (p.y < targetY - FOAM_THRESHOLD && Math.random() < FOAM_PROBABILITY) {
        p.foamLife = FOAM_LIFE_RANDOM;
      }

      const isFoam = p.foamLife > 0;
      ctx.font = `${isFoam ? 'bold ' : ''}${p.size}px monospace`;
      ctx.fillStyle = isFoam
        ? `rgba(255, 255, 255, ${Math.min(1, p.foamLife + 0.5)})`
        : p.color;

      ctx.fillText(p.char, p.x, p.y);
    }

    // Passe de répulsion (anti-amas)
    const minDistSq = MIN_DISTANCE * MIN_DISTANCE;
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
            const force = (MIN_DISTANCE - dist) / MIN_DISTANCE;

            // Repousser les particules
            const fx = (dx / dist) * force * REPULSION_FORCE;
            const fy = (dy / dist) * force * REPULSION_FORCE;

            p1.vx += fx;
            p1.vy += fy;
            p2.vx -= fx;
            p2.vy -= fy;
          }
        }
      }
    }

    // Continuer l'animation
    if (!isPaused) {
      animationFrameIdRef.current = requestAnimationFrame(render);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Initialiser les dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    widthRef.current = width;
    heightRef.current = height;
    canvas.width = width;
    canvas.height = height;

    // Initialiser les particules et le vortex
    initParticles(width, height);
    initVortex(width, height);

    // Démarrer l'animation
    animationFrameIdRef.current = requestAnimationFrame(render);

    // Gérer le redimensionnement
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [particleDensity]);

  // Gérer la pause/reprise
  useEffect(() => {
    if (isPaused) {
      cancelAnimationFrame(animationFrameIdRef.current);
    } else {
      animationFrameIdRef.current = requestAnimationFrame(render);
    }
    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [isPaused]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      style={{ background: BACKGROUND_COLOR }}
      aria-label="Animation de vagues avec des caractères japonais"
      role="img"
    />
  );
};

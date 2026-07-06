/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WaveCanvas } from './components/WaveCanvas';
import { PARTICLE_DENSITY } from './config';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  const [particleDensity, setParticleDensity] = useState(PARTICLE_DENSITY);
  const [showControls, setShowControls] = useState(false);

  const handleDensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParticleDensity(Number(e.target.value));
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#e8e3d7]">
      <WaveCanvas isPaused={isPaused} particleDensity={particleDensity} />

      {/* Overlay avec titre */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
        <div className="bg-[#e8e3d7]/70 backdrop-blur-md p-6 rounded-3xl border border-[#0f2b46]/10 shadow-2xl text-center transform -translate-y-12 transition-all duration-1000 hover:bg-[#e8e3d7]/90">
          <h1 className="text-4xl md:text-6xl font-serif text-[#0f2b46] mb-4 tracking-tighter">
            La Mer de Lettres
          </h1>
          <p className="text-lg md:text-xl text-[#204b7a] font-light tracking-[0.2em] uppercase">
            Une vague d'Hokusai générative
          </p>
        </div>
      </div>

      {/* Bouton pour afficher/masquer les contrôles */}
      <button
        onClick={toggleControls}
        className="fixed bottom-6 left-6 z-20 bg-[#0f2b46]/80 hover:bg-[#0f2b46] text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg"
        aria-label={showControls ? "Masquer les contrôles" : "Afficher les contrôles"}
      >
        {showControls ? '✕ Fermer' : '⚙️ Contrôles'}
      </button>

      {/* Panneau de contrôles */}
      {showControls && (
        <div className="fixed bottom-20 left-6 z-20 bg-[#e8e3d7]/90 backdrop-blur-md p-4 rounded-lg border border-[#0f2b46]/20 shadow-xl w-64">
          <div className="space-y-4">
            {/* Bouton Pause/Reprise */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#0f2b46]">
                {isPaused ? 'Reprendre' : 'Pause'}
              </label>
              <button
                onClick={togglePause}
                className="bg-[#0f2b46] hover:bg-[#1a3a5f] text-white px-3 py-1 rounded-md transition-colors"
                aria-label={isPaused ? 'Reprendre l\'animation' : 'Mettre en pause'}
              >
                {isPaused ? '▶' : '⏸'}
              </button>
            </div>

            {/* Contrôle de la densité des particules */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#0f2b46]">
                Densité des particules: {particleDensity}
              </label>
              <input
                type="range"
                min="100"
                max="500"
                step="10"
                value={particleDensity}
                onChange={handleDensityChange}
                className="w-full h-2 bg-[#0f2b46]/20 rounded-lg appearance-none cursor-pointer accent-[#0f2b46]"
                aria-label="Contrôle de la densité des particules"
              />
              <div className="flex justify-between text-xs text-[#204b7a]">
                <span>Moins</span>
                <span>Plus</span>
              </div>
            </div>

            {/* Réduire le mouvement (accessibilité) */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="reduce-motion"
                className="accent-[#0f2b46]"
                aria-label="Réduire le mouvement"
              />
              <label htmlFor="reduce-motion" className="text-sm text-[#204b7a]">
                Réduire le mouvement
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Instructions pour mobile */}
      <div className="fixed bottom-6 right-6 z-20 bg-[#e8e3d7]/80 backdrop-blur-md p-3 rounded-lg border border-[#0f2b46]/10 shadow-lg max-w-xs text-sm text-[#0f2b46]">
        <p>Appuyez sur ⚙️ pour afficher les contrôles.</p>
      </div>
    </div>
  );
}

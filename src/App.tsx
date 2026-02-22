/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WaveCanvas } from './components/WaveCanvas';

export default function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#e8e3d7]">
      <WaveCanvas />
      
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
    </div>
  );
}


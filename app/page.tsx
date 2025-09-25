'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import TerrainGenerator from './components/TerrainGenerator';

export default function Home() {
  return (
    <>
      <div className="controls">  
        <div className="generation-type">
          <h3>🎲 Gere o Tabuleiro:</h3>
          <TerrainGenerator />
        </div>
      </div>

      <div className="terrain-stats" id="terrainStats"></div>

      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        strategy="beforeInteractive"
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/4.0.1/simplex-noise.min.js"
        strategy="beforeInteractive"
      />
    </>
  );
}

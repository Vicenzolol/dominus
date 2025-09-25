'use client';

import { useState, useEffect, useRef } from 'react';

// Configurações do tabuleiro
const BOARD_SIZE = 26;
const TERRAIN_DISTRIBUTION = {
  "light-green": 0.84,
  "dark-green": 0.08,
  "gray": 0.08,
};

export default function TerrainGenerator() {
  const [boardData, setBoardData] = useState<string[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const [coordInfo, setCoordInfo] = useState<{
    visible: boolean;
    coordinate: string;
    terrain: string;
  }>({
    visible: false,
    coordinate: '',
    terrain: ''
  });

  // Gerar rótulos de coluna (A-Z)
  const generateColumnLabels = () => {
    return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  };

  // Gerar rótulos de linha (1-26)
  const generateRowLabels = () => {
    return Array.from({ length: 26 }, (_, i) => (i + 1).toString());
  };

  // Gerar terreno aleatório
  const generateRandomTerrain = () => {
    const totalCells = BOARD_SIZE * BOARD_SIZE;
    const terrain: string[] = [];

    // Calcular quantidades de cada tipo
    const lightGreenCount = Math.round(totalCells * TERRAIN_DISTRIBUTION["light-green"]);
    const darkGreenCount = Math.round(totalCells * TERRAIN_DISTRIBUTION["dark-green"]);
    const grayCount = totalCells - lightGreenCount - darkGreenCount;

    // Preencher array com tipos de terreno
    for (let i = 0; i < lightGreenCount; i++) {
      terrain.push("light-green");
    }
    for (let i = 0; i < darkGreenCount; i++) {
      terrain.push("dark-green");
    }
    for (let i = 0; i < grayCount; i++) {
      terrain.push("gray");
    }

    // Embaralhar array usando algoritmo Fisher-Yates
    for (let i = terrain.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [terrain[i], terrain[j]] = [terrain[j], terrain[i]];
    }

    return terrain;
  };

  // Gerar terreno aleatório
  const generateTerrain = () => {
    const newTerrain = generateRandomTerrain();
    setBoardData(newTerrain);
    updateTerrainStats(newTerrain);
  };

  // Atualizar estatísticas do terreno
  const updateTerrainStats = (terrain: string[]) => {
    const stats = {
      'light-green': 0,
      'dark-green': 0,
      'gray': 0,
    };

    terrain.forEach(type => {
      stats[type as keyof typeof stats]++;
    });

    const total = terrain.length;
    const statsElement = document.getElementById('terrainStats');
    if (statsElement) {
      statsElement.innerHTML = `
        <h3>📊 Estatísticas do Terreno:</h3>
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
          <div>🟢 Verde Claro: ${stats['light-green']} (${((stats['light-green'] / total) * 100).toFixed(1)}%)</div>
          <div>🌲 Verde Escuro: ${stats['dark-green']} (${((stats['dark-green'] / total) * 100).toFixed(1)}%)</div>
          <div>⬜ Cinza: ${stats['gray']} (${((stats['gray'] / total) * 100).toFixed(1)}%)</div>
        </div>
      `;
    }
  };

  // Baixar imagem do tabuleiro
  const downloadBoard = async () => {
    if (!boardRef.current) return;

    try {
      // @ts-expect-error - html2canvas será carregado dinamicamente
      const canvas = await html2canvas(boardRef.current, {
        backgroundColor: '#F5F3F0',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `dominus-tabuleiro-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Erro ao baixar imagem:', error);
      alert('Erro ao gerar imagem. Tente novamente.');
    }
  };

  // Gerar tabuleiro inicial
  useEffect(() => {
    generateTerrain();
  }, []);

  // Manipular clique na célula
  const handleCellClick = (row: number, col: number, terrainType: string) => {
    const columnLabel = String.fromCharCode(65 + col);
    const rowLabel = (row + 1).toString();
    const coordinate = `${columnLabel}${rowLabel}`;
    
    const terrainNames = {
      'light-green': 'Verde Claro',
      'dark-green': 'Verde Escuro',
      'gray': 'Cinza'
    };
    
    // Mostrar o card de informações
    setCoordInfo({
      visible: true,
      coordinate: coordinate,
      terrain: terrainNames[terrainType as keyof typeof terrainNames]
    });
    
    // Configurar timer para esconder após 3 segundos
    setTimeout(() => {
      setCoordInfo(prev => ({...prev, visible: false}));
    }, 3000);
  };

  return (
    <div className="terrain-generator">
      {/* Card de informação da coordenada */}
      {coordInfo.visible && (
        <div className="coord-info-card">
          <div className="coord-info-content">
            <div className="coord-badge">{coordInfo.coordinate}</div>
            <div className="terrain-type">{coordInfo.terrain}</div>
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button 
          className="btn btn-primary" 
          onClick={generateTerrain}
        >
          🔄 Reordenar Terreno
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={downloadBoard}
        >
          📥 Baixar Imagem
        </button>
      </div>

      <div className="board-container" ref={boardRef}>
        {/* Célula do canto superior esquerdo */}
        <div className="corner-cell"></div>
        
        {/* Coordenadas das colunas (A-Z) */}
        <div className="column-headers">
          <div className="column-labels">
            {generateColumnLabels().map((label) => (
              <div key={label} className="column-label">
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Tabuleiro principal */}
        <div className="board-wrapper">
          {/* Headers das linhas */}
          <div className="row-headers">
            {generateRowLabels().map((label) => (
              <div key={label} className="row-label">
                {label}
              </div>
            ))}
          </div>

          {/* Tabuleiro */}
          <div className="board">
            {boardData.map((terrainType, index) => {
              const row = Math.floor(index / BOARD_SIZE);
              const col = index % BOARD_SIZE;
              return (
                <div
                  key={index}
                  className={`cell ${terrainType}`}
                  onClick={() => handleCellClick(row, col, terrainType)}
                  title={`${String.fromCharCode(65 + col)}${row + 1} - ${terrainType}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="legend">
        <h3>📋 Legenda:</h3>
        <div className="generation-info">
          <strong>Tipo:</strong> 🎯 Geração Aleatória
        </div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="color-sample light-green"></div>
            <span>🟢 Verde Claro (84% - Campo aberto)</span>
          </div>
          <div className="legend-item">
            <div className="color-sample dark-green"></div>
            <span>🌲 Verde Escuro (8% - Floresta densa)</span>
          </div>
          <div className="legend-item">
            <div className="color-sample gray"></div>
            <span>⬜ Cinza (8% - Montanha/Rochedo)</span>
          </div>
        </div>
      </div>
    </div>
  );
}